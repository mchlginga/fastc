import { api } from "./api";

export const getDashboardStats = async () => {
    try {
        const response = await api.get("/statistics/dashboard");
        return response.data.stats;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error(
            error.response?.data?.message ||
                "Failed to fetch dashboard statistics"
        );
    }
};

export const getRecentActivities = async () => {
    try {
        const response = await api.get("/statistics/activities");
        return response.data.activities;
    } catch (error) {
        console.error("Error fetching recent activities:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch recent activities"
        );
    }
};

export const getSystemOverview = async () => {
    try {
        const response = await api.get("/statistics/overview");
        return response.data.overview;
    } catch (error) {
        console.error("Error fetching system overview:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch system overview"
        );
    }
};

export const getOnlineUsers = async () => {
    try {
        const response = await api.get("/statistics/online-users");
        return response.data;
    } catch (error) {
        console.error("Error fetching online users:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch online users"
        );
    }
};

// Real-time statistics for dashboard updates
export const subscribeToStats = (callback) => {
    // For real-time updates, you can implement WebSocket or polling
    const interval = setInterval(async () => {
        try {
            const stats = await getDashboardStats();
            const onlineUsers = await getOnlineUsers();
            callback({ stats, onlineUsers: onlineUsers.onlineUsers });
        } catch (error) {
            console.error("Error in stats subscription:", error);
        }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
};
