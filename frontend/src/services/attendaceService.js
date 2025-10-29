import { api } from "./api";

export const verifyAttendance = async (courseId, lessonId, imageData) => {
    try {
        const response = await api.post("/attendance/verify", {
            courseId,
            lessonId,
            imageData,
        });
        return response.data;
    } catch (error) {
        console.error("Attendance verification error:", error);
        throw error;
    }
};

export const markAttendance = async (courseId, lessonId) => {
    try {
        const response = await api.post("/attendance/mark", {
            courseId,
            lessonId,
        });
        return response.data;
    } catch (error) {
        console.error("Mark attendance error:", error);
        throw error;
    }
};
