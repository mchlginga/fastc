import { api } from "./api";

// Cache for job matches
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (params = {}) => {
    return JSON.stringify(params);
};

const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < CACHE_DURATION;
};

// Get job matches with optional filters
export const getJobMatches = async (params = {}) => {
    try {
        const cacheKey = getCacheKey(params);
        const cached = cache.get(cacheKey);

        if (cached && isCacheValid(cached.timestamp)) {
            console.log("📦 Serving from cache");
            return cached.data;
        }

        console.log("🚀 Fetching fresh data");
        const response = await api.get("/match/matches", { params });

        // Cache the response
        cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
        });

        return response.data;
    } catch (error) {
        console.error("Get job matches error:", error);
        throw error;
    }
};

// Clear cache when needed
export const clearJobMatchesCache = () => {
    cache.clear();
};

// Get matching statistics
export const getMatchingStats = async () => {
    try {
        const response = await api.get("/match/stats");
        return response.data;
    } catch (error) {
        console.error("Get matching stats error:", error);
        throw error;
    }
};

// Enhanced CSV export logging
export const logCsvExport = async (exportData) => {
    try {
        const response = await api.post("/match/log-export", exportData);
        return response.data;
    } catch (error) {
        console.error("Log CSV export error:", error);
        throw error;
    }
};

// For company role (similar functionality)
export const companyMatchService = {
    getTrainees: async (params = {}) => {
        try {
            const response = await api.get("/match/matches", { params });
            return response.data;
        } catch (error) {
            console.error("Get trainees for company error:", error);
            throw error;
        }
    },

    exportTrainees: async (filters = {}) => {
        try {
            const response = await api.get("/match/matches", {
                params: filters,
            });
            return response.data;
        } catch (error) {
            console.error("Export trainees error:", error);
            throw error;
        }
    },
};
