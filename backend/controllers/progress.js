const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const Certificate = require("../models/certificate");
const { statusCodes } = require("../utils/constant");

// verification code generator
function generateVerificationCode() {
    return "FAST-C" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

exports.completeLesson = async (req, res, next) => {
    const { enrollmentId, lessonId } = req.body;
    const userId = req.user.id;

    try {
        console.log(
            `🔄 [Progress] Completing lesson ${lessonId} for enrollment ${enrollmentId}`
        );

        // Verify enrollment belongs to user and is active
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: "active",
        }).populate("course", "title lessons duration");

        if (!enrollment) {
            console.log(
                `❌ [Progress] Active enrollment not found: ${enrollmentId}`
            );
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Active enrollment not found",
            });
        }

        const course = enrollment.course;

        // Verify lesson exists in course
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            console.log(
                `❌ [Progress] Lesson not found in course: ${lessonId}`
            );
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Lesson not found in this course",
            });
        }

        // Check if lesson already completed
        const isAlreadyCompleted =
            enrollment.completedLessons.includes(lessonId);
        if (isAlreadyCompleted) {
            console.log(`⚠️ [Progress] Lesson already completed: ${lessonId}`);
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Lesson already completed",
            });
        }

        // Mark lesson as completed
        enrollment.completedLessons.push(lessonId);

        // Update last accessed lesson
        enrollment.lastAccessedLesson = lessonId;

        // Calculate new progress
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        const newProgress = Math.round((completedCount / totalLessons) * 100);
        enrollment.progress = newProgress;

        // Check if course is completed
        let certificate = null;
        if (newProgress === 100) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();

            console.log(
                `🎉 [Progress] Course completed! Generating certificate...`
            );

            // Generate certificate
            const completionDate = new Date();
            const expirationDate = new Date(completionDate);
            expirationDate.setFullYear(completionDate.getFullYear() + 1);

            // Note: You'll need to implement generateCertificatePDF function
            const certificateUrl = ""; // await generateCertificatePDF(req.user, course, completionDate, expirationDate);

            // Create certificate record
            certificate = await Certificate.create({
                user: userId,
                course: course._id,
                enrollment: enrollmentId,
                title: course.title,
                completionDate,
                expirationDate,
                certificateUrl,
                status: "active",
                verificationCode: generateVerificationCode(),
                issuedBy: "FAST-C",
            });
        }

        await enrollment.save();

        console.log(
            `✅ [Progress] Lesson completed successfully. Progress: ${newProgress}%`
        );

        // Prepare response
        const response = {
            success: true,
            message: "Lesson completed successfully",
            data: {
                progress: {
                    enrollmentId: enrollment._id,
                    lessonId: lessonId,
                    progress: enrollment.progress,
                    completedLessons: enrollment.completedLessons,
                    totalLessons: totalLessons,
                    isCourseCompleted: newProgress === 100,
                },
            },
        };

        // Add certificate info if course completed
        if (certificate) {
            response.data.certificate = {
                id: certificate._id,
                title: certificate.title,
                completionDate: certificate.completionDate,
                expirationDate: certificate.expirationDate,
                certificateUrl: certificate.certificateUrl,
                verificationCode: certificate.verificationCode,
            };
        }

        res.status(statusCodes.OK).json(response);
    } catch (error) {
        console.error("❌ [Progress] Error in completeLesson:", error);
        next(error);
    }
};

exports.getCourseProgress = async (req, res, next) => {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    try {
        console.log(
            `🔄 [Progress] Fetching progress for enrollment ${enrollmentId}`
        );

        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
        }).populate("course", "title lessons duration category skillLevel");

        if (!enrollment) {
            console.log(`❌ [Progress] Enrollment not found: ${enrollmentId}`);
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        const course = enrollment.course;
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        const progress = enrollment.progress;

        // Calculate time statistics
        const enrolledDate = new Date(enrollment.enrolledAt);
        const now = new Date();
        const daysEnrolled = Math.ceil(
            (now - enrolledDate) / (1000 * 60 * 60 * 24)
        );

        const endDate = new Date(enrolledDate);
        endDate.setDate(enrolledDate.getDate() + course.enrollmentPeriod);
        const daysRemaining = Math.ceil(
            (endDate - now) / (1000 * 60 * 60 * 24)
        );

        // Get detailed lesson progress
        const lessonProgress = course.lessons
            .map((lesson) => ({
                id: lesson._id,
                title: lesson.title,
                duration: lesson.duration,
                order: lesson.order,
                isRequired: lesson.isRequired,
                isCompleted: enrollment.completedLessons.includes(
                    lesson._id.toString()
                ),
                isCurrent:
                    enrollment.lastAccessedLesson?.toString() ===
                    lesson._id.toString(),
                content: lesson.content,
            }))
            .sort((a, b) => a.order - b.order);

        // Calculate estimated completion time
        const remainingLessons = totalLessons - completedCount;
        const averageLessonsPerDay =
            completedCount > 0 ? completedCount / daysEnrolled : 1;
        const estimatedDaysToComplete = remainingLessons / averageLessonsPerDay;

        // Check for certificate
        const certificate = await Certificate.findOne({
            enrollment: enrollmentId,
            status: "active",
        });

        console.log(
            `✅ [Progress] Progress fetched successfully for enrollment ${enrollmentId}`
        );

        res.status(statusCodes.OK).json({
            success: true,
            data: {
                progress: {
                    enrollmentId: enrollment._id,
                    course: {
                        id: course._id,
                        title: course.title,
                        duration: course.duration,
                        category: course.category,
                        skillLevel: course.skillLevel,
                    },
                    overallProgress: progress,
                    completedLessons: completedCount,
                    totalLessons: totalLessons,
                    status: enrollment.status,
                    enrolledAt: enrollment.enrolledAt,
                    completedAt: enrollment.completedAt,
                    lastAccessed: enrollment.lastAccessedLesson,
                    timeMetrics: {
                        daysEnrolled: daysEnrolled,
                        daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
                        estimatedDaysToComplete: Math.ceil(
                            estimatedDaysToComplete
                        ),
                        isOnTrack: daysRemaining >= estimatedDaysToComplete,
                    },
                    lessons: lessonProgress,
                    certificate: certificate
                        ? {
                              id: certificate._id,
                              completionDate: certificate.completionDate,
                              expirationDate: certificate.expirationDate,
                              certificateUrl: certificate.certificateUrl,
                              verificationCode: certificate.verificationCode,
                          }
                        : null,
                },
            },
        });
    } catch (error) {
        console.error("❌ [Progress] Error in getCourseProgress:", error);
        next(error);
    }
};

exports.updateLastAccessed = async (req, res, next) => {
    const { enrollmentId, lessonId } = req.body;
    const userId = req.user.id;

    try {
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: "active",
        });

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Active enrollment not found",
            });
        }

        // Verify lesson exists in course
        const course = await Course.findById(enrollment.course);
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Lesson not found in course",
            });
        }

        enrollment.lastAccessedLesson = lessonId;
        await enrollment.save();

        res.status(statusCodes.OK).json({
            success: true,
            message: "Last accessed lesson updated",
            lastAccessedLesson: lessonId,
        });
    } catch (error) {
        next(error);
    }
};

// (for admin/testing)
exports.bulkCompleteLessons = async (req, res, next) => {
    const { enrollmentId, lessonIds } = req.body;
    const userId = req.user.id;

    try {
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: "active",
        }).populate("course", "lessons");

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Active enrollment not found",
            });
        }

        const course = enrollment.course;
        let newlyCompleted = 0;

        // Add each lesson if not already completed
        for (const lessonId of lessonIds) {
            if (!enrollment.completedLessons.includes(lessonId)) {
                // Verify lesson exists
                const lesson = course.lessons.id(lessonId);
                if (lesson) {
                    enrollment.completedLessons.push(lessonId);
                    newlyCompleted++;
                }
            }
        }

        // Recalculate progress
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        enrollment.progress = Math.round((completedCount / totalLessons) * 100);

        // Check if course completed
        if (enrollment.progress === 100) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();
        }

        await enrollment.save();

        res.status(statusCodes.OK).json({
            success: true,
            message: `${newlyCompleted} lessons completed`,
            progress: {
                enrollmentId: enrollment._id,
                progress: enrollment.progress,
                completedLessons: enrollment.completedLessons.length,
                totalLessons: totalLessons,
                status: enrollment.status,
            },
        });
    } catch (error) {
        next(error);
    }
};
