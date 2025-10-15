const User = require("../models/user");
const Course = require("../models/course");
const Completion = require("../models/completion");
const Certificate = require("../models/certificate");
const ExportLog = require("../models/exportLog");
const { statusCodes } = require("../utils/constant");

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Total trainees (users with role 'user')
        const totalTrainees = await User.countDocuments({ role: "user" });

        // Active courses (courses without endDate or endDate > now)
        const now = new Date();
        const activeCourses = await Course.countDocuments({
            $or: [{ endDate: { $gt: now } }, { endDate: null }],
        });

        // Pending enrollments (completions with status 'pending')
        const pendingEnrollments = await Completion.countDocuments({
            status: "pending",
        });

        // Pending profile approvals (users with profileStatus 'pending')
        const pendingApprovals = await User.countDocuments({
            profileStatus: "pending",
        });

        // Export to CSV usage - count exports this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );
        1;
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const csvExportsThisMonth = await ExportLog.countDocuments({
            createdAt: { $gte: startOfMonth },
        });
        const csvExportsLastMonth = await ExportLog.countDocuments({
            createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        });

        // Count exports by admin and company separately
        const adminExports = await ExportLog.countDocuments({
            role: "admin",
            createdAt: { $gte: startOfMonth },
        });

        const companyExports = await ExportLog.countDocuments({
            role: "company",
            createdAt: { $gte: startOfMonth },
        });

        // Count unique users who exported CSV this month
        const uniqueExporters = await ExportLog.distinct("user", {
            createdAt: { $gte: startOfMonth },
        });

        // Calculate percentage (assuming 100 exports per month as target)
        const csvExportsPercentage = Math.min(
            Math.round((csvExportsThisMonth / csvExportsLastMonth) * 100),
            100
        );

        res.status(statusCodes.OK).json({
            totalTrainees,
            activeCourses,
            pendingEnrollments,
            pendingApprovals,
            csvExportsThisMonth,
            csvExportsLastMonth,
            csvExportsPercentage,
            adminExports,
            companyExports,
            uniqueExporters: uniqueExporters.length,
        });
    } catch (error) {
        next(error);
    }
};

// Get online users (users active in last 5 minutes)
exports.getOnlineUsers = async (req, res, next) => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const onlineUsers = await User.countDocuments({
            lastActive: { $gte: fiveMinutesAgo },
            role: "user",
        });

        res.status(statusCodes.OK).json({ onlineUsers });
    } catch (error) {
        next(error);
    }
};

// Get recent activities (last 5 completions, enrollments, certificates)
exports.getRecentActivities = async (req, res, next) => {
    try {
        const recentCompletions = await Completion.find({ progress: 100 })
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("course", "title")
            .lean();

        const recentEnrollments = await Completion.find({
            status: "approved",
            progress: { $lt: 100 },
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("course", "title")
            .lean();

        const recentCertificates = await Certificate.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email")
            .populate("course", "title")
            .lean();

        res.status(statusCodes.OK).json({
            recentCompletions,
            recentEnrollments,
            recentCertificates,
        });
    } catch (error) {
        next(error);
    }
};

// Get export history (recent exports)
exports.getExportHistory = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const exports = await ExportLog.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate("user", "name email role")
            .lean();

        res.status(statusCodes.OK).json({ exports });
    } catch (error) {
        next(error);
    }
};
