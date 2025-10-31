const Certificate = require("../models/certificate");
const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const User = require("../models/user");
const PDFDocument = require("pdfkit");
const { statusCodes } = require("../utils/constant");
const { cloudinary } = require("../config/cloudinary");

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

        // Create buffers instead of file system
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
            const pdfData = Buffer.concat(buffers);

            // Upload to Cloudinary
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
                            resolve(result.secure_url);
                        }
                    }
                )
                .end(pdfData);
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

        // Create certificate record
        const certificate = await Certificate.create({
            user: userId,
            course: enrollment.course._id,
            enrollment: enrollmentId,
            title: enrollment.course.title,
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

// Public certificate verification
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
            .populate("user", "name email")
            .populate("course", "title description duration");

        if (!certificate) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Certificate not found or invalid verification code",
            });
        }

        // Check if certificate is expired
        const isExpired = new Date() > new Date(certificate.expirationDate);
        const isRevoked = certificate.status === "revoked";

        res.status(statusCodes.OK).json({
            success: true,
            certificate: {
                id: certificate._id,
                title: certificate.title,
                recipient: {
                    name: certificate.user.name,
                    email: certificate.user.email,
                },
                course: {
                    title: certificate.course.title,
                    description: certificate.course.description,
                    duration: certificate.course.duration,
                },
                completionDate: certificate.completionDate,
                expirationDate: certificate.expirationDate,
                status: isRevoked
                    ? "revoked"
                    : isExpired
                    ? "expired"
                    : "active",
                issuedBy: certificate.issuedBy,
                verifiedAt: new Date(),
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

// ownload certificate
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

        // Cloudinary URL - redirect to Cloudinary download
        if (certificate.certificateUrl) {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="FAST-C_Certificate_${certificate.title.replace(
                    /\s+/g,
                    "_"
                )}.pdf"`
            );

            // Redirect to Cloudinary download URL
            const downloadUrl = certificate.certificateUrl.replace(
                "/upload/",
                "/upload/fl_attachment/"
            );
            res.redirect(downloadUrl);
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

function generateVerificationCode() {
    return "FAST-C" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

module.exports = {
    generateCertificatePDF,
    ...exports,
};
