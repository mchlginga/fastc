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

        // Build filter object
        let filter = {};

        // Search filter
        if (search) {
            filter.$or = [
                { "user.firstName": { $regex: search, $options: "i" } },
                { "user.surname": { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
                { "course.title": { $regex: search, $options: "i" } },
            ];
        }

        // Status filter
        if (status && status !== "all") {
            filter.status = status;
        }

        // Course filter
        if (course && course !== "all") {
            filter["course.title"] = { $regex: course, $options: "i" };
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
                filter.verifiedAt = { $gte: start, $lte: end };
            }
        }

        // Custom date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filter.verifiedAt = { $gte: start, $lte: end };
        }

        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Execute query with pagination and population
        const records = await Attendance.find(filter)
            .populate("user", "firstName surname email profilePic")
            .populate("course", "title")
            .sort(sortConfig)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        // Get total count for pagination
        const total = await Attendance.countDocuments(filter);

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

        // Build filter object (same as getAttendanceRecords)
        let filter = {};

        if (search) {
            filter.$or = [
                { "user.firstName": { $regex: search, $options: "i" } },
                { "user.surname": { $regex: search, $options: "i" } },
                { "user.email": { $regex: search, $options: "i" } },
                { "course.title": { $regex: search, $options: "i" } },
            ];
        }

        if (status && status !== "all") {
            filter.status = status;
        }

        if (course && course !== "all") {
            filter["course.title"] = { $regex: course, $options: "i" };
        }

        // Get records with population
        const records = await Attendance.find(filter)
            .populate("user", "firstName surname email")
            .populate("course", "title")
            .sort({ verifiedAt: -1 });

        // Convert to CSV
        const csvHeaders =
            "Trainee Name,Email,Course,Lesson,Clock-in Time,Status,Verification Method\n";

        const csvData = records
            .map((record) => {
                const traineeName = `${record.user.firstName} ${record.user.surname}`;
                const email = record.user.email;
                const courseTitle = record.course?.title || "N/A";
                const lesson = `Lesson ${record.lesson?.order || "N/A"}`;
                const clockInTime = new Date(
                    record.verifiedAt
                ).toLocaleString();
                const status = record.status;
                const method = record.verificationMethod;

                return `"${traineeName}","${email}","${courseTitle}","${lesson}","${clockInTime}","${status}","${method}"`;
            })
            .join("\n");

        const csv = csvHeaders + csvData;

        // Set response headers for CSV download
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=attendance-${
                new Date().toISOString().split("T")[0]
            }.csv`
        );

        res.status(statusCodes.OK).send(csv);
    } catch (error) {
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
