import { api } from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/statistics/dashboard");
    return response.data;
};

export const getOnlineUsers = async () => {
    const response = await api.get("/statistics/online-users");
    return response.data;
};

export const getRecentActivities = async () => {
    const response = await api.get("/statistics/recent-activities");
    return response.data;
};
