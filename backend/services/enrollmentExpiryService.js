const Enrollment = require("../models/enrollment");
const EnrollmentCalculator = require("../utils/enrollmentCalculator");

class EnrollmentExpiryService {
    /**
     * Check and update expired enrollments
     * Runs as a cron job daily
     */
    static async processExpiredEnrollments() {
        try {
            const now = new Date();

            // Find enrollments that have expired but aren't marked as expired
            const expiredEnrollments = await Enrollment.find({
                accessExpiresAt: { $lte: now },
                status: { $in: ["active", "pending"] },
            });

            if (expiredEnrollments.length === 0) {
                console.log("No expired enrollments found.");
                return;
            }

            // Update status to expired
            const result = await Enrollment.updateMany(
                {
                    accessExpiresAt: { $lte: now },
                    status: { $in: ["active", "pending"] },
                },
                {
                    status: "expired",
                    expiryNotified: false,
                }
            );

            console.log(
                `Updated ${result.modifiedCount} enrollments to expired status.`
            );

            return result.modifiedCount;
        } catch (error) {
            console.error("Error processing expired enrollments:", error);
            throw error;
        }
    }

    /**
     * Check for enrollments expiring soon (for notifications)
     */
    static async getEnrollmentsExpiringSoon(days = 7) {
        try {
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() + days);

            const expiringEnrollments = await Enrollment.find({
                accessExpiresAt: {
                    $lte: thresholdDate,
                    $gt: new Date(),
                },
                status: "active",
                expiryNotified: false,
            })
                .populate("user", "firstName surname email")
                .populate("course", "title");

            return expiringEnrollments;
        } catch (error) {
            console.error("Error fetching expiring enrollments:", error);
            throw error;
        }
    }
}

module.exports = EnrollmentExpiryService;
