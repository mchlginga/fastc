const Attendance = require("../models/attendance");
const { statusCodes } = require("../utils/constant");
const mongoose = require("mongoose");

// Get all attendance records with filtering and pagination
exports.getAttendanceRecords = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            date = "",
            course = "",
            status = "",
            startDate = "",
            endDate = "",
            sortBy = "verifiedAt",
            sortOrder = "desc",
        } = req.query;

        // Build aggregation pipeline
        const pipeline = [];

        // Match stage for basic filters
        const matchStage = {};

        // Status filter
        if (status && status !== "all") {
            matchStage.status = status;
        }

        // Course filter - handle both ID and title search
        if (course && course !== "all") {
            // If it's a valid ObjectId, use it as ID filter
            if (mongoose.Types.ObjectId.isValid(course)) {
                matchStage.course = new mongoose.Types.ObjectId(course);
            }
            // Otherwise, we'll handle course title search in the search section
        }

        // Date filter
        if (date && date !== "all") {
            const now = new Date();
            let start, end;

            switch (date) {
                case "today":
                    start = new Date(now.setHours(0, 0, 0, 0));
                    end = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case "yesterday":
                    start = new Date(now.setDate(now.getDate() - 1));
                    start.setHours(0, 0, 0, 0);
                    end = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case "thisWeek":
                    start = new Date(now.setDate(now.getDate() - now.getDay()));
                    start.setHours(0, 0, 0, 0);
                    end = new Date();
                    break;
                case "lastWeek":
                    start = new Date(
                        now.setDate(now.getDate() - now.getDay() - 7)
                    );
                    start.setHours(0, 0, 0, 0);
                    end = new Date(now.setDate(now.getDate() + 6));
                    end.setHours(23, 59, 59, 999);
                    break;
                case "thisMonth":
                    start = new Date(now.getFullYear(), now.getMonth(), 1);
                    end = new Date();
                    break;
                case "lastMonth":
                    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    end = new Date(now.getFullYear(), now.getMonth(), 0);
                    break;
            }

            if (start && end) {
                matchStage.verifiedAt = { $gte: start, $lte: end };
            }
        }

        // Custom date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            matchStage.verifiedAt = { $gte: start, $lte: end };
        }

        // Add initial match stage if we have any filters
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Lookup user and course data
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $unwind: {
                    path: "$course",
                    preserveNullAndEmptyArrays: true,
                },
            }
        );

        // Search filter using aggregation - handle both general search and course title search
        if (search) {
            const searchMatchStage = {
                $or: [
                    { "user.firstName": { $regex: search, $options: "i" } },
                    { "user.surname": { $regex: search, $options: "i" } },
                    { "user.email": { $regex: search, $options: "i" } },
                    { "course.title": { $regex: search, $options: "i" } },
                ],
            };

            // If course filter is provided as text (not ID), add it to search
            if (
                course &&
                course !== "all" &&
                !mongoose.Types.ObjectId.isValid(course)
            ) {
                searchMatchStage.$or.push({
                    "course.title": { $regex: course, $options: "i" },
                });
            }

            pipeline.push({ $match: searchMatchStage });
        } else if (
            course &&
            course !== "all" &&
            !mongoose.Types.ObjectId.isValid(course)
        ) {
            // Handle course title filter when no general search
            pipeline.push({
                $match: {
                    "course.title": { $regex: course, $options: "i" },
                },
            });
        }

        // Create count pipeline for total records (without pagination)
        const countPipeline = [...pipeline];
        countPipeline.push({ $count: "total" });

        // Execute count query
        const countResult = await Attendance.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        // Add sorting
        const sortConfig = {};

        // Handle different sort fields - convert to aggregation format
        let sortField = sortBy;
        if (
            sortBy === "user.firstName" ||
            sortBy === "user.surname" ||
            sortBy === "user.email"
        ) {
            sortField = `user.${sortBy.split(".")[1]}`;
        } else if (sortBy === "course.title") {
            sortField = "course.title";
        } else {
            sortField = sortBy; // verifiedAt, status, etc.
        }

        sortConfig[sortField] = sortOrder === "desc" ? -1 : 1;
        pipeline.push({ $sort: sortConfig });

        // Add pagination
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: parseInt(limit) });

        // Project only the fields we need (optional - for cleaner response)
        pipeline.push({
            $project: {
                _id: 1,
                status: 1,
                verificationMethod: 1,
                verifiedAt: 1,
                "user._id": 1,
                "user.firstName": 1,
                "user.surname": 1,
                "user.email": 1,
                "user.profilePic": 1,
                "course._id": 1,
                "course.title": 1,
                lesson: 1,
            },
        });

        // Execute aggregation
        const records = await Attendance.aggregate(pipeline);

        res.status(statusCodes.OK).json({
            success: true,
            records,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                recordsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        next(error);
    }
};

// Get attendance record by ID
exports.getAttendanceRecordById = async (req, res, next) => {
    try {
        const record = await Attendance.findById(req.params.id)
            .populate("user", "firstName surname email profilePic")
            .populate("course", "title description")
            .populate("lesson");

        if (!record) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            record,
        });
    } catch (error) {
        next(error);
    }
};

// Manually verify attendance
exports.verifyAttendance = async (req, res, next) => {
    try {
        const record = await Attendance.findByIdAndUpdate(
            req.params.id,
            {
                status: "verified",
                verificationMethod: "manual",
            },
            { new: true, runValidators: true }
        )
            .populate("user", "firstName surname email profilePic")
            .populate("course", "title");

        if (!record) {
            return res.status(statusCodes.NOT_FOUND).json({
                success: false,
                message: "Attendance record not found",
            });
        }

        res.status(statusCodes.OK).json({
            success: true,
            message: "Attendance manually verified",
            record,
        });
    } catch (error) {
        next(error);
    }
};

// Export attendance data as CSV
exports.exportAttendance = async (req, res, next) => {
    try {
        const {
            search = "",
            date = "",
            course = "",
            status = "",
            startDate = "",
            endDate = "",
        } = req.query;

        // Build aggregation pipeline
        const pipeline = [];
        const matchStage = {};

        // Status filter
        if (status && status !== "all") {
            matchStage.status = status;
        }

        // Course filter - handle both ID and title search
        if (course && course !== "all") {
            // If it's a valid ObjectId, use it as ID filter
            if (mongoose.Types.ObjectId.isValid(course)) {
                matchStage.course = new mongoose.Types.ObjectId(course);
            }
            // Otherwise, we'll handle course title search in the search section
        }

        // Date filter
        if (date && date !== "all") {
            const now = new Date();
            let start, end;

            switch (date) {
                case "today":
                    start = new Date(now.setHours(0, 0, 0, 0));
                    end = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case "yesterday":
                    start = new Date(now.setDate(now.getDate() - 1));
                    start.setHours(0, 0, 0, 0);
                    end = new Date(now.setHours(23, 59, 59, 999));
                    break;
                case "thisWeek":
                    start = new Date(now.setDate(now.getDate() - now.getDay()));
                    start.setHours(0, 0, 0, 0);
                    end = new Date();
                    break;
                case "lastWeek":
                    start = new Date(
                        now.setDate(now.getDate() - now.getDay() - 7)
                    );
                    start.setHours(0, 0, 0, 0);
                    end = new Date(now.setDate(now.getDate() + 6));
                    end.setHours(23, 59, 59, 999);
                    break;
                case "thisMonth":
                    start = new Date(now.getFullYear(), now.getMonth(), 1);
                    end = new Date();
                    break;
                case "lastMonth":
                    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    end = new Date(now.getFullYear(), now.getMonth(), 0);
                    break;
            }

            if (start && end) {
                matchStage.verifiedAt = { $gte: start, $lte: end };
            }
        }

        // Custom date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            matchStage.verifiedAt = { $gte: start, $lte: end };
        }

        // Add initial match stage if we have any filters
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Lookup user and course data
        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $unwind: {
                    path: "$course",
                    preserveNullAndEmptyArrays: true,
                },
            }
        );

        // Search filter using aggregation - handle both general search and course title search
        if (search) {
            const searchMatchStage = {
                $or: [
                    { "user.firstName": { $regex: search, $options: "i" } },
                    { "user.surname": { $regex: search, $options: "i" } },
                    { "user.email": { $regex: search, $options: "i" } },
                    { "course.title": { $regex: search, $options: "i" } },
                ],
            };

            // If course filter is provided as text (not ID), add it to search
            if (
                course &&
                course !== "all" &&
                !mongoose.Types.ObjectId.isValid(course)
            ) {
                searchMatchStage.$or.push({
                    "course.title": { $regex: course, $options: "i" },
                });
            }

            pipeline.push({ $match: searchMatchStage });
        } else if (
            course &&
            course !== "all" &&
            !mongoose.Types.ObjectId.isValid(course)
        ) {
            // Handle course title filter when no general search
            pipeline.push({
                $match: {
                    "course.title": { $regex: course, $options: "i" },
                },
            });
        }

        // Lookup lesson data for more detailed information
        pipeline.push(
            {
                $lookup: {
                    from: "lessons",
                    localField: "lesson",
                    foreignField: "_id",
                    as: "lesson",
                },
            },
            {
                $unwind: {
                    path: "$lesson",
                    preserveNullAndEmptyArrays: true,
                },
            }
        );

        // Sort by latest first
        pipeline.push({ $sort: { verifiedAt: -1 } });

        // Project only the fields we need for CSV
        pipeline.push({
            $project: {
                _id: 0,
                status: 1,
                verificationMethod: 1,
                verifiedAt: 1,
                "user.firstName": 1,
                "user.surname": 1,
                "user.email": 1,
                "course.title": 1,
                "lesson.order": 1,
                "lesson.title": 1,
            },
        });

        // Get records
        const records = await Attendance.aggregate(pipeline);

        // Convert to CSV
        const csvHeaders =
            "Trainee Name,Email,Course,Lesson,Lesson Title,Clock-in Time,Status,Verification Method\n";

        const csvData = records
            .map((record) => {
                const traineeName = `${record.user?.firstName || ""} ${
                    record.user?.surname || ""
                }`.trim();
                const email = record.user?.email || "N/A";
                const courseTitle = record.course?.title || "N/A";
                const lessonOrder = record.lesson?.order
                    ? `Lesson ${record.lesson.order}`
                    : "N/A";
                const lessonTitle = record.lesson?.title || "N/A";
                const clockInTime = record.verifiedAt
                    ? new Date(record.verifiedAt).toLocaleString()
                    : "N/A";
                const status = record.status || "N/A";
                const method = record.verificationMethod || "N/A";

                return `"${traineeName}","${email}","${courseTitle}","${lessonOrder}","${lessonTitle}","${clockInTime}","${status}","${method}"`;
            })
            .join("\n");

        const csv = csvHeaders + csvData;

        // Set response headers for CSV download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=attendance-export-${
                new Date().toISOString().split("T")[0]
            }.csv`
        );

        res.status(statusCodes.OK).send(csv);
    } catch (error) {
        console.error("Error exporting attendance:", error);
        next(error);
    }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const total = await Attendance.countDocuments();
        const todayCount = await Attendance.countDocuments({
            verifiedAt: { $gte: today, $lt: tomorrow },
        });
        const verified = await Attendance.countDocuments({
            status: "verified",
        });
        const pending = await Attendance.countDocuments({ status: "pending" });
        const failed = await Attendance.countDocuments({ status: "failed" });

        res.status(statusCodes.OK).json({
            success: true,
            stats: {
                total,
                today: todayCount,
                verified,
                pending,
                failed,
            },
        });
    } catch (error) {
        next(error);
    }
};
