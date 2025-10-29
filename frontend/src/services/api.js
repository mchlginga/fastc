import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://fastc.onrender.com/api",
    withCredentials: true,
});

// Add request interceptor to handle tokens
api.interceptors.request.use(
    (config) => {
        // If we have a token in localStorage, use it as fallback
        const token = localStorage.getItem("token");
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear any stored tokens and redirect to login
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
