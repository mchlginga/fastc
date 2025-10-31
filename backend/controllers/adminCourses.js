const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const { statusCodes } = require("../utils/constant");

// Get all courses with filtering and pagination
exports.getCourses = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = "",
            category = "",
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build filter object
        let filter = {};

        // Search filter
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        // Status filter
        if (status && status !== "all") {
            if (status === "active") {
                filter.isActive = true;
            } else if (status === "inactive") {
                filter.isActive = false;
            }
        }

        // Category filter
        if (category && category !== "all") {
            filter.category = category;
        }

        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Execute query with pagination
        const courses = await Course.find(filter)
            .sort(sortConfig)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get enrollment counts for each course
        const coursesWithEnrollments = await Promise.all(
            courses.map(async (course) => {
                const enrollmentCount = await Enrollment.countDocuments({
                    course: course._id,
                    status: { $in: ["active", "completed"] },
                });

                return {
                    ...course.toObject(),
                    enrollmentCount,
                };
            })
        );

        // Get total count for pagination
        const total = await Course.countDocuments(filter);

        res.status(statusCodes.OK).json({
            success: true,
            courses: coursesWithEnrollments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalCourses: total,
                coursesPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get course statistics
exports.getCourseStats = async (req, res, next) => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });
        const inactiveCourses = await Course.countDocuments({
            isActive: false,
        });

        const totalEnrollments = await Enrollment.countDocuments({
            status: { $in: ["active", "completed"] },
        });

        const totalLessons = await Course.aggregate([
            {
                $project: {
                    lessonsCount: { $size: { $ifNull: ["$lessons", []] } },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$lessonsCount" },
                },
            },
        ]);

        const categoryStats = await Course.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(statusCodes.OK).json({
            success: true,
            stats: {
                total: totalCourses,
                active: activeCourses,
                inactive: inactiveCourses,
                totalEnrollments: totalEnrollments,
                totalLessons: totalLessons[0]?.total || 0,
                categories: categoryStats,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get course by ID
exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        // Get enrollment count for this course
        const enrollmentCount = await Enrollment.countDocuments({
            course: course._id,
            status: { $in: ["active", "completed"] },
        });

        const courseWithEnrollments = {
            ...course.toObject(),
            enrollmentCount,
        };

        res.status(statusCodes.OK).json({
            success: true,
            course: courseWithEnrollments,
        });
    } catch (error) {
        next(error);
    }
};

// Create new course
exports.createCourse = async (req, res, next) => {
    try {
        let {
            title,
            description,
            category,
            skillLevel = "beginner",
            duration,
            tags = [],
            lessons = [],
            requirements = [],
            outcomes = [],
            isActive = true,
            enrollmentPeriod = 0,
            endDate = null,
        } = req.body;

        // Parse array fields from JSON strings
        if (typeof tags === "string") tags = JSON.parse(tags);
        if (typeof lessons === "string") lessons = JSON.parse(lessons);
        if (typeof requirements === "string")
            requirements = JSON.parse(requirements);
        if (typeof outcomes === "string") outcomes = JSON.parse(outcomes);

        // Convert data types
        if (typeof isActive === "string") isActive = isActive === "true";
        if (typeof enrollmentPeriod === "string")
            enrollmentPeriod = parseInt(enrollmentPeriod) || 0;

        // Validate required fields
        if (!title || !description || !category || !duration) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message:
                    "Title, description, category, and duration are required",
            });
        }

        // Check for duplicate course title
        const existingCourse = await Course.findOne({
            title: { $regex: new RegExp(`^${title}$`, "i") },
        });

        if (existingCourse) {
            return res.status(statusCodes.CONFLICT).json({
                success: false,
                message: "Course with this title already exists",
            });
        }

        // Process lessons
        const processedLessons = lessons.map((lesson, index) => ({
            ...lesson,
            order: lesson.order || index + 1,
            isRequired:
                lesson.isRequired !== undefined ? lesson.isRequired : true,
        }));

        // Handle image path - CLOUDINARY URL
        let imagePath = null;
        if (req.file) {
            imagePath = req.file.path; // Cloudinary URL
        }

        // Create course
        const course = await Course.create({
            title,
            description,
            category,
            skillLevel,
            duration,
            isActive,
            tags,
            lessons: processedLessons,
            requirements,
            outcomes,
            enrollmentPeriod,
            endDate: endDate ? new Date(endDate) : null,
            image: imagePath,
        });

        res.status(statusCodes.CREATED).json({
            success: true,
            message: "Course created successfully",
            course,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        next(error);
    }
};

// Update course status
exports.updateCourseStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value. Use 'active' or 'inactive'",
            });
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { isActive: status === "active" },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: `Course status updated to ${status}`,
            course,
        });
    } catch (error) {
        next(error);
    }
};

// Bulk update course status
exports.bulkUpdateCourseStatus = async (req, res, next) => {
    try {
        const { courseIds, status } = req.body;

        console.log("🔄 Bulk update request:", { courseIds, status });

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Course IDs array is required",
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid status value. Use 'active' or 'inactive'",
            });
        }

        const result = await Course.updateMany(
            { _id: { $in: courseIds } },
            { isActive: status === "active" }
        );

        console.log("✅ Bulk update result:", result);

        res.status(statusCodes.OK).json({
            success: true,
            message: `Updated ${result.modifiedCount} courses to ${status}`,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("❌ Bulk update error:", error);
        next(error);
    }
};

// Update course details
exports.updateCourse = async (req, res, next) => {
    try {
        let {
            title,
            description,
            category,
            skillLevel,
            duration,
            tags = [],
            lessons = [],
            requirements = [],
            outcomes = [],
            isActive,
            enrollmentPeriod,
            endDate,
        } = req.body;

        // 🆕 ADD: Check for image removal flag
        const removeImage = req.body.removeImage === "true";

        // Parse array fields from JSON strings
        if (typeof tags === "string") tags = JSON.parse(tags);
        if (typeof lessons === "string") lessons = JSON.parse(lessons);
        if (typeof requirements === "string")
            requirements = JSON.parse(requirements);
        if (typeof outcomes === "string") outcomes = JSON.parse(outcomes);

        // Convert data types
        if (typeof isActive === "string") isActive = isActive === "true";
        if (typeof enrollmentPeriod === "string")
            enrollmentPeriod = parseInt(enrollmentPeriod) || 0;

        const updateData = {};

        // Only include fields that are provided
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (skillLevel) updateData.skillLevel = skillLevel;
        if (duration) updateData.duration = duration;
        if (tags) updateData.tags = tags;
        if (lessons) updateData.lessons = lessons;
        if (requirements) updateData.requirements = requirements;
        if (outcomes) updateData.outcomes = outcomes;
        if (typeof isActive === "boolean") updateData.isActive = isActive;
        if (enrollmentPeriod !== undefined)
            updateData.enrollmentPeriod = enrollmentPeriod;
        if (endDate !== undefined)
            updateData.endDate = endDate ? new Date(endDate) : null;

        // 🆕 IMPROVED: Handle image upload/removal with Cloudinary
        if (req.file) {
            console.log("🖼️ New image uploaded for course update");

            // Delete old image from Cloudinary if exists
            const course = await Course.findById(req.params.id);
            if (course && course.image) {
                try {
                    const urlParts = course.image.split("/");
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split(".")[0];
                    const fullPublicId = `fastc/courses/${publicId}`;

                    await cloudinary.uploader.destroy(fullPublicId);
                } catch (deleteError) {
                    console.error(
                        "Error deleting old course image:",
                        deleteError
                    );
                }
            }

            updateData.image = req.file.path; // Cloudinary URL
        } else if (removeImage) {
            console.log("🗑️ Removing course image");

            // Delete image from Cloudinary
            const course = await Course.findById(req.params.id);
            if (course && course.image) {
                try {
                    const urlParts = course.image.split("/");
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split(".")[0];
                    const fullPublicId = `fastc/courses/${publicId}`;

                    await cloudinary.uploader.destroy(fullPublicId);
                } catch (deleteError) {
                    console.error("Error deleting course image:", deleteError);
                }
            }

            updateData.image = null;
        }
        // If neither, the image field won't be updated (keeps existing image)

        // Validate skill level if provided
        if (
            skillLevel &&
            !["beginner", "intermediate", "advanced"].includes(skillLevel)
        ) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid skill level",
            });
        }

        // Check for duplicate title if title is being updated
        if (title) {
            const existingCourse = await Course.findOne({
                title: { $regex: new RegExp(`^${title}$`, "i") },
                _id: { $ne: req.params.id },
            });

            if (existingCourse) {
                return res.status(statusCodes.CONFLICT).json({
                    success: false,
                    message: "Another course with this title already exists",
                });
            }
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Course updated successfully",
            course,
        });
    } catch (error) {
        console.error("Error updating course:", error);
        next(error);
    }
};

// Delete course
exports.deleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id;

        // Check if course has active enrollments
        const activeEnrollments = await Enrollment.countDocuments({
            course: courseId,
            status: { $in: ["active", "pending"] },
        });

        if (activeEnrollments > 0) {
            return res.status(statusCodes.CONFLICT).json({
                success: false,
                message:
                    "Cannot delete course with active or pending enrollments",
            });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        // Delete course image from Cloudinary if exists
        if (course.image) {
            try {
                const urlParts = course.image.split("/");
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split(".")[0];
                const fullPublicId = `fastc/courses/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId);
            } catch (deleteError) {
                console.error(
                    "Error deleting course image from Cloudinary:",
                    deleteError
                );
            }
        }

        // Delete the course from database
        await Course.findByIdAndDelete(courseId);

        // Delete related enrollments (cancelled and completed ones)
        await Enrollment.deleteMany({ course: courseId });

        res.status(statusCodes.OK).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Upload course image
exports.uploadCourseImage = async (req, res, next) => {
    try {
        // This would typically handle file upload using multer or similar
        // For now, we'll assume the file path is provided in the request
        const { imagePath } = req.body;

        if (!imagePath) {
            return res.status(statusCodes.BAD_REQUEST).json({
                success: false,
                message: "Image path is required",
            });
        }

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { image: imagePath },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Course image uploaded successfully",
            course,
        });
    } catch (error) {
        next(error);
    }
};

// Remove course image
exports.removeCourseImage = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Course not found",
            });
        }

        // Delete image from Cloudinary if exists
        if (course.image) {
            try {
                const urlParts = course.image.split("/");
                const publicIdWithExtension = urlParts[urlParts.length - 1];
                const publicId = publicIdWithExtension.split(".")[0];
                const fullPublicId = `fastc/courses/${publicId}`;

                await cloudinary.uploader.destroy(fullPublicId);
            } catch (deleteError) {
                console.error(
                    "Error deleting course image from Cloudinary:",
                    deleteError
                );
            }
        }

        // Update course to remove image reference
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { image: null },
            { new: true, runValidators: true }
        );

        res.status(statusCodes.OK).json({
            success: true,
            message: "Course image removed successfully",
            course: updatedCourse,
        });
    } catch (error) {
        next(error);
    }
};
