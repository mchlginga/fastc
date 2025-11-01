const Enrollment = require("../models/enrollment");
const Course = require("../models/course");
const { statusCodes } = require("../utils/constant");

exports.enrollInCourse = async (req, res, next) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        // 🆕 ENHANCED: Use course method to check enrollment eligibility
        if (!course.canEnroll()) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Course is not available for enrollment",
            });
        }

        // Check for existing ACTIVE enrollments (exclude cancelled)
        const existingEnrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: { $in: ["pending", "active", "completed"] },
        });

        if (existingEnrollment) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "You already have an enrollment for this course",
                enrollment: {
                    id: existingEnrollment._id,
                    status: existingEnrollment.status,
                    progress: existingEnrollment.progress,
                },
            });
        }

        // Check if there's a cancelled enrollment and reactivate it
        const cancelledEnrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "cancelled",
        });

        let enrollment;
        const enrolledAt = new Date();

        // 🆕 ENHANCED: Calculate accessUntil based on course type
        let accessUntil = null;
        if (!course.isSelfPaced) {
            accessUntil = course.calculateAccessUntil(enrolledAt);
        }

        if (cancelledEnrollment) {
            // Reactivate the cancelled enrollment
            cancelledEnrollment.status = "pending";
            cancelledEnrollment.enrolledAt = enrolledAt;
            cancelledEnrollment.accessUntil = accessUntil;
            cancelledEnrollment.cancelledAt = undefined;
            cancelledEnrollment.progress = 0;
            cancelledEnrollment.completedLessons = [];
            await cancelledEnrollment.save();
            enrollment = cancelledEnrollment;
        } else {
            // Create new enrollment
            enrollment = await Enrollment.create({
                user: userId,
                course: courseId,
                enrolledAt,
                accessUntil, // 🆕 Now properly set based on course type
                status: "pending",
                progress: 0,
                completedLessons: [],
                lastAccessedLesson: null,
            });
        }

        await enrollment.populate(
            "course",
            "title description image duration enrollmentPeriod endDate isSelfPaced"
        );

        res.status(statusCodes.CREATED).json({
            success: true,
            message: cancelledEnrollment
                ? "Enrollment reactivated successfully"
                : "Enrollment request submitted for admin approval",
            enrollment: {
                id: enrollment._id,
                course: {
                    id: enrollment.course._id,
                    title: enrollment.course.title,
                    description: enrollment.course.description,
                    image: enrollment.course.image,
                    duration: enrollment.course.duration,
                    enrollmentPeriod: enrollment.course.enrollmentPeriod,
                    endDate: enrollment.course.endDate,
                    isSelfPaced: enrollment.course.isSelfPaced,
                },
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                accessUntil: enrollment.accessUntil,
                needsApproval: true,
                isReactivated: !!cancelledEnrollment,
            },
        });
    } catch (error) {
        if (error.code === 11000 || error.code === 11001) {
            console.error("Duplicate enrollment error:", error);
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message:
                    "Duplicate enrollment detected. Please try again or contact support.",
            });
        }
        next(error);
    }
};

exports.getUserEnrollments = async (req, res, next) => {
    const userId = req.user.id;
    const { status } = req.query;
    try {
        // Build query - EXCLUDE cancelled enrollments by default
        const query = {
            user: userId,
            status: { $ne: "cancelled" },
        };

        // Only include status filter if provided and valid
        if (status && ["active", "completed", "pending"].includes(status)) {
            query.status = status;
        }

        // Get enrollments with course details
        const enrollments = await Enrollment.find(query)
            .populate(
                "course",
                "title description image duration category skillLevel lessons enrollmentPeriod endDate isActive"
            )
            .sort({ enrolledAt: -1 })
            .lean();

        // Format response with calculated fields
        const formattedEnrollments = enrollments.map((enrollment) => {
            const course = enrollment.course;
            const totalLessons = course.lessons?.length || 0;

            // Convert ObjectIds to strings for consistent comparison
            const completedLessons = (enrollment.completedLessons || []).map(
                (lessonId) => lessonId.toString()
            );
            const completedCount = completedLessons.length;

            // 🆕 FIXED: Proper time remaining calculation
            let timeRemainingDisplay = "Self-paced";
            let daysRemaining = null;
            let accessStatus = "Self-paced";

            // 🆕 ONLY calculate time remaining if course has enrollment period AND accessUntil is set
            if (course.enrollmentPeriod > 0 && enrollment.accessUntil) {
                const now = new Date();
                const accessUntil = new Date(enrollment.accessUntil);
                const timeRemaining = Math.ceil(
                    (accessUntil - now) / (1000 * 60 * 60 * 24)
                );

                daysRemaining = timeRemaining > 0 ? timeRemaining : 0;

                if (daysRemaining > 0) {
                    // 🆕 IMPROVED: Show weeks/months for better UX
                    if (daysRemaining >= 30) {
                        const months = Math.floor(daysRemaining / 30);
                        timeRemainingDisplay = `${months} month${
                            months > 1 ? "s" : ""
                        } remaining`;
                    } else if (daysRemaining >= 7) {
                        const weeks = Math.floor(daysRemaining / 7);
                        timeRemainingDisplay = `${weeks} week${
                            weeks > 1 ? "s" : ""
                        } remaining`;
                    } else {
                        timeRemainingDisplay = `${daysRemaining} day${
                            daysRemaining > 1 ? "s" : ""
                        } remaining`;
                    }
                    accessStatus = timeRemainingDisplay;
                } else {
                    timeRemainingDisplay = "Access expired";
                    accessStatus = "Expired";
                }
            } else {
                // 🆕 Self-paced course - no time limit
                timeRemainingDisplay = "Self-paced";
                accessStatus = "Self-paced";
            }

            return {
                enrollmentId: enrollment._id,
                course: {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    image: course.image,
                    duration: course.duration,
                    category: course.category,
                    skillLevel: course.skillLevel,
                    totalLessons: totalLessons,
                    enrollmentPeriod: course.enrollmentPeriod,
                    endDate: course.endDate,
                    isSelfPaced: course.enrollmentPeriod === 0,
                },
                progress: enrollment.progress,
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
                accessUntil: enrollment.accessUntil,
                completedLessons: completedLessons,
                lastAccessedLesson: enrollment.lastAccessedLesson,
                timeRemaining: timeRemainingDisplay,
                accessStatus: accessStatus, // 🆕 Use the improved status
                completedLessonsCount: completedCount,
                totalLessonsCount: totalLessons,
                daysRemaining: daysRemaining,
            };
        });

        res.status(statusCodes.OK).json({
            success: true,
            count: formattedEnrollments.length,
            enrollments: formattedEnrollments,
        });
    } catch (error) {
        next(error);
    }
};

exports.getEnrollmentDetails = async (req, res, next) => {
    const { enrollmentId } = req.params;
    const userId = req.user.id;
    try {
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
        }).populate(
            "course",
            "title description image duration category skillLevel lessons requirements outcomes enrollmentPeriod endDate isSelfPaced"
        );

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        const course = enrollment.course;
        const totalLessons = course.lessons?.length || 0;

        // Convert ObjectIds to strings for consistent comparison
        const completedLessons = (enrollment.completedLessons || []).map(
            (lessonId) => lessonId.toString()
        );
        const completedCount = completedLessons.length;

        // 🆕 FIXED: Same improved logic for enrollment details
        let timeRemainingDisplay = "Self-paced";
        let daysRemaining = null;
        let accessStatus = "Self-paced";

        if (course.enrollmentPeriod > 0 && enrollment.accessUntil) {
            const now = new Date();
            const accessUntil = new Date(enrollment.accessUntil);
            const timeRemaining = Math.ceil(
                (accessUntil - now) / (1000 * 60 * 60 * 24)
            );

            daysRemaining = timeRemaining > 0 ? timeRemaining : 0;

            if (daysRemaining > 0) {
                if (daysRemaining >= 30) {
                    const months = Math.floor(daysRemaining / 30);
                    timeRemainingDisplay = `${months} month${
                        months > 1 ? "s" : ""
                    } remaining`;
                } else if (daysRemaining >= 7) {
                    const weeks = Math.floor(daysRemaining / 7);
                    timeRemainingDisplay = `${weeks} week${
                        weeks > 1 ? "s" : ""
                    } remaining`;
                } else {
                    timeRemainingDisplay = `${daysRemaining} day${
                        daysRemaining > 1 ? "s" : ""
                    } remaining`;
                }
                accessStatus = timeRemainingDisplay;
            } else {
                timeRemainingDisplay = "Access expired";
                accessStatus = "Expired";
            }
        }

        // Get lesson details with completion status
        const lessonsWithProgress =
            course.lessons?.map((lesson) => ({
                id: lesson._id,
                title: lesson.title,
                duration: lesson.duration,
                order: lesson.order,
                isRequired: lesson.isRequired,
                isCompleted: completedLessons.includes(lesson._id.toString()),
                content: lesson.content,
            })) || [];

        res.status(statusCodes.OK).json({
            success: true,
            enrollment: {
                id: enrollment._id,
                course: {
                    id: course._id,
                    title: course.title,
                    description: course.description,
                    image: course.image,
                    duration: course.duration,
                    category: course.category,
                    skillLevel: course.skillLevel,
                    requirements: course.requirements,
                    outcomes: course.outcomes,
                    enrollmentPeriod: course.enrollmentPeriod,
                    endDate: course.endDate,
                    isSelfPaced: course.isSelfPaced,
                },
                progress: enrollment.progress,
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
                accessUntil: enrollment.accessUntil,
                lastAccessedLesson: enrollment.lastAccessedLesson,
                completedLessons: completedLessons,
                timeRemaining: timeRemainingDisplay,
                accessStatus: accessStatus, // 🆕 Use improved status
                completedLessonsCount: completedCount,
                totalLessonsCount: totalLessons,
                daysRemaining: daysRemaining,
                lessons: lessonsWithProgress,
            },
        });
    } catch (error) {
        next(error);
    }
};

// 🆕 ADD: Helper function for certificate generation
function generateVerificationCode() {
    return "FAST-C" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// The rest of your existing functions (cancelEnrollment, completeLesson) remain the same
// but will automatically benefit from the new model logic

exports.cancelEnrollment = async (req, res, next) => {
    const { enrollmentId } = req.params;
    const userId = req.user.id;
    try {
        // Allow cancellation for both "pending" and "active" enrollments
        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: { $in: ["pending", "active"] },
        });

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found or cannot be cancelled",
            });
        }

        enrollment.status = "cancelled";
        enrollment.cancelledAt = new Date();
        await enrollment.save();

        res.status(statusCodes.OK).json({
            success: true,
            message: "Enrollment cancelled successfully",
            enrollment: {
                id: enrollment._id,
                status: enrollment.status,
                cancelledAt: enrollment.cancelledAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.completeLesson = async (req, res, next) => {
    const { enrollmentId } = req.params;
    const { lessonId } = req.body;
    const userId = req.user.id;

    try {
        console.log(
            `🔄 [Backend] Completing lesson ${lessonId} for enrollment ${enrollmentId}, user ${userId}`
        );

        const enrollment = await Enrollment.findOne({
            _id: enrollmentId,
            user: userId,
            status: "active",
        })
            .populate("course")
            .populate("user");

        if (!enrollment) {
            console.log(
                `❌ [Backend] Active enrollment not found: ${enrollmentId}`
            );
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Active enrollment not found",
            });
        }

        // 🆕 ADD: Check if enrollment access has expired
        if (enrollment.hasExpired) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Course access has expired",
            });
        }

        const course = enrollment.course;

        // Verify lesson exists in course
        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            console.log(`❌ [Backend] Lesson not found in course: ${lessonId}`);
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Lesson not found in this course",
            });
        }

        // Convert both to string for consistent comparison
        const completedLessonIds = enrollment.completedLessons.map((id) =>
            id.toString()
        );

        // Check if lesson already completed
        if (completedLessonIds.includes(lessonId)) {
            console.log(`⚠️ [Backend] Lesson already completed: ${lessonId}`);
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Lesson already completed",
            });
        }

        // Mark lesson as completed
        enrollment.completedLessons.push(lessonId);
        enrollment.lastAccessedLesson = lessonId;

        // Calculate new progress
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        const newProgress = Math.round((completedCount / totalLessons) * 100);
        enrollment.progress = newProgress;

        let isCourseCompleted = false;

        // Check if course is completed
        if (newProgress === 100) {
            enrollment.status = "completed";
            enrollment.completedAt = new Date();
            isCourseCompleted = true;
            console.log(
                `🎉 [Backend] Course completed! Enrollment: ${enrollmentId}`
            );
        }

        await enrollment.save();

        // 🆕 FIXED: AUTOMATICALLY GENERATE CERTIFICATE IF COURSE COMPLETED
        if (isCourseCompleted) {
            try {
                const Certificate = require("../models/certificate");
                const { generateCertificatePDF } = require("./certificate");

                // Check if certificate already exists
                const existingCertificate = await Certificate.findOne({
                    enrollment: enrollmentId,
                });

                console.log(
                    `🔍 [Backend] Certificate check - existing:`,
                    existingCertificate ? existingCertificate._id : "none"
                );

                if (!existingCertificate) {
                    console.log(
                        `📜 [Backend] Generating certificate for completed course: ${enrollment.course.title}`
                    ); // 🆕 FIXED: Use enrollment.course.title
                    console.log(
                        `👤 [Backend] User: ${enrollment.user.name}, Course: ${enrollment.course.title}`
                    );

                    const completionDate = enrollment.completedAt || new Date();
                    const expirationDate = new Date(completionDate);
                    expirationDate.setFullYear(
                        completionDate.getFullYear() + 1
                    );

                    console.log(
                        `📄 [Backend] Creating certificate PDF for: ${enrollment.user.name} - ${enrollment.course.title}`
                    );

                    // 🆕 FIXED: Use EXACT same pattern as certificate controller
                    const certificateUrl = await generateCertificatePDF(
                        enrollment.user, // 🆕 Use populated user from enrollment
                        enrollment.course, // 🆕 Use populated course from enrollment
                        completionDate,
                        expirationDate
                    );

                    console.log(
                        `✅ [Backend] PDF generated, URL: ${certificateUrl}`
                    );

                    // 🆕 FIXED: Use EXACT same title format as certificate controller
                    const certificateTitle = `${enrollment.course.title}`; // 🆕 SAME as certificate controller

                    // Create certificate record - EXACT same structure as certificate controller
                    const newCertificate = await Certificate.create({
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

                    console.log(
                        `🎉 [Backend] Certificate created successfully:`,
                        {
                            id: newCertificate._id,
                            title: newCertificate.title,
                            course: newCertificate.course,
                            user: newCertificate.user,
                        }
                    );
                } else {
                    console.log(
                        `ℹ️ [Backend] Certificate already exists:`,
                        existingCertificate._id
                    );
                }
            } catch (certError) {
                console.error(
                    `❌ [Backend] Certificate generation failed:`,
                    certError
                );
                // Don't fail the lesson completion if certificate generation fails
            }
        }

        console.log(
            `✅ [Backend] Lesson completed successfully. Progress: ${newProgress}%`
        );

        const returnedCompletedLessons = enrollment.completedLessons.map((id) =>
            id.toString()
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: "Lesson completed successfully",
            data: {
                enrollment: {
                    id: enrollment._id,
                    progress: enrollment.progress,
                    completedLessons: returnedCompletedLessons,
                    status: enrollment.status,
                    completedAt: enrollment.completedAt,
                    lastAccessedLesson: enrollment.lastAccessedLesson,
                },
                lesson: {
                    id: lessonId,
                    title: lesson.title,
                    completed: true,
                    completedAt: new Date(),
                },
                courseProgress: {
                    completed: completedCount,
                    total: totalLessons,
                    percentage: newProgress,
                    isCourseCompleted: isCourseCompleted,
                },
            },
        });
    } catch (error) {
        console.error("❌ [Backend] Error in completeLesson:", error);
        next(error);
    }
};
