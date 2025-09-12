import { api } from "./api";

export const login = async(email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    return data;
};

export const register = async({ username, firstName, surname, email, password, city, country, privacyAgreement }) => {
    const { data } = await api.post("/auth/register", {
        username,
        firstName,
        surname,
        email,
        password,
        city,
        country,
        privacyAgreement
    });

    return data;
};

export const getMe = async() => {
    const { data } = await api.get("/auth/me");
    
    return data.user;
};

export const logout = async() => {
    await api.post("/auth/logout");
};

export const requestPasswordReset = async (email) => {
    const { data } = await api.post("/auth/request-password-reset", { email });

    return data;
};

export const resetPassword = async ({ token, newPassword }) => {
    const { data } = await api.post("/auth/reset-password", { token, newPassword });

    return data;
};

export const generateCertificate = async (certificateName = "") => {
    const url = certificateName ? `/certificate?certificateName=${encodeURIComponent(certificateName)}` : "/certificate";
    const response = await api.get(url, {
        responseType: "blob"
    })

    return response.data;
};