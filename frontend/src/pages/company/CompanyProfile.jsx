import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    MapPin,
    Phone,
    Award,
    Key,
    Bell,
    Trash2,
    Upload,
    Save,
} from "react-feather";

const CompanyProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("company");
    const [companyInfo, setCompanyInfo] = useState({
        companyName: user?.companyName || "Juan Construction",
        email: user?.email || "juanconstruction@gmail.com",
        phone: user?.phone || "",
        address: user?.address || "San Fernando, Pampanga",
        industry: user?.industry || "Construction",
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

    const handleCompanyInfoChange = (e) => {
        setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
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

    const validateCompanyInfo = () => {
        const newErrors = {};
        if (!companyInfo.companyName.trim())
            newErrors.companyName = "Company name is required";
        if (!companyInfo.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(companyInfo.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!companyInfo.address.trim())
            newErrors.address = "Address is required";
        if (!companyInfo.industry.trim())
            newErrors.industry = "Industry is required";
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

    const handleSaveCompanyInfo = () => {
        if (validateCompanyInfo()) {
            console.log("Saving company info:", companyInfo, profilePicture);
            // Placeholder for API call (e.g., PATCH /company-profile)
            setSubmitMessage("Company info updated successfully!");
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
                    Company Profile
                </h1>
                <p className="text-gray-600">
                    Manage your company information and account settings
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "company" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("company")}
                    >
                        Company Info
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "certificates" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("certificates")}
                    >
                        Certificates
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
                className={activeTab === "company" ? "" : "hidden"}
                id="company"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Company Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={companyInfo.companyName}
                                onChange={handleCompanyInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.companyName ? "border-red-500" : ""
                                }`}
                            />
                            {errors.companyName && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.companyName}
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
                                value={companyInfo.email}
                                onChange={handleCompanyInfoChange}
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
                                value={companyInfo.phone}
                                onChange={handleCompanyInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={companyInfo.address}
                                onChange={handleCompanyInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.address ? "border-red-500" : ""
                                }`}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <select
                                name="industry"
                                value={companyInfo.industry}
                                onChange={handleCompanyInfoChange}
                                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.industry ? "border-red-500" : ""
                                }`}
                            >
                                <option value="Construction">
                                    Construction
                                </option>
                                <option value="Manufacturing">
                                    Manufacturing
                                </option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Education">Education</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.industry && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.industry}
                                </p>
                            )}
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
                        {submitMessage && activeTab === "company" && (
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
                            onClick={handleSaveCompanyInfo}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
                        >
                            <Save size={16} className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "certificates" ? "" : "hidden"}
                id="certificates"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Company Certificates
                        </h2>
                        <NavLink
                            to="/admin/certificates/upload"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <Upload size={16} className="mr-1" />
                            Upload New Certificate
                        </NavLink>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    Business Permit
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Active
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    Expires: December 31, 2025
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    TESDA Accreditation
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Active
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    Expires: June 30, 2026
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-gray-200 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-600">
                                    DTI Registration
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Expired
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                    Expired: January 15, 2024
                                </p>
                            </div>
                        </div>
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
                                Permanently delete your company account and all
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

export default CompanyProfile;
