// Helper function to get full profile picture URL
export const getProfilePicUrl = (profilePicPath) => {
    if (!profilePicPath) return null;

    if (profilePicPath.startsWith("http")) return profilePicPath;

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    if (profilePicPath.startsWith("/uploads/")) {
        return `${backendUrl}${profilePicPath}`;
    }

    return `${backendUrl}/uploads/profiles/${profilePicPath}`;
};
