import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
    requireProfileSetup = false, // Force profile completion
    redirectTo = "/login",
}) {
    const { user, loading, needsProfileSetup } = useAuth();

    // Show nothing while loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to appropriate profile setup
    if (requireProfileSetup && needsProfileSetup(user)) {
        const setupPath =
            user.role === "company"
                ? "/company-profile-setup"
                : "/profile-setup";
        return <Navigate to={setupPath} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}
