import { api } from "./api";

export const login = async (email, password, rememberMe = false) => {
    try {
        const { data } = await api.post("/auth/login", {
            email,
            password,
            rememberMe,
        });
        return data.publicUser;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed.");
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
    username,
    firstName,
    surname,
    email,
    password,
    city,
    country,
    role,
    privacyAgreement,
}) => {
    const { data } = await api.post("/user", {
        username,
        firstName,
        surname,
        email,
        password,
        city,
        country,
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
    const url = courseId
        ? `/certificate?courseId=${encodeURIComponent(courseId)}`
        : "/certificate";
    const response = await api.get(url, {
        responseType: "blob",
    });

    return response.data;
};

export const getCompletions = async (userId, isAdmin = false) => {
    const url = isAdmin ? "/completion" : `/completion?user=${userId}`;
    const { data } = await api.get(url);

    return data;
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
        throw error; // Rethrow to let handleSubmit catch it
    }
};
