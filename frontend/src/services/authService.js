import { api } from "./api";

export const login = async (email, password, rememberMe = false) => {
    try {
        const { data } = await api.post("/auth/login", {
            email,
            password,
            rememberMe,
        });
        if (!data.publicUser) {
            throw new Error("Unexpected response format from server.");
        }
        return data.publicUser;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                "Login failed. Please check your credentials."
        );
    }
};

export const register = async ({
    firstName,
    surname,
    email,
    password,
    privacyAgreement,
}) => {
    const { data } = await api.post("/auth/register", {
        firstName,
        surname,
        email,
        password,
        privacyAgreement,
    });

    return data.publicUser;
};

export const registerUser = async ({
    firstName,
    surname,
    email,
    password,
    role,
    privacyAgreement,
}) => {
    const { data } = await api.post("/user", {
        firstName,
        surname,
        email,
        password,
        role,
        privacyAgreement,
    });
    return data.publicUser;
};

export const getMe = async () => {
    const { data } = await api.get("/auth/me");
    return data.user;
};

export const logout = async () => {
    await api.post("/auth/logout");
};

export const requestPasswordReset = async (email) => {
    const { data } = await api.post("/auth/request-password-reset", { email });
    return data;
};

export const resetPassword = async ({ token, newPassword }) => {
    const { data } = await api.post("/auth/reset-password", {
        token,
        newPassword,
    });
    return data;
};

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
        return data;
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

export const verifyEmail = async (email, code) => {
    const { data } = await api.post("/auth/verify-code", { email, code });
    return data.publicUser;
};

export const resendVerificationCode = async (email) => {
    try {
        const { data } = await api.post("/auth/send-verification-code", {
            email,
        });
        return data;
    } catch (error) {
        console.error(
            "Resend verification code error:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const checkUsername = async (username) => {
    try {
        const { data } = await api.post("/auth/check-username", { username });
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to check username."
        );
    }
};

export const updateProfile = async ({
    username,
    birthdate,
    gender,
    contactNumber,
    address,
    education,
    certificates,
    proofs,
    profileStatus,
}) => {
    try {
        const formData = new FormData();
        if (username) formData.append("username", username);
        if (birthdate) formData.append("birthdate", birthdate);
        if (gender) formData.append("gender", gender);
        if (contactNumber) formData.append("contactNumber", contactNumber);
        if (address) formData.append("address", address);
        if (education) formData.append("education", JSON.stringify(education));
        if (certificates)
            formData.append("certificates", JSON.stringify(certificates));
        if (proofs && proofs.length) {
            proofs.forEach((proof) => formData.append("proofs", proof));
        }
        if (profileStatus !== undefined)
            formData.append("profileStatus", profileStatus);

        const { data } = await api.patch("/user/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to update profile."
        );
    }
};
