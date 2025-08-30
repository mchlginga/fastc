import { createContext, useState, useEffect } from "react";

import { getMe, logout } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        (async () => {

            try {
                const u = await getMe();
                setUser(u);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{ user, loading, handleLogout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};