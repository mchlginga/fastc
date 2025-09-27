import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    MapPin,
    Phone,
    Key,
    Bell,
    Trash2,
    Upload,
    Save,
    Shield,
} from "react-feather";

const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("personal");
    const [personalInfo, setPersonalInfo] = useState({
        firstName: user?.firstName || "Juan",
        surname: user?.surname || "Dela Cruz",
        email: user?.email || "juan.admin@fastc.com",
        phone: user?.phone || "",
        city: user?.city || "San Fernando",
        country: user?.country || "Philippines",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
    });
    const [errors, setErrors] = useState({});
    const [submitMessage, setSubmitMessage] = useState("");

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setSubmitMessage("");
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
        setSubmitMessage("");
    };

    const handleNotificationChange = (e) => {
        setNotifications({
            ...notifications,
            [e.target.name]: e.target.checked,
        });
        setSubmitMessage("");
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
        setSubmitMessage("");
    };

    const validatePersonalInfo = () => {
        const newErrors = {};
        if (!personalInfo.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!personalInfo.surname.trim())
            newErrors.surname = "Surname is required";
        if (!personalInfo.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!personalInfo.city.trim()) newErrors.city = "City is required";
        if (!personalInfo.country.trim())
            newErrors.country = "Country is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!password.current.trim())
            newErrors.current = "Current password is required";
        if (!password.new.trim()) newErrors.new = "New password is required";
        if (password.new.length < 8)
            newErrors.new = "New password must be at least 8 characters";
        if (password.new !== password.confirm)
            newErrors.confirm = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSavePersonalInfo = () => {
        if (validatePersonalInfo()) {
            console.log("Saving personal info:", personalInfo, profilePicture);
            // Placeholder for API call (e.g., PATCH /admin-profile)
            setSubmitMessage("Personal info updated successfully!");
            setTimeout(() => setSubmitMessage(""), 3000);
        } else {
            setSubmitMessage("Please fix the errors in the form.");
        }
    };

    const handleChangePassword = () => {
        if (validatePassword()) {
            console.log("Changing password:", password);
            // Placeholder for API call (e.g., PATCH /password)
            setSubmitMessage("Password changed successfully!");
            setTimeout(() => setSubmitMessage(""), 3000);
        } else {
            setSubmitMessage("Please fix the errors in the form.");
        }
    };

    const handleSaveNotifications = () => {
        console.log("Saving notifications:", notifications);
        // Placeholder for API call (e.g., PATCH /notification-preferences)
        setSubmitMessage("Notification preferences updated successfully!");
        setTimeout(() => setSubmitMessage(""), 3000);
    };

    const handleDeleteAccount = () => {
        console.log("Deleting account");
        // Placeholder for API call (e.g., DELETE /account)
        setSubmitMessage(
            "Account deletion requested. Please confirm with admin."
        );
        setTimeout(() => setSubmitMessage(""), 3000);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Admin Profile
                </h1>
                <p className="text-gray-600">
                    Manage your personal information and admin settings
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "personal" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("personal")}
                    >
                        Personal Info
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "permissions" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("permissions")}
                    >
                        Permissions
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "settings" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Account Settings
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div
                className={activeTab === "personal" ? "" : "hidden"}
                id="personal"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Personal Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={personalInfo.firstName}
                                onChange={handlePersonalInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.firstName ? "border-red-500" : ""
                                }`}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Surname
                            </label>
                            <input
                                type="text"
                                name="surname"
                                value={personalInfo.surname}
                                onChange={handlePersonalInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.surname ? "border-red-500" : ""
                                }`}
                            />
                            {errors.surname && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.surname}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={personalInfo.email}
                                onChange={handlePersonalInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.email ? "border-red-500" : ""
                                }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone (optional)
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={personalInfo.phone}
                                onChange={handlePersonalInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.png"
                                onChange={handleProfilePictureChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {submitMessage && activeTab === "personal" && (
                            <p
                                className={`text-sm ${
                                    submitMessage.includes("successfully")
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {submitMessage}
                            </p>
                        )}
                        <button
                            onClick={handleSavePersonalInfo}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "permissions" ? "" : "hidden"}
                id="permissions"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Admin Permissions
                    </h2>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Your current admin permissions for managing the
                            FAST-C platform.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Shield
                                    size={16}
                                    className="text-blue-600 mr-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Manage Users
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Shield
                                    size={16}
                                    className="text-blue-600 mr-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Manage Courses
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Shield
                                    size={16}
                                    className="text-blue-600 mr-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Manage Certificates
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Shield
                                    size={16}
                                    className="text-blue-600 mr-2"
                                />
                                <span className="text-sm text-gray-700">
                                    Manage Job Matching
                                </span>
                            </div>
                        </div>
                        {/*                         <p className="text-sm text-gray-600">
                            Contact the system administrator to modify
                            permissions.
                        </p> */}
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "settings" ? "" : "hidden"}
                id="settings"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Account Settings
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Change Password
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="current"
                                        value={password.current}
                                        onChange={handlePasswordChange}
                                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.current
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {errors.current && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.current}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="new"
                                        value={password.new}
                                        onChange={handlePasswordChange}
                                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.new ? "border-red-500" : ""
                                        }`}
                                    />
                                    {errors.new && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.new}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirm"
                                        value={password.confirm}
                                        onChange={handlePasswordChange}
                                        className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.confirm
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    {errors.confirm && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.confirm}
                                        </p>
                                    )}
                                </div>
                                {submitMessage && activeTab === "settings" && (
                                    <p
                                        className={`text-sm ${
                                            submitMessage.includes(
                                                "successfully"
                                            )
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {submitMessage}
                                    </p>
                                )}
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <Key size={16} className="mr-2" />
                                    Change Password
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="email"
                                        checked={notifications.email}
                                        onChange={handleNotificationChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Receive notifications via Email
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="sms"
                                        checked={notifications.sms}
                                        onChange={handleNotificationChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Receive notifications via SMS
                                    </label>
                                </div>
                                {submitMessage && activeTab === "settings" && (
                                    <p
                                        className={`text-sm ${
                                            submitMessage.includes(
                                                "successfully"
                                            )
                                                ? "text-green-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {submitMessage}
                                    </p>
                                )}
                                <button
                                    onClick={handleSaveNotifications}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <Bell size={16} className="mr-2" />
                                    Save Notification Preferences
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Delete Account
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Permanently delete your admin account and all
                                associated data. This action cannot be undone.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center justify-center"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
