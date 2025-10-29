const User = require("../models/user");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
const Certificate = require("../models/certificate");
const ExportLog = require("../models/exportLog");
const { statusCodes } = require("../utils/constant");

// Get comprehensive dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get current date for monthly calculations
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate date ranges
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfLastMonth = new Date(currentYear, currentMonth, 0);

        // Parallel database queries for performance
        const [
            totalTrainees,
            activeCourses,
            pendingEnrollments,
            pendingApprovals,
            currentMonthExports,
            lastMonthExports,
            adminExports,
            companyExports,
            uniqueExporters,
            onlineUsersCount,
        ] = await Promise.all([
            // Total approved trainees
            User.countDocuments({
                role: "user",
                profileStatus: "approved",
            }),

            // Active courses (not ended and active)
            Course.countDocuments({
                isActive: true,
                $or: [{ endDate: { $gt: now } }, { endDate: null }],
            }),

            // Pending enrollments
            Enrollment.countDocuments({
                status: "pending",
            }),

            // Users pending approval
            User.countDocuments({
                profileStatus: "pending",
            }),

            // CSV exports this month
            ExportLog.countDocuments({
                exportType: "job-matching",
                createdAt: { $gte: startOfCurrentMonth },
            }),

            // CSV exports last month
            ExportLog.countDocuments({
                exportType: "job-matching",
                createdAt: {
                    $gte: startOfLastMonth,
                    $lte: endOfLastMonth,
                },
            }),

            // Admin exports this month
            ExportLog.countDocuments({
                role: { $in: ["admin", "superAdmin"] },
                exportType: "job-matching",
                createdAt: { $gte: startOfCurrentMonth },
            }),

            // Company exports this month
            ExportLog.countDocuments({
                role: "company",
                exportType: "job-matching",
                createdAt: { $gte: startOfCurrentMonth },
            }),

            // Unique exporters this month
            ExportLog.distinct("user", {
                exportType: "job-matching",
                createdAt: { $gte: startOfCurrentMonth },
            }).then((users) => users.length),

            // Online users (last 15 minutes)
            User.countDocuments({
                lastActive: {
                    $gte: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes
                },
            }),
        ]);

        // Calculate percentage change
        let csvExportsPercentage = 0;
        if (lastMonthExports > 0) {
            csvExportsPercentage =
                ((currentMonthExports - lastMonthExports) / lastMonthExports) *
                100;
        } else if (currentMonthExports > 0) {
            csvExportsPercentage = 100;
        }

        res.status(statusCodes.OK).json({
            success: true,
            stats: {
                totalTrainees,
                activeCourses,
                pendingEnrollments,
                pendingApprovals,
                csvExportsThisMonth: currentMonthExports,
                csvExportsLastMonth: lastMonthExports,
                csvExportsPercentage: Math.round(csvExportsPercentage),
                adminExports,
                companyExports,
                uniqueExporters,
                onlineUsers: onlineUsersCount,
            },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        next(error);
    }
};

// Get recent activities across the system
exports.getRecentActivities = async (req, res, next) => {
    try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [recentCompletions, recentEnrollments, recentCertificates] =
            await Promise.all([
                // Recent course completions
                Enrollment.find({
                    status: "completed",
                    completedAt: { $gte: oneWeekAgo },
                })
                    .populate("user", "firstName surname name")
                    .populate("course", "title")
                    .sort({ completedAt: -1 })
                    .limit(5)
                    .lean(),

                // Recent enrollments
                Enrollment.find({
                    enrolledAt: { $gte: oneWeekAgo },
                })
                    .populate("user", "firstName surname name")
                    .populate("course", "title")
                    .sort({ enrolledAt: -1 })
                    .limit(5)
                    .lean(),

                // Recent certificates
                Certificate.find({
                    createdAt: { $gte: oneWeekAgo },
                })
                    .populate("user", "firstName surname name")
                    .populate("course", "title")
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .lean(),
            ]);

        res.status(statusCodes.OK).json({
            success: true,
            activities: {
                recentCompletions,
                recentEnrollments,
                recentCertificates,
            },
        });
    } catch (error) {
        console.error("Recent activities error:", error);
        next(error);
    }
};

// Get system overview with additional metrics
exports.getSystemOverview = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalCourses,
            totalCertificates,
            totalEnrollments,
            completionRate,
            popularCourses,
            userGrowth,
        ] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Certificate.countDocuments(),
            Enrollment.countDocuments(),

            // Completion rate calculation
            Enrollment.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        completed: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "completed"] },
                                    1,
                                    0,
                                ],
                            },
                        },
                    },
                },
            ]),

            // Popular courses (most enrollments)
            Enrollment.aggregate([
                {
                    $group: {
                        _id: "$course",
                        enrollmentCount: { $sum: 1 },
                    },
                },
                { $sort: { enrollmentCount: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "course",
                    },
                },
                { $unwind: "$course" },
            ]),

            // User growth (last 6 months)
            User.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(
                                new Date().setMonth(new Date().getMonth() - 6)
                            ),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
        ]);

        const completionRateData = completionRate[0]
            ? (completionRate[0].completed / completionRate[0].total) * 100
            : 0;

        res.status(statusCodes.OK).json({
            success: true,
            overview: {
                totalUsers,
                totalCourses,
                totalCertificates,
                totalEnrollments,
                completionRate: Math.round(completionRateData),
                popularCourses,
                userGrowth,
            },
        });
    } catch (error) {
        console.error("System overview error:", error);
        next(error);
    }
};

// Get online users count
exports.getOnlineUsers = async (req, res, next) => {
    try {
        const onlineUsers = await User.countDocuments({
            lastActive: {
                $gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
            },
        });

        res.status(statusCodes.OK).json({
            success: true,
            onlineUsers,
        });
    } catch (error) {
        console.error("Online users error:", error);
        next(error);
    }
};
