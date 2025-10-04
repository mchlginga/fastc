const Certificate = require("../models/certificate");
const Completion = require("../models/completion");
const Course = require("../models/course");
const User = require("../models/user");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { statusCodes, PATHS } = require("../utils/constant");
const ensureDirExist = require("../utils/ensureDirExist");

// Generate certificate PDF
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
        const fileName = `certificate_${user._id}_${course._id}.pdf`;
        const filePath = path.join(PATHS.certDir, fileName);

        console.log(`Generating certificate at: ${filePath}`);
        ensureDirExist(PATHS.certDir);

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // helper para center text safely sa loob ng border
        function centerText(text, y, options = {}) {
            doc.text(text, 50, y, {
                width: doc.page.width - 100, // respect 50 margin left/right
                align: "center",
                ...options,
            });
        }

        // === BORDER ===
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .lineWidth(4)
            .strokeColor("#3B82F6")
            .stroke();

        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
            .lineWidth(1)
            .strokeColor("#93C5FD")
            .stroke();

        // === WATERMARK ===
        doc.fontSize(120)
            .fillColor("#F3F4F6")
            .opacity(0.25)
            .rotate(-30, { origin: [400, 300] })
            .text("FAST-C", 100, 250, { align: "center", width: 600 });
        doc.rotate(30, { origin: [400, 300] }).opacity(1);

        // === HEADER ===
        doc.font("Times-Bold").fontSize(24).fillColor("#1E3A8A");
        centerText("FERNANDINO ASSESSMENT AND SKILLS TRAINING CENTER", 80);

        doc.font("Times-Roman").fontSize(18).fillColor("#374151");
        centerText("Certificate of Completion", 120);

        // === BODY ===
        doc.font("Times-Roman").fontSize(14).fillColor("#111827");
        centerText("This certificate is proudly presented to", 180);

        doc.font("Times-Bold").fontSize(30).fillColor("#000000");
        centerText(user.name, 215);

        doc.font("Times-Roman").fontSize(14).fillColor("#111827");
        centerText("For successfully completing the training course on", 260);

        doc.font("Times-Bold").fontSize(22).fillColor("#1E3A8A");
        centerText(course.title, 290);

        // === DATES ===
        doc.font("Times-Roman").fontSize(12).fillColor("#374151");
        centerText(`Completion Date: ${completionDate.toDateString()}`, 360);
        centerText(`Expiration Date: ${expirationDate.toDateString()}`, 380);

        // === SIGNATURES (centered layout) ===
        const sigY = 460;
        const marginX = 70; // start inside border
        const sectionWidth = (doc.page.width - marginX * 2) / 2; // hati page sa 2

        // left signature
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

        // right signature
        const rightStart = marginX + sectionWidth + 40;
        doc.moveTo(rightStart, sigY)
            .lineTo(marginX + sectionWidth * 2, sigY) // hanggang loob ng border
            .stroke();

        doc.text("Training Director", rightStart, sigY + 5, {
            width: sectionWidth - 40,
            align: "center",
        });

        // === FOOTER ===
        doc.fontSize(8).fillColor("#6B7280");
        centerText(
            "Issued by FAST-C Digital Profiling and Certification System",
            doc.page.height - 60
        );

        doc.end();

        stream.on("finish", () => {
            console.log(`Certificate generated successfully at: ${filePath}`);
            resolve(filePath);
        });
        stream.on("error", (err) => {
            console.error(`Error generating certificate: ${err.message}`);
            reject(err);
        });
    });
};

// Create certificate when course is completed (progress = 100)
exports.createCertificate = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;
        console.log(
            `Creating certificate for user: ${userId}, course: ${courseId}`
        );
        const completion = await Completion.findOne({
            user: userId,
            course: courseId,
        });
        if (!completion || completion.progress !== 100) {
            console.error(
                `Completion not found or progress < 100: ${userId}, ${courseId}`
            );
            return res.status(statusCodes.BAD_REQUEST).json({
                message: "Course not completed or not found.",
            });
        }

        const user = await User.findById(userId);
        const course = await Course.findById(courseId);
        if (!user || !course) {
            console.error(`User or course not found: ${userId}, ${courseId}`);
            return res.status(statusCodes.NOT_FOUND).json({
                message: "User or course not found.",
            });
        }

        const completionDate = new Date();
        const expirationDate = new Date(completionDate);
        expirationDate.setFullYear(completionDate.getFullYear() + 1); // 1-year expiration

        const certificateUrl = await generateCertificatePDF(
            user,
            course,
            completionDate,
            expirationDate
        );

        const certificate = await Certificate.create({
            user: userId,
            course: courseId,
            title: course.title,
            completionDate,
            expirationDate,
            certificateUrl: `/data/upload/certificates/${path.basename(
                certificateUrl
            )}`,
            status: "active",
        });

        console.log(`Certificate created: ${certificate._id}`);
        res.status(statusCodes.CREATED).json({
            certificateId: certificate._id.toString(),
            title: certificate.title,
            completionDate: certificate.completionDate,
            expirationDate: certificate.expirationDate,
            certificateUrl: certificate.certificateUrl,
            status: certificate.status,
        });
    } catch (error) {
        console.error(`Create certificate error: ${error.message}`);
        next(error);
    }
};

// Get user's certificates
exports.getCertificates = async (req, res, next) => {
    try {
        const { user } = req.query;
        console.log(`Fetching certificates for user: ${user}`);
        const certificates = await Certificate.find({ user })
            .populate("course", "image duration")
            .lean();
        const now = new Date();
        const formattedCertificates = certificates.map((cert) => ({
            certificateId: cert._id.toString(),
            courseId: cert.course._id.toString(),
            title: cert.title,
            image: cert.course.image || "/default.png",
            completionDate: cert.completionDate,
            expirationDate: cert.expirationDate,
            duration: cert.course.duration || "N/A",
            status:
                new Date(cert.expirationDate) < now ? "expired" : cert.status,
            certificateUrl: cert.certificateUrl,
        }));
        console.log(`Fetched certificates:`, formattedCertificates);
        res.status(statusCodes.OK).json({
            certificates: formattedCertificates,
        });
    } catch (error) {
        console.error(`Get certificates error: ${error.message}`);
        next(error);
    }
};

// Download certificate PDF
exports.downloadCertificate = async (req, res, next) => {
    try {
        const { certificateId } = req.params;
        console.log(`Attempting to download certificate: ${certificateId}`);
        const certificate = await Certificate.findById(certificateId);
        if (!certificate) {
            console.error(`Certificate not found: ${certificateId}`);
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Certificate not found.",
            });
        }

        console.log(`Certificate found: ${JSON.stringify(certificate)}`);
        const fileName = path.basename(certificate.certificateUrl);
        const filePath = path.join(PATHS.certDir, fileName);
        console.log(`Resolved file path: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.log(
                `File not found, regenerating certificate: ${certificateId}`
            );
            const user = await User.findById(certificate.user);
            const course = await Course.findById(certificate.course);
            if (!user || !course) {
                console.error(
                    `User or course not found for certificate: ${certificateId}`
                );
                return res.status(statusCodes.NOT_FOUND).json({
                    message: "User or course not found.",
                });
            }
            await generateCertificatePDF(
                user,
                course,
                certificate.completionDate,
                certificate.expirationDate
            );
            if (!fs.existsSync(filePath)) {
                console.error(
                    `Regeneration failed, file still missing: ${filePath}`
                );
                return res.status(statusCodes.NOT_FOUND).json({
                    message: "Certificate file not found after regeneration.",
                });
            }
            console.log(`Certificate regenerated successfully: ${filePath}`);
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="FAST-C_Certificate_${certificate.title}.pdf"`
        );

        const fileStream = fs.createReadStream(filePath);
        console.log(`Streaming file: ${filePath}`);
        fileStream.pipe(res);

        fileStream.on("error", (err) => {
            console.error(`Error reading file: ${err.message}`);
            res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Error reading certificate file.",
            });
        });
    } catch (error) {
        console.error(`Download certificate error: ${error.message}`);
        next(error);
    }
};
