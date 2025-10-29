import { api } from "./api";

class ProgressService {
    // Singleton pattern for consistent state management
    constructor() {
        this.cache = new Map();
    }

    async completeLesson(enrollmentId, lessonId) {
        try {
            console.log(
                `🔄 [ProgressService] Completing lesson ${lessonId} for enrollment ${enrollmentId}`
            );
            const response = await api.post(
                `/enrollment/${enrollmentId}/complete-lesson`,
                { lessonId }
            );

            // Clear cache for this enrollment
            this.cache.delete(enrollmentId);

            console.log(`✅ [ProgressService] Lesson completion successful`);
            return response.data;
        } catch (error) {
            console.error(
                `❌ [ProgressService] Error completing lesson ${lessonId} for enrollment ${enrollmentId}:`,
                error
            );

            if (error.response?.status === 404) {
                throw new Error("Enrollment or lesson not found");
            } else if (error.response?.status === 400) {
                throw new Error("Lesson already completed");
            }

            throw error;
        }
    }

    async getEnrollmentProgress(enrollmentId, forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && this.cache.has(enrollmentId)) {
            console.log(
                `📦 [ProgressService] Using cached progress for enrollment ${enrollmentId}`
            );
            return this.cache.get(enrollmentId);
        }

        try {
            console.log(
                `🔄 [ProgressService] Fetching progress for enrollment ${enrollmentId}`
            );
            const response = await api.get(`/enrollment/${enrollmentId}`);
            this.cache.set(enrollmentId, response.data);
            return response.data;
        } catch (error) {
            console.error(
                `❌ [ProgressService] Error fetching progress for enrollment ${enrollmentId}:`,
                error
            );

            if (error.response?.status === 404) {
                throw new Error("Enrollment not found");
            }

            throw error;
        }
    }

    // Clear cache when needed
    clearCache(enrollmentId = null) {
        if (enrollmentId) {
            console.log(
                `🗑️ [ProgressService] Clearing cache for enrollment ${enrollmentId}`
            );
            this.cache.delete(enrollmentId);
        } else {
            console.log(`🗑️ [ProgressService] Clearing all cache`);
            this.cache.clear();
        }
    }

    // Get progress statistics
    calculateProgressStats(completedLessons = [], totalLessons = 0) {
        const completedCount = completedLessons.length;
        const progressPercentage =
            totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;

        return {
            completed: completedCount,
            total: totalLessons,
            percentage: progressPercentage,
            remaining: totalLessons - completedCount,
        };
    }
}

// Export as singleton
export const progressService = new ProgressService();

// Legacy functions for backward compatibility
export const completeLesson =
    progressService.completeLesson.bind(progressService);
export const getCourseProgress =
    progressService.getEnrollmentProgress.bind(progressService);

export const updateLastAccessed = async (enrollmentId, lessonId) => {
    try {
        const response = await api.post("/progress/update-access", {
            enrollmentId,
            lessonId,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error updating last accessed lesson ${lessonId} for enrollment ${enrollmentId}:`,
            error
        );

        if (error.response?.status === 404) {
            throw new Error("Active enrollment or lesson not found");
        }

        throw error;
    }
};

export const bulkCompleteLessons = async (enrollmentId, lessonIds) => {
    try {
        const response = await api.post("/progress/bulk-complete", {
            enrollmentId,
            lessonIds,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error bulk completing lessons for enrollment ${enrollmentId}:`,
            error
        );

        if (error.response?.status === 404) {
            throw new Error("Active enrollment not found");
        }

        throw error;
    }
};
