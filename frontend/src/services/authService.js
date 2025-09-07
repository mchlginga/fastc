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