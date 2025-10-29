import { api } from "./api";

export const getCourses = async () => {
    try {
        const response = await api.get("/courses");
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch courses"
        );
    }
};

export const getCourseById = async (id) => {
    try {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching course with ID ${id}:`, error);

        if (error.response?.status === 404) {
            throw new Error("Course not found");
        }

        throw new Error(
            error.response?.data?.message || "Failed to fetch course details"
        );
    }
};

export const getActiveCourses = async () => {
    try {
        const response = await api.get("/courses/active");
        return response.data;
    } catch (error) {
        console.error("Error fetching active courses:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch active courses"
        );
    }
};

export const getActiveCoursesCount = async () => {
    try {
        const response = await api.get("/courses/active/count");
        return response.data;
    } catch (error) {
        console.error("Error fetching active courses count:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch courses count"
        );
    }
};
