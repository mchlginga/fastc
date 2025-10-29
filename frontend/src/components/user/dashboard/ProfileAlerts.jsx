import { Link } from "react-router-dom";

function ProfileAlerts({ user }) {
    if (!user) return null;

    if (user.profileStatus === "pending") {
        return (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <p className="text-sm">
                    Your profile is under review. You cannot enroll in courses
                    until approved.
                </p>
            </div>
        );
    }

    if (user.profileStatus === "rejected") {
        return (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <p className="text-sm">
                    Your profile needs attention. Please update your
                    information.
                    <Link
                        to="/user/profile"
                        className="text-blue-600 hover:text-blue-800 font-medium ml-2"
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
