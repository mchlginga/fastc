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
    companyName,
    email,
    password,
    role,
    privacyAgreement,
}) => {
    const { data } = await api.post("/auth/register", {
        firstName,
        surname,
        companyName,
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

export const getCertificates = async (userId) => {
    try {
        const { data } = await api.get(`/certificates?user=${userId}`);
        console.log("getCertificates response:", data);
        return data.certificates;
    } catch (error) {
        console.error(
            "getCertificates error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch certificates."
        );
    }
};

export const downloadCertificate = async (certificateId) => {
    try {
        console.log(
            `Fetching certificate: /certificates/download/${certificateId}`
        );
        const response = await api.get(
            `/certificates/download/${certificateId}`,
            {
                responseType: "blob",
            }
        );
        return response.data;
    } catch (error) {
        console.error(
            `downloadCertificate error: ${
                error.response?.data?.message || error.message
            }`
        );
        throw new Error(
            error.response?.data?.message || "Failed to download certificate."
        );
    }
};

export const generateCertificate = async (courseId) => {
    const url = `/certificates?courseId=${encodeURIComponent(courseId)}`;
    const response = await api.get(url, { responseType: "blob" });
    return response.data;
};

export const getCompletions = async (userId, isAdmin = false) => {
    try {
        const url = isAdmin ? "/completion" : `/completion?user=${userId}`;
        const { data } = await api.get(url);
        console.log("getCompletions response:", data);
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

export const createCompletions = async (courseId, userId, endDate) => {
    try {
        console.log("createCompletions request:", {
            courseId,
            userId: userId,
            endDate,
        });
        const response = await api.post("/completion", {
            courseId,
            userId,
            endDate,
        });
        console.log("createCompletions response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "createCompletions error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to create completion."
        );
    }
};

export const getCourseById = async (courseId) => {
    try {
        const { data } = await api.get(`/courses/${courseId}`);
        console.log("getCourseById response:", data);
        return data;
    } catch (error) {
        console.error(
            "getCourseById error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch course details."
        );
    }
};

export const getCourses = async () => {
    try {
        const { data } = await api.get("/courses");
        console.log("getCourses response:", data);
        return data;
    } catch (error) {
        console.error(
            "getCourses error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch courses."
        );
    }
};

export const completeLesson = async (courseId, lessonId, userId) => {
    try {
        console.log("completeLesson request:", { courseId, lessonId, userId });
        const response = await api.post("/completion/complete", {
            courseId,
            lessonId,
            userId,
        });
        console.log("completeLesson response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "completeLesson error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to complete lesson."
        );
    }
};

export const markAttendance = async (courseId, lessonId, userId) => {
    try {
        console.log("markAttendance request:", { courseId, lessonId, userId });
        const response = await api.post("/completion/attendance", {
            courseId,
            lessonId,
            userId,
        });
        console.log("markAttendance response:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "markAttendance error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to mark attendance."
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
    position,
    idProof,
    industryType,
    businessPermit,
    representative,
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
        if (position) formData.append("position", position);
        if (idProof) formData.append("idProof", idProof);
        if (industryType) formData.append("industryType", industryType);
        if (businessPermit) formData.append("businessPermit", businessPermit);
        if (representative)
            formData.append("representative", JSON.stringify(representative));
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

export const uploadProfilePic = async (file) => {
    try {
        const formData = new FormData();
        formData.append("profilePic", file);

        const { data } = await api.post(
            "/upload/upload-profile-pic",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        console.log("uploadProfilePic response:", data);
        return data;
    } catch (error) {
        console.error(
            "uploadProfilePic error:",
            error.response?.data?.message || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to upload profile picture."
        );
    }
};

export const getTotalTrainees = async () => {
    try {
        const { data } = await api.get("/completion/total-trainees");
        return data.count;
    } catch (error) {
        console.error(
            "getTotalTrainees error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch total trainees."
        );
    }
};

export const getActiveCoursesCount = async () => {
    try {
        const { data } = await api.get("/courses/active/count");
        return data.count;
    } catch (error) {
        console.error(
            "getActiveCoursesCount error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message ||
                "Failed to fetch active courses count."
        );
    }
};

export const getActiveCourses = async () => {
    try {
        const { data } = await api.get("/courses/active");
        return data;
    } catch (error) {
        console.error(
            "getActiveCourses error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch active courses."
        );
    }
};

export const getPendingEnrollments = async () => {
    try {
        const { data } = await api.get("/user/profile-review");
        return data.length;
    } catch (error) {
        console.error(
            "getPendingEnrollments error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message ||
                "Failed to fetch pending enrollments."
        );
    }
};

export const getOnlineUsers = async () => {
    try {
        const { data } = await api.get("/user/online");
        return data;
    } catch (error) {
        console.error(
            "getOnlineUsers error:",
            error.response?.status,
            error.response?.data,
            error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to fetch online users."
        );
    }
};

export const updateLastActive = async () => {
    try {
        const { data } = await api.patch("/user/last-active");
        return data;
    } catch (error) {
        console.error(
            "updateLastActive error:",
            error.response?.data || error.message
        );
        throw new Error(
            error.response?.data?.message || "Failed to update last active."
        );
    }
};
