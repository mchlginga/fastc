import { api } from "./api";

// Get job matches with optional filters
export const getJobMatches = async (params = {}) => {
    try {
        const response = await api.get("/match/matches", { params });
        return response.data;
    } catch (error) {
        console.error("Get job matches error:", error);
        throw error;
    }
};

// Log CSV export
export const logCsvExport = async (exportData) => {
    try {
        const response = await api.post("/match/log-export", exportData);
        return response.data;
    } catch (error) {
        console.error("Log CSV export error:", error);
        throw error;
    }
};
