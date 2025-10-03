import { api } from "./api";

export const generateCertificate = async (courseId) => {
    const url = `/certificate?courseId=${encodeURIComponent(courseId)}`;
    const response = await api.get(url, { responseType: "blob" });
    return response.data;
};

export const getCompletions = async (userId, isAdmin = false) => {
    try {
        const url = isAdmin ? "/completion" : `/completion?user=${userId}`;
        const { data } = await api.get(url);
        console.log("getCompletions response:", data); // Debug log
        return data.courses;
    } catch (error) {
        console.error(
            "getCompletions error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch completions."
        );
    }
};
