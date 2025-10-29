import { createContext, useState, useEffect, useContext } from "react";
import { getMe, logout } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Check if we have a token (either in cookie via withCredentials or localStorage)
            const hasToken =
                localStorage.getItem("token") ||
                document.cookie.includes("token");

            if (!hasToken) {
                setLoading(false);
                return;
            }

            const userData = await getMe();
            setUser(userData);
        } catch (error) {
            console.error("AuthContext getMe failed:", error.message);
            // Clear invalid token
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error.message);
            // Still clear user state even if logout request fails
            setUser(null);
        }
    };

    // Enhanced setUser that can handle token storage
    const updateUser = (userData, token = null) => {
        if (token) {
            localStorage.setItem("token", token);
        }
        setUser(userData);
    };

    // Check if profile needs setup
    const needsProfileSetup = (user) => {
        if (!user) return false;

        if (user.role === "user") {
            return (
                !user.birthdate ||
                !user.gender ||
                !user.contactNumber ||
                !user.address
            );
        }

        if (user.role === "company") {
            return (
                !user.address ||
                !user.contactNumber ||
                !user.businessPermit ||
                !user.representative?.name ||
                !user.representative?.email
            );
        }

        return false;
    };

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                handleLogout,
                setUser: updateUser,
                needsProfileSetup,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
