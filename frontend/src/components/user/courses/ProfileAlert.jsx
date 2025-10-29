function ProfileAlert({ user }) {
    if (user?.profileStatus === "pending") {
        return (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <p className="text-sm">
                    Your profile is under review. You cannot enroll in courses
                    until approved.
                </p>
            </div>
        );
    }

    return null;
}

export default ProfileAlert;
