const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");
const Certificate = require("../models/certificate");
const User = require("../models/user");
const Completion = require("../models/completion");
const { statusCodes } = require("../utils/constant");

exports.generateCertificate = async (req, res, next) => {
    try {
        const { courseId } = req.query;
        if (!courseId) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Course ID required." });
        }

        const completion = await Completion.findOne({
            course: courseId,
            user: req.user.id,
        });
        if (!completion || completion.progress < 100) {
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Course not completed." });
        }

        const user = await User.findById(req.user.id);
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const stream = new PassThrough();
        doc.pipe(stream);

        doc.fontSize(25).text("Certificate of Completion", { align: "center" });
        doc.moveDown();
        doc.fontSize(18).text(`This certifies that ${user.name}`, {
            align: "center",
        });
        doc.moveDown();
        doc.fontSize(16).text(`has successfully completed the course`, {
            align: "center",
        });
        doc.moveDown();
        doc.fontSize(20).text(`${completion.title}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(
            `Date: ${new Date().toLocaleDateString("en-US")}`,
            { align: "center" }
        );

        doc.end();

        // Save certificate to DB
        const certificate = await Certificate.create({
            user: req.user.id,
            course: courseId,
            name: completion.title,
            date: new Date(),
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=certificate-${certificate._id}.pdf`
        );
        stream.pipe(res);
    } catch (error) {
        console.error("generateCertificate error:", error);
        next(error);
    }
};

exports.getCertificates = async (req, res, next) => {
    try {
        const { user } = req.query;
        console.log("getCertificates: req.cookies:", req.cookies);
        console.log("getCertificates: req.user:", req.user);
        console.log("getCertificates: query user:", user);
        if (!user || user !== req.user.id) {
            console.log(
                "getCertificates: validation failed, user:",
                user,
                "req.user.id:",
                req.user.id
            );
            return res
                .status(statusCodes.BAD_REQUEST)
                .json({ message: "Invalid user ID." });
        }

        const certificates = await Certificate.find({ user })
            .populate("user", "name email")
            .populate("course", "title");
        console.log("getCertificates: certificates found:", certificates);
        res.status(statusCodes.OK).json({ certificates });
    } catch (error) {
        console.error("getCertificates error:", error);
        next(error);
    }
};
