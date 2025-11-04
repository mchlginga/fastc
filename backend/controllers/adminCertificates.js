const Certificate = require("../models/certificate");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const { statusCodes } = require("../utils/constant");
const { generateCertificatePDF } = require("./certificate");
const { cloudinary } = require("../config/cloudinary");

// Generate verification code
function generateVerificationCode() {
    return "FAST-C" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Get all certificates with filtering and pagination
exports.getCertificates = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            course = "",
            user = "",
            sortBy = "completionDate",
            sortOrder = "desc",
        } = req.query;

        // Build filter object
        let filter = {};

        // Status filter
        if (status && status !== "all") {
            filter.status = status;
        }

        // Course filter
        if (course && course !== "all") {
            filter.course = course;
        }

        // User filter
        if (user && user !== "all") {
            filter.user = user;
        }

        // Execute query with pagination and population
        const sortConfig = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

        const certificates = await Certificate.find(filter)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .populate("enrollment")
            .sort(sortConfig) // ← Now sortConfig is defined
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Apply search filter after population with null-safe checks
        let filteredCertificates = certificates;
        if (search) {
            filteredCertificates = certificates.filter((certificate) => {
                const user = certificate.user || {};
                const course = certificate.course || {};

                return (
                    user.firstName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.surname
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    user.email?.toLowerCase().includes(search.toLowerCase()) ||
                    user.companyName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    course.title
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    certificate.verificationCode
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                );
            });
        }

        // Format certificates with additional calculated fields and null-safe checks
        const formattedCertificates = filteredCertificates.map(
            (certificate) => {
                const isExpired = certificate.expirationDate
                    ? new Date() > new Date(certificate.expirationDate)
                    : false;

                const effectiveStatus =
                    certificate.status === "active" && isExpired
                        ? "expired"
                        : certificate.status;

                return {
                    ...certificate,
                    effectiveStatus,
                    isExpired,
                    daysUntilExpiry: certificate.expirationDate
                        ? Math.ceil(
                              (new Date(certificate.expirationDate) -
                                  new Date()) /
                                  (1000 * 60 * 60 * 24)
                          )
                        : null,
                };
            }
        );

        // Get total count for pagination
        const total = await Certificate.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            certificates: formattedCertificates,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalCertificates: total,
                certificatesPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get certificate statistics
exports.getCertificateStats = async (req, res, next) => {
    try {
        const totalCertificates = await Certificate.countDocuments();
        const activeCertificates = await Certificate.countDocuments({
            status: "active",
        });
        const expiredCertificates = await Certificate.countDocuments({
            status: "expired",
        });
        const revokedCertificates = await Certificate.countDocuments({
            status: "revoked",
        });

        // Certificates by course
        const courseStats = await Certificate.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $unwind: "$course",
            },
            {
                $group: {
                    _id: "$course.title",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        // Recent certificates (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentCertificates = await Certificate.countDocuments({
            completionDate: { $gte: thirtyDaysAgo },
        });

        // Certificates expiring soon (within 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringSoon = await Certificate.countDocuments({
            expirationDate: {
                $lte: thirtyDaysFromNow,
                $gte: new Date(),
            },
            status: "active",
        });

        res.status(statusCodes.OK).json({
            success: true,
            stats: {
                total: totalCertificates,
                active: activeCertificates,
                expired: expiredCertificates,
                revoked: revokedCertificates,
                recentCertificates: recentCertificates,
                expiringSoon: expiringSoon,
                byCourse: courseStats,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get certificate by ID
exports.getCertificateById = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate(
                "user",
                "firstName surname email companyName role profilePic contactNumber"
            )
            .populate(
                "course",
                "title category skillLevel duration image description"
            )
            .populate("enrollment");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // Calculate additional fields
        const isExpired = new Date() > new Date(certificate.expirationDate);
        const effectiveStatus =
            certificate.status === "active" && isExpired
                ? "expired"
                : certificate.status;

        const certificateWithStatus = {
            ...certificate.toObject(),
            effectiveStatus,
            isExpired,
            daysUntilExpiry: Math.ceil(
                (new Date(certificate.expirationDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
            ),
        };

        res.status(statusCodes.OK).json({
            success: true,
            certificate: certificateWithStatus,
        });
    } catch (error) {
        next(error);
    }
};

// Update certificate status
exports.updateCertificateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["active", "expired", "revoked"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: `Certificate status updated to ${status}`,
            certificate,
        });
    } catch (error) {
        next(error);
    }
};

// Bulk update certificate status
exports.bulkUpdateCertificateStatus = async (req, res, next) => {
    try {
        const { certificateIds, status } = req.body;

        if (
            !certificateIds ||
            !Array.isArray(certificateIds) ||
            certificateIds.length === 0
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Certificate IDs array is required",
            });
        }

        if (!["active", "expired", "revoked"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const result = await Certificate.updateMany(
            { _id: { $in: certificateIds } },
            { status }
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: `Updated ${result.modifiedCount} certificates to ${status}`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        next(error);
    }
};

// Revoke certificate
exports.revokeCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { status: "revoked" },
            { new: true, runValidators: true }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Certificate revoked successfully",
            certificate,
        });
    } catch (error) {
        next(error);
    }
};

// Regenerate certificate
exports.regenerateCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate("user")
            .populate("course")
            .populate("enrollment");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // 🆕 FIX: Use current date for new expiration date
        const completionDate = certificate.completionDate || new Date();
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year from now

        // Generate new certificate file
        const certificateUrl = await generateCertificatePDF(
            certificate.user,
            certificate.course,
            completionDate,
            expirationDate
        );

        // Generate new verification code
        const newVerificationCode = generateVerificationCode();

        // 🆕 FIX: Update completion date to current date as well
        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            {
                certificateUrl,
                verificationCode: newVerificationCode,
                status: "active",
                completionDate: new Date(), // Update completion date
                expirationDate, // Use new expiration date
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        res.status(statusCodes.OK).json({
            success: true,
            message: "Certificate regenerated successfully",
            certificate: updatedCertificate,
        });
    } catch (error) {
        next(error);
    }
};

// Delete certificate
exports.deleteCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // Delete the certificate file from Cloudinary
        if (certificate.certificateUrl) {
            try {
                const urlParts = certificate.certificateUrl.split("/");
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split(".")[0];
                const fullPublicId = `fastc/certificates/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId, {
                    resource_type: "raw",
                });
            } catch (fileError) {
                console.error(
                    "Error deleting certificate file from Cloudinary:",
                    fileError
                );
                // Continue with database deletion even if file deletion fails
            }
        }

        await Certificate.findByIdAndDelete(req.params.id);

        res.status(statusCodes.OK).json({
            success: true,
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Download certificate
exports.downloadCertificate = async (req, res, next) => {
    const { id } = req.params;

    try {
        console.log(`📥 Admin download request for certificate: ${id}`);

        const certificate = await Certificate.findById(id)
            .populate("user")
            .populate("course");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        console.log(`📄 Certificate URL: ${certificate.certificateUrl}`);

        // Cloudinary URL - redirect to Cloudinary download
        if (certificate.certificateUrl) {
            // Instead of redirecting, return the URL for frontend handling
            res.status(statusCodes.OK).json({
                success: true,
                certificateUrl: certificate.certificateUrl,
                filename: `FAST-C_Certificate_${certificate.course.title.replace(
                    /\s+/g,
                    "_"
                )}.pdf`,
                message: "Certificate URL retrieved successfully",
            });
        } else {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate file not found",
            });
        }
    } catch (error) {
        console.error(`❌ Download error: ${error.message}`);
        next(error);
    }
};

// Verify certificate (admin version)
exports.verifyCertificate = async (req, res, next) => {
    const { verificationCode } = req.query;

    try {
        if (!verificationCode) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Verification code is required",
            });
        }

        const certificate = await Certificate.findOne({ verificationCode })
            .populate("user", "firstName surname email companyName role")
            .populate("course", "title description duration category")
            .populate("enrollment");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found or invalid verification code",
            });
        }

        // Check certificate status
        const isExpired = new Date() > new Date(certificate.expirationDate);
        const isRevoked = certificate.status === "revoked";
        const effectiveStatus = isRevoked
            ? "revoked"
            : isExpired
            ? "expired"
            : "active";

        res.status(statusCodes.OK).json({
            success: true,
            certificate: {
                id: certificate._id,
                title: certificate.title,
                recipient: {
                    name:
                        certificate.user.role === "company"
                            ? certificate.user.companyName
                            : `${certificate.user.firstName} ${certificate.user.surname}`,
                    email: certificate.user.email,
                    role: certificate.user.role,
                },
                course: {
                    title: certificate.course.title,
                    description: certificate.course.description,
                    duration: certificate.course.duration,
                    category: certificate.course.category,
                },
                completionDate: certificate.completionDate,
                expirationDate: certificate.expirationDate,
                status: effectiveStatus,
                issuedBy: certificate.issuedBy,
                verificationCode: certificate.verificationCode,
                verifiedAt: new Date(),
                isExpired,
                isRevoked,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.createCertificate = async (req, res, next) => {
    try {
        const {
            userId,
            courseId,
            enrollmentId,
            completionDate,
            expirationDate,
        } = req.body;

        // Validate required fields
        if (!userId || !courseId) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "User ID and Course ID are required",
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if enrollment exists (if provided)
        let enrollment = null;
        if (enrollmentId) {
            enrollment = await Enrollment.findById(enrollmentId);
            if (!enrollment) {
                return res.status(statusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Enrollment not found",
                });
            }
        }

        // Check if certificate already exists for this user and course
        const existingCertificate = await Certificate.findOne({
            user: userId,
            course: courseId,
        });

        if (existingCertificate) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Certificate already exists for this user and course",
            });
        }

        // Set dates
        const compDate = completionDate ? new Date(completionDate) : new Date();
        const expDate = expirationDate
            ? new Date(expirationDate)
            : new Date(compDate);
        expDate.setFullYear(expDate.getFullYear() + 1); // Default 1 year validity

        // Generate certificate PDF
        const certificateUrl = await generateCertificatePDF(
            user,
            course,
            compDate,
            expDate
        );

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create certificate record - handle enrollment field properly
        const certificateData = {
            user: userId,
            course: courseId,
            title: course.title,
            completionDate: compDate,
            expirationDate: expDate,
            certificateUrl,
            status: "active",
            verificationCode,
            issuedBy: "FAST-C",
        };

        // Only add enrollment if it exists
        if (enrollmentId) {
            certificateData.enrollment = enrollmentId;
        }

        const certificate = await Certificate.create(certificateData);

        // Populate the created certificate for response
        const populatedCertificate = await Certificate.findById(certificate._id)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .populate("enrollment");

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "Certificate created successfully",
            certificate: populatedCertificate,
        });
    } catch (error) {
        next(error);
    }
};

exports.bulkRegenerateCertificates = async (req, res, next) => {
    try {
        const { certificateIds } = req.body;

        if (
            !certificateIds ||
            !Array.isArray(certificateIds) ||
            certificateIds.length === 0
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Certificate IDs array is required",
            });
        }

        const results = {
            successful: 0,
            failed: 0,
            details: [],
        };

        // Process each certificate individually
        for (const certificateId of certificateIds) {
            try {
                const certificate = await Certificate.findById(certificateId)
                    .populate("user")
                    .populate("course")
                    .populate("enrollment");

                if (!certificate) {
                    results.failed++;
                    results.details.push({
                        certificateId,
                        success: false,
                        error: "Certificate not found",
                    });
                    continue;
                }

                // Use current date for new expiration date
                const completionDate = certificate.completionDate || new Date();
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 1);

                // Generate new certificate file
                const certificateUrl = await generateCertificatePDF(
                    certificate.user,
                    certificate.course,
                    completionDate,
                    expirationDate
                );

                // Generate new verification code
                const newVerificationCode = generateVerificationCode();

                // Update certificate
                const updatedCertificate = await Certificate.findByIdAndUpdate(
                    certificateId,
                    {
                        certificateUrl,
                        verificationCode: newVerificationCode,
                        status: "active",
                        completionDate: new Date(),
                        expirationDate,
                        updatedAt: new Date(),
                    },
                    { new: true, runValidators: true }
                )
                    .populate(
                        "user",
                        "firstName surname email companyName role profilePic"
                    )
                    .populate(
                        "course",
                        "title category skillLevel duration image"
                    );

                results.successful++;
                results.details.push({
                    certificateId,
                    success: true,
                    certificate: updatedCertificate,
                });
            } catch (error) {
                console.error(
                    `Error regenerating certificate ${certificateId}:`,
                    error
                );
                results.failed++;
                results.details.push({
                    certificateId,
                    success: false,
                    error: error.message,
                });
            }
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: `Bulk regeneration completed: ${results.successful} successful, ${results.failed} failed`,
            results,
        });
    } catch (error) {
        next(error);
    }
};

exports.bulkExpireCertificates = async (req, res, next) => {
    try {
        const { certificateIds } = req.body;

        if (
            !certificateIds ||
            !Array.isArray(certificateIds) ||
            certificateIds.length === 0
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Certificate IDs array is required",
            });
        }

        // Set expiration date to current date to mark as expired
        const expirationDate = new Date();

        const result = await Certificate.updateMany(
            { _id: { $in: certificateIds } },
            {
                status: "expired",
                expirationDate: expirationDate,
            }
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: `Expired ${result.modifiedCount} certificates`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        next(error);
    }
};
