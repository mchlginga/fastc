// controllers/attendance.js
const Attendance = require("../models/attendance");
const { statusCodes } = require("../utils/constant");

exports.verifyAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId, imageData } = req.body;
        const userId = req.user.id;

        // 🆕 TODO: Implement facial recognition logic here
        // 1. Send imageData to your facial recognition service
        // 2. Compare with registered user face
        // 3. Return verification result

        const isVerified = await facialRecognitionService.verifyFace(
            userId,
            imageData
        );

        if (!isVerified) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Face verification failed. Please try again.",
            });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            verifiedAt: new Date(),
            status: "verified",
            verificationMethod: "facial_recognition",
        });

        res.status(statusCodes.OK).json({
            success: true,
            message: "Attendance verified successfully",
            attendance: {
                id: attendance._id,
                verifiedAt: attendance.verifiedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.markAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.body;
        const userId = req.user.id;

        // Check if attendance already exists for this lesson
        const existingAttendance = await Attendance.findOne({
            user: userId,
            course: courseId,
            lesson: lessonId,
        });

        if (existingAttendance) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Attendance already marked for this lesson",
            });
        }

        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            verifiedAt: new Date(),
            status: "verified",
            verificationMethod: "manual", // or "facial_recognition"
        });

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "Attendance marked successfully",
            attendance: {
                id: attendance._id,
                verifiedAt: attendance.verifiedAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
