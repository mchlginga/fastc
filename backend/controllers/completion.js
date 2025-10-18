const Completion = require("../models/completion");
const Course = require("../models/course");
const Attendance = require("../models/attendance");
const Certificate = require("../models/certificate");
const User = require("../models/user");
const { statusCodes, PATHS } = require("../utils/constant");
const ensureDirExist = require("../utils/ensureDirExist");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

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

        function centerText(text, y, options = {}) {
            doc.text(text, 50, y, {
                width: doc.page.width - 100,
                align: "center",
                ...options,
            });
        }

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

exports.getCompletions = async (req, res, next) => {
    try {
        const { user, isAdmin } = req.query;
        const query = isAdmin ? {} : { user };
        const completions = await Completion.find(query).lean();
        const courses = completions.map((completion) => ({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        }));
        res.status(statusCodes.OK).json({ courses });
    } catch (error) {
        next(error);
    }
};

exports.createCompletions = async (req, res, next) => {
    try {
        const { courseId, userId, endDate } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const completion = await Completion.create({
            user: userId,
            course: courseId,
            title: course.title,
            endDate,
        });
        res.status(statusCodes.CREATED).json({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        });
    } catch (error) {
        next(error);
    }
};

exports.completeLesson = async (req, res, next) => {
    try {
        const { courseId, lessonId, userId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }
        const completion = await Completion.findOne({
            user: userId,
            course: courseId,
        });
        if (!completion) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Completion not found",
            });
        }
        if (!completion.completedLessons.includes(lessonId)) {
            completion.completedLessons.push(lessonId);
            const totalLessons = course.lessons.length;
            const completedCount = completion.completedLessons.length;
            completion.progress = Math.round(
                (completedCount / totalLessons) * 100
            );
            await completion.save();

            if (completion.progress === 100) {
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(statusCodes.NOT_FOUND).json({
                        message: "User not found",
                    });
                }
                const completionDate = new Date();
                const expirationDate = new Date(completionDate);
                expirationDate.setFullYear(completionDate.getFullYear() + 1);

                const certificateUrl = await generateCertificatePDF(
                    user,
                    course,
                    completionDate,
                    expirationDate
                );

                await Certificate.create({
                    user: userId,
                    course: courseId,
                    title: course.title,
                    completionDate,
                    expirationDate,
                    certificateUrl: `/uploads/certificates/${path.basename(
                        certificateUrl
                    )}`,
                    status: "active",
                });
            }
        }
        res.status(statusCodes.OK).json({
            courseId: completion.course.toString(),
            title: completion.title,
            status: completion.status,
            progress: completion.progress,
            timeRemaining: calculateTimeRemaining(completion.endDate),
            completedLessons: completion.completedLessons.map((id) =>
                id.toString()
            ),
        });
    } catch (error) {
        next(error);
    }
};

exports.markAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId, userId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Course not found",
            });
        }
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(statusCodes.NOT_FOUND).json({
                message: "Lesson not found",
            });
        }
        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            timestamp: new Date(),
        });
        res.status(statusCodes.CREATED).json({
            attendanceId: attendance._id.toString(),
            userId: attendance.user.toString(),
            courseId: attendance.course.toString(),
            lessonId: attendance.lesson.toString(),
            timestamp: attendance.timestamp,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTotalTrainees = async (req, res, next) => {
    try {
        const count = await Completion.countDocuments({
            progress: { $lt: 100 },
            status: "approved",
        });
        res.status(statusCodes.OK).json({ count });
    } catch (error) {
        next(error);
    }
};

const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Expired";
};
