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

        // 🆕 ADD: Logging for debugging
        console.log(
            `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        console.log(
            `✅ API Response: ${response.status} ${response.config.url}`
        );
        return response;
    },
    (error) => {
        console.error(
            `❌ API Error: ${error.response?.status} ${error.config?.url}`,
            error.response?.data
        );

        if (error.response?.status === 401) {
            // Clear any stored tokens and redirect to login
            localStorage.removeItem("token");
            // Only redirect if we're not already on login page
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
