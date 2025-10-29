import { api } from "./api";

export const enrollInCourse = async (courseId) => {
    try {
        const response = await api.post("/enrollment/enroll", { courseId });
        return response.data;
    } catch (error) {
        console.error(`Error enrolling in course ${courseId}:`, error);

        // Handle specific error cases that frontend might need
        if (error.response?.status === 400) {
            throw new Error(
                error.response.data.message || "Already enrolled in this course"
            );
        } else if (error.response?.status === 404) {
            throw new Error("Course not found or not available");
        }

        throw error;
    }
};

export const getUserEnrollments = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get("/enrollment/my-enrollments", {
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user enrollments:", error);
        throw error;
    }
};

export const getEnrollmentDetails = async (enrollmentId) => {
    try {
        const response = await api.get(`/enrollment/${enrollmentId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching enrollment details ${enrollmentId}:`,
            error
        );

        if (error.response?.status === 404) {
            throw new Error("Enrollment not found");
        }

        throw error;
    }
};

export const cancelEnrollment = async (enrollmentId) => {
    try {
        const response = await api.patch(`/enrollment/${enrollmentId}/cancel`);
        return response.data;
    } catch (error) {
        console.error(`Error cancelling enrollment ${enrollmentId}:`, error);

        if (error.response?.status === 404) {
            throw new Error(
                error.response.data.message || "Enrollment not found"
            );
        }

        throw error;
    }
};

export const completeLesson = async (enrollmentId, lessonId) => {
    try {
        console.log(
            `🔄 Completing lesson ${lessonId} for enrollment ${enrollmentId}`
        );
        const response = await api.post(
            `/enrollment/${enrollmentId}/complete-lesson`,
            {
                lessonId,
            }
        );
        console.log(`✅ Lesson completion response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error completing lesson ${lessonId} for enrollment ${enrollmentId}:`,
            error
        );

        if (error.response?.status === 404) {
            throw new Error("Enrollment or lesson not found");
        } else if (error.response?.status === 400) {
            throw new Error("Lesson already completed");
        }

        throw error;
    }
};
