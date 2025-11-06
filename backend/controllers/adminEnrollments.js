const Enrollment = require("../models/enrollment");
const User = require("../models/user");
const Course = require("../models/course");
const mongoose = require("mongoose");
const { statusCodes } = require("../utils/constant");

// Get all enrollments with filtering and pagination
exports.getEnrollments = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            course = "",
            user = "",
            sortBy = "enrolledAt",
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

        // Search filter - we'll handle this after population
        let searchFilter = {};
        if (search) {
            searchFilter = {
                $or: [
                    { "user.firstName": { $regex: search, $options: "i" } },
                    { "user.surname": { $regex: search, $options: "i" } },
                    { "user.email": { $regex: search, $options: "i" } },
                    { "user.companyName": { $regex: search, $options: "i" } },
                    { "course.title": { $regex: search, $options: "i" } },
                ],
            };
        }

        // Execute query with pagination and population
        let enrollments = await Enrollment.find(filter)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .populate("lastAccessedLesson", "title")
            .sort({ createdAt: -1 }) // Default sort by creation date
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean(); // Convert to plain objects for sorting

        // Apply search filter after population
        let filteredEnrollments = enrollments;
        if (search) {
            filteredEnrollments = enrollments.filter((enrollment) => {
                return (
                    enrollment.user?.firstName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    enrollment.user?.surname
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    enrollment.user?.email
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    enrollment.user?.companyName
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                    enrollment.course?.title
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                );
            });
        }

        const sortedEnrollments = filteredEnrollments.sort((a, b) => {
            // Priority: pending first
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;

            // Same status, sort by appropriate date
            const dateA = new Date(
                a.requestedAt || a.enrolledAt || a.createdAt
            );
            const dateB = new Date(
                b.requestedAt || b.enrolledAt || b.createdAt
            );

            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

        // Get total count for pagination
        const total = await Enrollment.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            enrollments: sortedEnrollments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalEnrollments: total,
                enrollmentsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get enrollment statistics
exports.getEnrollmentStats = async (req, res, next) => {
    try {
        const totalEnrollments = await Enrollment.countDocuments();
        const pendingEnrollments = await Enrollment.countDocuments({
            status: "pending",
        });
        const activeEnrollments = await Enrollment.countDocuments({
            status: "active",
        });
        const completedEnrollments = await Enrollment.countDocuments({
            status: "completed",
        });
        const cancelledEnrollments = await Enrollment.countDocuments({
            status: "cancelled",
        });
        const expiredEnrollments = await Enrollment.countDocuments({
            status: "expired",
        });

        // Average progress
        const progressStats = await Enrollment.aggregate([
            {
                $group: {
                    _id: null,
                    averageProgress: { $avg: "$progress" },
                    totalProgress: { $sum: "$progress" },
                },
            },
        ]);

        // Enrollments by course
        const courseStats = await Enrollment.aggregate([
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
                    averageProgress: { $avg: "$progress" },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        // Enrollments by status over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEnrollments = await Enrollment.countDocuments({
            enrolledAt: { $gte: thirtyDaysAgo },
        });

        res.status(statusCodes.OK).json({
            success: true,
            stats: {
                total: totalEnrollments,
                pending: pendingEnrollments,
                active: activeEnrollments,
                completed: completedEnrollments,
                cancelled: cancelledEnrollments,
                expired: expiredEnrollments,
                averageProgress: progressStats[0]?.averageProgress || 0,
                recentEnrollments: recentEnrollments,
                byCourse: courseStats,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate(
                "user",
                "firstName surname email companyName role profilePic contactNumber"
            )
            .populate(
                "course",
                "title category skillLevel duration image description lessons"
            )
            .populate("lastAccessedLesson", "title duration")
            .populate("completedLessons", "title duration order");

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// Create new enrollment (manual enrollment by admin)
exports.createEnrollment = async (req, res, next) => {
    try {
        const {
            userId,
            courseId,
            status = "pending", // 🆕 CHANGED: Default to pending for consistency
            accessUntil,
            progress = 0,
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

        // Check if course exists and is active
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        if (!course.isActive) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Cannot enroll in inactive course",
            });
        }

        // Check for existing enrollment (exclude cancelled)
        const existingEnrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: { $ne: "cancelled" },
        });

        if (existingEnrollment) {
            return res.status(statusCodes.CONFLICT).json({
                success: false,
                message:
                    "User already has an active or pending enrollment for this course",
                existingEnrollment: {
                    id: existingEnrollment._id,
                    status: existingEnrollment.status,
                },
            });
        }

        // 🆕 NEW: Handle different status scenarios
        const enrolledAt = new Date();
        let accessUntilDate = null;
        let requestedAt = enrolledAt;

        // Only calculate accessUntil for active enrollments with enrollment period
        if (status === "active" && course.enrollmentPeriod > 0) {
            if (accessUntil && accessUntil.trim() !== "") {
                accessUntilDate = new Date(accessUntil);
                if (isNaN(accessUntilDate.getTime())) {
                    return res.status(statusCodes.BAD_REQUEST).json({
                        success: false,
                        message: "Invalid access until date format",
                    });
                }
            } else {
                // Auto-calculate access until based on course enrollment period
                accessUntilDate = new Date();
                accessUntilDate.setDate(
                    accessUntilDate.getDate() + course.enrollmentPeriod
                );
            }
        }

        const enrollmentData = {
            user: userId,
            course: courseId,
            status,
            progress,
            requestedAt: requestedAt,
            // Only set enrolledAt when status is active
            enrolledAt: status === "active" ? enrolledAt : null,
            accessUntil: accessUntilDate,
        };

        // Create enrollment
        const enrollment = await Enrollment.create(enrollmentData);

        // Populate the created enrollment
        const populatedEnrollment = await Enrollment.findById(enrollment._id)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        res.status(statusCodes.CREATED).json({
            success: true,
            message:
                status === "active"
                    ? "Enrollment created and activated successfully"
                    : "Enrollment created successfully (pending approval)",
            enrollment: populatedEnrollment,
        });
    } catch (error) {
        next(error);
    }
};

// Update enrollment status
exports.updateEnrollment = async (req, res, next) => {
    try {
        const {
            status,
            progress,
            accessUntil,
            completedLessons,
            lastAccessedLesson,
        } = req.body;

        const updateData = {};

        if (status) updateData.status = status;
        if (progress !== undefined) updateData.progress = progress;

        //  Handle empty accessUntil
        if (accessUntil !== undefined) {
            if (accessUntil === "" || accessUntil === null) {
                updateData.accessUntil = null;
            } else {
                updateData.accessUntil = new Date(accessUntil);
            }
        }

        if (completedLessons) updateData.completedLessons = completedLessons;
        if (lastAccessedLesson)
            updateData.lastAccessedLesson = lastAccessedLesson;

        // Auto-handle completion
        if (status === "completed" && !updateData.completedAt) {
            updateData.completedAt = new Date();
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .populate("lastAccessedLesson", "title duration")
            .populate("completedLessons", "title duration order");

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Enrollment updated successfully",
            enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// Update enrollment status
exports.updateEnrollmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (
            ![
                "pending",
                "active",
                "completed",
                "cancelled",
                "expired",
            ].includes(status)
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        const updateData = { status };

        // 🆕 NEW: Handle enrolledAt based on status changes
        if (status === "active" && enrollment.status !== "active") {
            updateData.enrolledAt = new Date(); // Set enrolledAt when activating

            // Calculate access until if not already set
            if (!enrollment.accessUntil) {
                const course = await Course.findById(enrollment.course);
                if (course.enrollmentPeriod > 0) {
                    const accessUntil = new Date();
                    accessUntil.setDate(
                        accessUntil.getDate() + course.enrollmentPeriod
                    );
                    updateData.accessUntil = accessUntil;
                }
            }
        } else if (status === "pending" && enrollment.status === "active") {
            updateData.enrolledAt = null; // Clear enrolledAt when moving back to pending
        }

        // Handle completion and cancellation
        if (status === "completed") {
            updateData.completedAt = new Date();
        } else if (status === "cancelled") {
            updateData.completedAt = null;
        }

        const updatedEnrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        res.status(statusCodes.OK).json({
            success: true,
            message: `Enrollment status updated to ${status}`,
            enrollment: updatedEnrollment,
        });
    } catch (error) {
        next(error);
    }
};

// Update enrollment progress
exports.updateEnrollmentProgress = async (req, res, next) => {
    try {
        const { progress, completedLessons, lastAccessedLesson } = req.body;

        const updateData = {};

        if (progress !== undefined) {
            if (progress < 0 || progress > 100) {
                return res.status(statusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Progress must be between 0 and 100",
                });
            }
            updateData.progress = progress;

            // Auto-complete if progress is 100%
            if (progress === 100) {
                updateData.status = "completed";
                updateData.completedAt = new Date();
            }
        }

        if (completedLessons !== undefined) {
            updateData.completedLessons = completedLessons;
        }

        if (lastAccessedLesson !== undefined) {
            updateData.lastAccessedLesson = lastAccessedLesson;
        }

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .populate("lastAccessedLesson", "title duration")
            .populate("completedLessons", "title duration order");

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Enrollment progress updated successfully",
            enrollment,
        });
    } catch (error) {
        next(error);
    }
};

// Bulk update enrollment status
exports.bulkUpdateEnrollmentStatus = async (req, res, next) => {
    try {
        const { enrollmentIds, status } = req.body;

        console.log("Received bulk enrollment update request:", {
            enrollmentIds,
            status,
        });

        if (
            !enrollmentIds ||
            !Array.isArray(enrollmentIds) ||
            enrollmentIds.length === 0
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Enrollment IDs array is required",
            });
        }

        if (
            ![
                "pending",
                "active",
                "completed",
                "cancelled",
                "expired",
            ].includes(status)
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value",
            });
        }

        // Validate and convert enrollment IDs to ObjectId
        const validEnrollmentIds = enrollmentIds
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        if (validEnrollmentIds.length === 0) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No valid enrollment IDs provided",
            });
        }

        console.log(
            "Valid enrollment IDs for bulk update:",
            validEnrollmentIds
        );

        // 🆕 NEW: Get current enrollments to handle enrolledAt logic
        const currentEnrollments = await Enrollment.find({
            _id: { $in: validEnrollmentIds },
        });

        const updateData = { status };

        // Handle enrolledAt for status changes to active
        if (status === "active") {
            updateData.enrolledAt = new Date();

            // For enrollments moving to active, we may need to set accessUntil
            // This would require additional logic to fetch course data
        } else if (status === "pending") {
            // Clear enrolledAt when moving back to pending
            updateData.enrolledAt = null;
        }

        if (status === "completed") {
            updateData.completedAt = new Date();
        } else if (status === "cancelled") {
            updateData.completedAt = null;
        } else if (status === "expired") {
            updateData.accessUntil = new Date(Date.now() - 24 * 60 * 60 * 1000);
        }

        // Update enrollments
        const result = await Enrollment.updateMany(
            { _id: { $in: validEnrollmentIds } },
            updateData
        );

        console.log("Bulk enrollment update result:", result);

        res.status(statusCodes.OK).json({
            success: true,
            message: `Updated ${result.modifiedCount} enrollments to ${status}`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Bulk enrollment update error:", error);
        next(error);
    }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Enrollment deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Get course enrollments
exports.getCourseEnrollments = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        let filter = { course: courseId };
        if (status && status !== "all") {
            filter.status = status;
        }

        const enrollments = await Enrollment.find(filter)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image")
            .sort({ enrolledAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Enrollment.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            enrollments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalEnrollments: total,
                enrollmentsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get user enrollments
exports.getUserEnrollments = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        let filter = { user: userId };
        if (status && status !== "all") {
            filter.status = status;
        }

        const enrollments = await Enrollment.find(filter)
            .populate(
                "course",
                "title category skillLevel duration image description"
            )
            .populate("lastAccessedLesson", "title")
            .sort({ enrolledAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Enrollment.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            enrollments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalEnrollments: total,
                enrollmentsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.approveEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        if (enrollment.status !== "pending") {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Only pending enrollments can be approved",
            });
        }

        // Get course to calculate access period
        const course = await Course.findById(enrollment.course);
        let accessUntil = null;

        // Calculate access until if course has enrollment period
        if (course.enrollmentPeriod > 0) {
            accessUntil = new Date();
            accessUntil.setDate(
                accessUntil.getDate() + course.enrollmentPeriod
            );
        }

        // Update enrollment to active status
        enrollment.status = "active";
        enrollment.enrolledAt = new Date(); // 🆕 Set enrolledAt when approved
        enrollment.accessUntil = accessUntil;
        await enrollment.save();

        // Populate the updated enrollment
        const populatedEnrollment = await Enrollment.findById(enrollment._id)
            .populate(
                "user",
                "firstName surname email companyName role profilePic"
            )
            .populate("course", "title category skillLevel duration image");

        res.status(statusCodes.OK).json({
            success: true,
            message: "Enrollment approved successfully",
            enrollment: populatedEnrollment,
        });
    } catch (error) {
        next(error);
    }
};

exports.bulkApproveEnrollments = async (req, res, next) => {
    try {
        const { enrollmentIds } = req.body;

        if (
            !enrollmentIds ||
            !Array.isArray(enrollmentIds) ||
            enrollmentIds.length === 0
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Enrollment IDs array is required",
            });
        }

        // Validate enrollment IDs
        const validEnrollmentIds = enrollmentIds
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        if (validEnrollmentIds.length === 0) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No valid enrollment IDs provided",
            });
        }

        console.log(
            `🔄 Processing bulk approval for ${validEnrollmentIds.length} enrollments`
        );

        // Get all pending enrollments with course data
        const pendingEnrollments = await Enrollment.find({
            _id: { $in: validEnrollmentIds },
            status: "pending",
        }).populate("course");

        if (pendingEnrollments.length === 0) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "No pending enrollments found to approve",
            });
        }

        console.log(
            `✅ Found ${pendingEnrollments.length} pending enrollments to approve`
        );

        // Update each pending enrollment
        const updatePromises = pendingEnrollments.map(async (enrollment) => {
            let accessUntil = null;

            // Calculate access until if course has enrollment period
            if (enrollment.course && enrollment.course.enrollmentPeriod > 0) {
                accessUntil = new Date();
                accessUntil.setDate(
                    accessUntil.getDate() + enrollment.course.enrollmentPeriod
                );
            }

            return Enrollment.findByIdAndUpdate(
                enrollment._id,
                {
                    status: "active",
                    enrolledAt: new Date(),
                    accessUntil: accessUntil,
                },
                { new: true, runValidators: true }
            );
        });

        const updatedEnrollments = await Promise.all(updatePromises);

        // Get the count of successfully updated enrollments
        const successCount = updatedEnrollments.filter(
            (enrollment) => enrollment !== null
        ).length;

        console.log(`✅ Successfully approved ${successCount} enrollments`);

        res.status(statusCodes.OK).json({
            success: true,
            message: `Approved ${successCount} pending enrollments`,
            approvedCount: successCount,
            totalProcessed: pendingEnrollments.length,
            enrollments: updatedEnrollments,
        });
    } catch (error) {
        console.error("❌ Bulk approval error:", error);
        next(error);
    }
};
