import { Link } from "react-router-dom";

function ProfileAlerts({ user }) {
    if (!user) return null;

    if (user.profileStatus === "pending") {
        return (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">
                    Your profile is under review. You cannot enroll in courses
                    until approved.
                </p>
            </div>
        );
    }

    if (user.profileStatus === "rejected") {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">
                    Your profile needs attention. Please update your
                    information.
                    <Link
                        to="/user/profile"
                        className="text-blue-600 hover:text-blue-800 font-medium ml-2 transition-colors duration-200 cursor-pointer"
                    >
                        Update Profile
                    </Link>
                </p>
            </div>
        );
    }

    return null;
}

export default ProfileAlerts;
