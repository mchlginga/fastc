// Handles all user-related API calls for admin management

import { api } from "./api";

// get all users
export const getUsers = async () => {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch (error) {
        console.error(
            "Get users error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// get single user bt id
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(
            "Get user by ID error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// get pending profile approvals
export const getPendingProfiles = async () => {
    try {
        const response = await api.get("/user/profile-review");
        return response.data;
    } catch (error) {
        console.error(
            "Get pending profiles error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// create new user
export const createUser = async (userData) => {
    try {
        const response = await api.post("/user", userData);
        return response.data;
    } catch (error) {
        console.error(
            "Create user error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// update user by id
export const updateUser = async (userId, updateData) => {
    try {
        const response = await api.patch(`/user/${userId}`, updateData);
        return response.data;
    } catch (error) {
        console.error(
            "Update user error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// review user profile
export const reviewProfile = async (userId, status) => {
    try {
        const response = await api.patch(`/user/${userId}/review`, {
            profileStatus: status,
        });
        return response.data;
    } catch (error) {
        console.error(
            "Review profile error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// delete user by id
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(
            "Delete user error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// update certificate by index
export const updateCertificate = async (userId, certIndex, updateData) => {
    try {
        const response = await api.patch(
            `/user/${userId}/certificates/${certIndex}`,
            updateData
        );
        return response.data;
    } catch (error) {
        console.error(
            "Update certificate error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// add skill from certificate
export const addSkillFromCertificate = async (userId, certIndex) => {
    try {
        const response = await api.post(
            `/user/${userId}/certificates/${certIndex}/add-skill`
        );
        return response.data;
    } catch (error) {
        console.error(
            "Add skill from cert error:",
            error.response?.data || error.message
        );
        throw error;
    }
};
