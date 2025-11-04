const Attendance = require("../models/attendance");
const Enrollment = require("../models/enrollment");
const User = require("../models/user");
const FacePlusPlusService = require("../utils/facePlusPlus");
const { statusCodes } = require("../utils/constant");

exports.verifyAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId, imageData } = req.body;
        const userId = req.user.id;

        console.log(
            `🎯 Face verification for user ${userId}, course: ${courseId}, lesson: ${lessonId}`
        );

        // 1. Check enrollment
        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "active",
        });

        if (!enrollment) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message: "Active enrollment not found for this course.",
            });
        }

        // 2. Check existing attendance for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            user: userId,
            course: courseId,
            verifiedAt: {
                $gte: today,
                $lt: tomorrow,
            },
        });

        if (existingAttendance) {
            return res.status(409).json({
                // Use direct status code
                success: false,
                message: "Attendance already marked for today",
            });
        }

        // 3. Get user's face token
        const user = await User.findById(userId);
        if (!user.faceData?.faceToken) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message:
                    "Face not enrolled. Please complete face registration first.",
            });
        }

        console.log(`🔍 User has face token: ${user.faceData.faceToken}`);

        // 4. Detect face in new image
        console.log("🔄 Detecting face in new image...");
        const detectedFaceToken = await FacePlusPlusService.detectFace(
            imageData
        );
        console.log(`✅ Detected face token: ${detectedFaceToken}`);

        // 5. Compare with enrolled face
        console.log("🔄 Comparing faces...");
        const comparison = await FacePlusPlusService.compareFaces(
            user.faceData.faceToken,
            detectedFaceToken
        );

        console.log(`📊 Face comparison confidence: ${comparison.confidence}%`);

        // 6. Verify confidence threshold
        const confidenceThreshold = 70;
        if (comparison.confidence < confidenceThreshold) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message: `Face verification failed. Confidence score too low: ${Math.round(
                    comparison.confidence
                )}% (required: ${confidenceThreshold}%)`,
                confidence: Math.round(comparison.confidence),
                threshold: confidenceThreshold,
                details:
                    "Try again with better lighting and ensure your face is clearly visible",
            });
        }

        // 7. Create attendance record
        console.log("💾 Creating attendance record...");
        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            verifiedAt: new Date(),
            status: "verified",
            verificationMethod: "facial_recognition",
            confidence: comparison.confidence,
        });

        // 8. Update user's last verified timestamp
        await User.findByIdAndUpdate(userId, {
            "faceData.lastVerified": new Date(),
        });

        console.log(
            `✅ Face attendance verified: ${comparison.confidence}% confidence`
        );

        res.status(200).json({
            // Use direct status code
            success: true,
            message: "Attendance verified successfully",
            confidence: Math.round(comparison.confidence),
            attendance: {
                id: attendance._id,
                verifiedAt: attendance.verifiedAt,
            },
        });
    } catch (error) {
        console.error("❌ Face verification error:", error.message);

        // Handle Face++ specific errors
        if (error.message.includes("No face detected")) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message:
                    "No face detected. Please ensure your face is clearly visible in the frame.",
                details: "Make sure your face is centered and well-lit",
            });
        } else if (error.message.includes("Multiple faces")) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message:
                    "Multiple faces detected. Please ensure only you are in the frame.",
                details: "Remove other people from the camera view",
            });
        } else if (
            error.message.includes("Request failed with status code 414")
        ) {
            return res.status(400).json({
                // Use direct status code
                success: false,
                message:
                    "Image data too large. Please try again with better lighting.",
            });
        }

        // Handle other errors
        console.error("❌ Unexpected error:", error);
        res.status(500).json({
            // Use direct status code
            success: false,
            message: "Attendance verification failed. Please try again.",
            details: error.message,
        });
    }
};

// Rest of your controller functions remain the same...
exports.markAttendance = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.body;
        const userId = req.user.id;

        // Check enrollment
        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "active",
        });

        if (!enrollment) {
            return res.status(400).json({
                success: false,
                message: "Active enrollment not found for this course.",
            });
        }

        // Check existing attendance for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            user: userId,
            course: courseId,
            verifiedAt: {
                $gte: today,
                $lt: tomorrow,
            },
        });

        if (existingAttendance) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked for today",
            });
        }

        // Create manual attendance record
        const attendance = await Attendance.create({
            user: userId,
            course: courseId,
            lesson: lessonId,
            verifiedAt: new Date(),
            status: "verified",
            verificationMethod: "manual",
            confidence: 100,
        });

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            attendance: {
                id: attendance._id,
                verifiedAt: attendance.verifiedAt,
            },
        });
    } catch (error) {
        console.error("Mark attendance error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
        });
    }
};

exports.getAttendanceHistory = async (req, res, next) => {
    try {
        const { enrollmentId } = req.params;
        const userId = req.user.id;

        const attendanceRecords = await Attendance.find({
            user: userId,
            course: enrollmentId,
        })
            .populate("course", "title")
            .sort({ verifiedAt: -1 });

        res.status(statusCodes.OK).json({
            success: true,
            data: attendanceRecords,
        });
    } catch (error) {
        next(error);
    }
};

// Face enrollment endpoint - ONLY ONE VERSION
exports.enrollFace = async (req, res, next) => {
    try {
        const { imageData } = req.body;
        const userId = req.user.id;

        console.log(`🎯 Face enrollment started for user ${userId}`);
        console.log(`📷 Received image data length: ${imageData?.length || 0}`);

        // Validate image data presence
        if (!imageData) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No image data provided",
            });
        }

        // Basic image format validation
        if (!imageData.startsWith("data:image/")) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid image format. Please use JPEG or PNG format.",
            });
        }

        try {
            // 1. Detect face and get face_token
            console.log("🔄 Calling Face++ detection service...");
            const faceToken = await FacePlusPlusService.detectFace(imageData);
            console.log(`✅ Face detected with token: ${faceToken}`);

            // 2. Store face token in user profile
            console.log("💾 Saving face data to user profile...");
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    faceData: {
                        faceToken: faceToken,
                        enrolledAt: new Date(),
                        lastVerified: new Date(),
                    },
                },
                { new: true }
            ).select("-password");

            console.log(`✅ Face enrolled successfully for user ${userId}`);

            res.status(statusCodes.OK).json({
                success: true,
                message: "Face enrolled successfully",
                faceToken: faceToken,
                enrolledAt: user.faceData.enrolledAt,
            });
        } catch (faceError) {
            console.error(
                "❌ Face detection service error:",
                faceError.message
            );

            // Return specific error messages to frontend
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: faceError.message,
                details:
                    "Please try again with better lighting and ensure your face is clearly visible",
            });
        }
    } catch (error) {
        console.error("❌ Face enrollment system error:", error.message);
        console.error("Stack:", error.stack);

        // Handle unexpected system errors
        res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Face enrollment system error",
            details: "Please try again later",
        });
    }
};

exports.getFaceStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("faceData");

        res.status(statusCodes.OK).json({
            success: true,
            hasEnrolledFace: !!user.faceData?.faceToken,
            enrolledAt: user.faceData?.enrolledAt,
            lastVerified: user.faceData?.lastVerified,
        });
    } catch (error) {
        next(error);
    }
};

exports.getTodayAttendance = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        console.log(
            `🔍 Checking today's attendance for user ${userId}, course ${courseId}`
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            user: userId,
            course: courseId,
            verifiedAt: {
                $gte: today,
                $lt: tomorrow,
            },
        });

        console.log(`📊 Today's attendance check result:`, {
            hasAttendanceToday: !!existingAttendance,
            courseId,
            userId,
        });

        res.status(200).json({
            success: true,
            hasAttendanceToday: !!existingAttendance,
            attendance: existingAttendance,
        });
    } catch (error) {
        console.error("Error checking today's attendance:", error);
        next(error);
    }
};
