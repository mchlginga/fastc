const Certificate = require("../models/certificate");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const PDFDocument = require("pdfkit");
const { statusCodes } = require("../utils/constant");
const { cloudinary } = require("../config/cloudinary");
const config = require("../config/index");

// generate cert - UPDATED FOR CLOUDINARY
const generateCertificatePDF = (
    user,
    course,
    completionDate,
    expirationDate
) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 50,
        });

        // 🆕 Create buffers instead of file system
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);

            try {
                // 🆕 Upload to Cloudinary as RAW file
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                resource_type: "raw",
                                folder: "fastc/certificates",
                                public_id: `certificate_${user._id}_${
                                    course._id
                                }_${Date.now()}`,
                                format: "pdf",
                            },
                            (error, result) => {
                                if (error) {
                                    console.error(
                                        "Error uploading certificate to Cloudinary:",
                                        error
                                    );
                                    reject(error);
                                } else {
                                    console.log(
                                        "Certificate uploaded to Cloudinary:",
                                        result.secure_url
                                    );
                                    resolve(result);
                                }
                            }
                        )
                        .end(pdfData);
                });

                resolve(result.secure_url);
            } catch (uploadError) {
                reject(uploadError);
            }
        });

        // Your existing PDF generation code
        function centerText(text, y, options = {}) {
            doc.text(text, 50, y, {
                width: doc.page.width - 100,
                align: "center",
                ...options,
            });
        }

        // Certificate design (your existing code)
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .lineWidth(4)
            .strokeColor("#3B82F6")
            .stroke();
        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
            .lineWidth(1)
            .strokeColor("#93C5FD")
            .stroke();
        doc.fontSize(120)
            .fillColor("#F3F4F6")
            .opacity(0.25)
            .rotate(-30, { origin: [400, 300] })
            .text("FAST-C", 100, 250, { align: "center", width: 600 });
        doc.rotate(30, { origin: [400, 300] }).opacity(1);
        doc.font("Times-Bold").fontSize(24).fillColor("#1E3A8A");
        centerText("FERNANDINO ASSESSMENT AND SKILLS TRAINING CENTER", 80);
        doc.font("Times-Roman").fontSize(18).fillColor("#374151");
        centerText("Certificate of Completion", 120);
        doc.font("Times-Roman").fontSize(14).fillColor("#111827");
        centerText("This certificate is proudly presented to", 180);
        doc.font("Times-Bold").fontSize(30).fillColor("#000000");
        centerText(user.name, 215);
        doc.font("Times-Roman").fontSize(14).fillColor("#111827");
        centerText("For successfully completing the training course on", 260);
        doc.font("Times-Bold").fontSize(22).fillColor("#1E3A8A");
        centerText(course.title, 290);
        doc.font("Times-Roman").fontSize(12).fillColor("#374151");
        centerText(`Completion Date: ${completionDate.toDateString()}`, 360);
        centerText(`Expiration Date: ${expirationDate.toDateString()}`, 380);

        const sigY = 460;
        const marginX = 70;
        const sectionWidth = (doc.page.width - marginX * 2) / 2;
        doc.moveTo(marginX, sigY)
            .lineTo(marginX + sectionWidth - 40, sigY)
            .strokeColor("#6B7280")
            .stroke();
        doc.fontSize(10)
            .fillColor("#111827")
            .text("Authorized Signature", marginX, sigY + 5, {
                width: sectionWidth - 40,
                align: "center",
            });
        const rightStart = marginX + sectionWidth + 40;
        doc.moveTo(rightStart, sigY)
            .lineTo(marginX + sectionWidth * 2, sigY)
            .stroke();
        doc.text("Training Director", rightStart, sigY + 5, {
            width: sectionWidth - 40,
            align: "center",
        });

        doc.fontSize(8).fillColor("#6B7280");
        centerText(
            "Issued by FAST-C Digital Profiling and Certification System",
            doc.page.height - 60
        );
        doc.end();
    });
};

// Manual certificate generation endpoint
exports.generateCertificate = async (req, res, next) => {
    const { enrollmentId } = req.body;
    const userId = req.user.id;

    try {
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: "completed",
        })
            .populate("course")
            .populate("user");

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Completed enrollment not found",
            });
        }

        // Check if certificate already exists
        const existingCertificate = await Certificate.findOne({
            enrollment: enrollmentId,
        });

        if (existingCertificate) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Certificate already exists for this enrollment",
                certificate: existingCertificate,
            });
        }

        // 🆕 ADD: Validate course data
        if (!enrollment.course || !enrollment.course.title) {
            console.error(
                `❌ [Certificate] Invalid course data:`,
                enrollment.course
            );
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Course data is invalid",
            });
        }

        // Generate certificate
        const completionDate = enrollment.completedAt || new Date();
        const expirationDate = new Date(completionDate);
        expirationDate.setFullYear(completionDate.getFullYear() + 1);

        const certificateUrl = await generateCertificatePDF(
            enrollment.user,
            enrollment.course,
            completionDate,
            expirationDate
        );

        // 🆕 FIX: Use consistent title format
        const certificateTitle = `${enrollment.course.title}`;
        console.log(
            `📝 [Certificate] Creating certificate with title: "${certificateTitle}"`
        );

        // Create certificate record
        const certificate = await Certificate.create({
            user: userId,
            course: enrollment.course._id,
            enrollment: enrollmentId,
            title: certificateTitle,
            completionDate,
            expirationDate,
            certificateUrl,
            status: "active",
            verificationCode: generateVerificationCode(),
            issuedBy: "FAST-C",
        });

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "Certificate generated successfully",
            certificate: {
                id: certificate._id,
                title: certificate.title,
                completionDate: certificate.completionDate,
                expirationDate: certificate.expirationDate,
                certificateUrl: certificate.certificateUrl,
                verificationCode: certificate.verificationCode,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Download certificate - UPDATED FOR CLOUDINARY
exports.downloadCertificate = async (req, res, next) => {
    const { certificateId } = req.params;
    const userId = req.user.id;

    try {
        console.log(`📥 Download request for certificate: ${certificateId}`);

        const certificate = await Certificate.findOne({
            _id: certificateId,
            user: userId,
        });

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        console.log(`📄 Certificate URL: ${certificate.certificateUrl}`);

        // 🆕 FIX: Handle Cloudinary URLs with proper streaming
        if (
            certificate.certificateUrl &&
            certificate.certificateUrl.includes("cloudinary")
        ) {
            const https = require("https");

            // 🆕 FIX: Use fl_attachment for forced download
            const cloudinaryUrl = certificate.certificateUrl.replace(
                "/upload/",
                "/upload/fl_attachment:FAST-C_Certificate/"
            );

            console.log(`🔗 Cloudinary download URL: ${cloudinaryUrl}`);

            // 🆕 FIX: Set proper headers for PDF download
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="FAST-C_Certificate_${certificate.title.replace(
                    /\s+/g,
                    "_"
                )}.pdf"`
            );
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader(
                "Access-Control-Expose-Headers",
                "Content-Disposition"
            );

            // 🆕 FIX: Better error handling for Cloudinary stream
            return new Promise((resolve, reject) => {
                https
                    .get(cloudinaryUrl, (cloudinaryResponse) => {
                        if (cloudinaryResponse.statusCode !== 200) {
                            console.error(
                                `❌ Cloudinary response error: ${cloudinaryResponse.statusCode}`
                            );
                            reject(
                                new Error(
                                    `Cloudinary returned status ${cloudinaryResponse.statusCode}`
                                )
                            );
                            return;
                        }

                        // Pipe the Cloudinary response to our response
                        cloudinaryResponse.pipe(res);

                        cloudinaryResponse.on("end", () => {
                            console.log("✅ Certificate download completed");
                            resolve();
                        });

                        cloudinaryResponse.on("error", (error) => {
                            console.error("❌ Cloudinary stream error:", error);
                            reject(error);
                        });
                    })
                    .on("error", (error) => {
                        console.error("❌ HTTPS request error:", error);
                        reject(error);
                    });
            }).catch((error) => {
                console.error("❌ Download promise error:", error);
                return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Failed to download certificate file from storage",
                });
            });
        } else {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate file not found in storage",
            });
        }
    } catch (error) {
        console.error(`❌ Download error: ${error.message}`);

        // 🆕 FIX: Only send JSON if headers haven't been sent
        if (!res.headersSent) {
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to download certificate",
                error: error.message,
            });
        }
    }
};

exports.directDownloadCertificate = async (req, res, next) => {
    const { certificateId } = req.params;
    const userId = req.user.id;

    try {
        const certificate = await Certificate.findOne({
            _id: certificateId,
            user: userId,
        });

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        if (
            !certificate.certificateUrl ||
            !certificate.certificateUrl.includes("cloudinary")
        ) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate file not available",
            });
        }

        // 🆕 FIX: Redirect to Cloudinary with download flag
        const downloadUrl = certificate.certificateUrl.replace(
            "/upload/",
            "/upload/fl_attachment:FAST-C_Certificate/"
        );

        console.log(`🔗 Redirecting to: ${downloadUrl}`);
        res.redirect(downloadUrl);
    } catch (error) {
        console.error(`❌ Direct download error: ${error.message}`);
        next(error);
    }
};

exports.getCertificateUrl = async (req, res, next) => {
    const { certificateId } = req.params;
    const userId = req.user.id;

    try {
        const certificate = await Certificate.findOne({
            _id: certificateId,
            user: userId,
        });

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // Return the Cloudinary URL for direct download
        res.status(statusCodes.OK).json({
            success: true,
            certificate: {
                id: certificate._id,
                title: certificate.title,
                downloadUrl: certificate.certificateUrl?.includes("cloudinary")
                    ? certificate.certificateUrl.replace(
                          "/upload/",
                          "/upload/fl_attachment/"
                      )
                    : certificate.certificateUrl,
                directDownload:
                    certificate.certificateUrl?.includes("cloudinary"),
            },
        });
    } catch (error) {
        console.error(`❌ Get certificate URL error: ${error.message}`);
        next(error);
    }
};

// 🆕 ADD: View certificate (opens in browser instead of download)
exports.viewCertificate = async (req, res, next) => {
    const { certificateId } = req.params;
    const userId = req.user.id;

    try {
        const certificate = await Certificate.findOne({
            _id: certificateId,
            user: userId,
        });

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // 🆕 CLOUDINARY: Redirect to view URL (no download flag)
        if (
            certificate.certificateUrl &&
            certificate.certificateUrl.includes("cloudinary")
        ) {
            res.redirect(certificate.certificateUrl);
        } else {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate file not found",
            });
        }
    } catch (error) {
        console.error(`❌ View error: ${error.message}`);
        next(error);
    }
};

// Public certificate verification
exports.verifyCertificate = async (req, res, next) => {
    const { verificationCode } = req.query;

    try {
        if (!verificationCode) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required",
            });
        }

        const certificate = await Certificate.findOne({ verificationCode })
            .populate("user", "firstName surname email companyName role")
            .populate("course", "title description duration category");

        if (!certificate) {
            return res.status(404).json({
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

        res.status(200).json({
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

// Get user certificates
exports.getUserCertificates = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const certificates = await Certificate.find({ user: userId })
            .populate("course", "title description category")
            .sort({ completionDate: -1 })
            .lean();

        const formattedCertificates = certificates.map((cert) => {
            const isExpired = new Date() > new Date(cert.expirationDate);

            return {
                id: cert._id,
                title: cert.title,
                course: cert.course,
                completionDate: cert.completionDate,
                expirationDate: cert.expirationDate,
                certificateUrl: cert.certificateUrl,
                verificationCode: cert.verificationCode,
                status:
                    cert.status === "revoked"
                        ? "revoked"
                        : isExpired
                        ? "expired"
                        : "active",
                issuedBy: cert.issuedBy,
            };
        });

        res.status(statusCodes.OK).json({
            success: true,
            count: formattedCertificates.length,
            certificates: formattedCertificates,
        });
    } catch (error) {
        next(error);
    }
};

function generateVerificationCode() {
    return "FAST-C" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = {
    generateCertificatePDF,
    ...exports,
};
