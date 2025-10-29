import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile, changePassword } from "../../services/userService";
import { Settings, Save, User, Shield, Bell, Lock, Key } from "react-feather";

import { ToastNotification } from "../../components/common";

const AdminSettings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const [formData, setFormData] = useState({
        firstName: "",
        surname: "",
        email: "",
        contactNumber: "",
        address: "",
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        systemAlerts: true,
        weeklyReports: false,
        enrollmentNotifications: true,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user?.firstName || "",
                surname: user?.surname || "",
                email: user?.email || "",
                contactNumber: user?.contactNumber || "",
                address: user?.address || "",
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await updateUserProfile(formData);
            if (response.success) {
                setUser((prev) => ({ ...prev, ...formData }));
                setToast({
                    message: "Profile updated successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            setToast({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ message: "New passwords do not match", type: "error" });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setToast({
                message: "Password must be at least 6 characters",
                type: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.success) {
                setToast({
                    message: "Password changed successfully!",
                    type: "success",
                });
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            setToast({ message: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePasswordDataChange = (e) => {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePreferenceChange = (key) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "preferences", label: "Preferences", icon: Bell },
        { id: "security", label: "Security", icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Same as other admin pages */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        <Settings size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Admin Settings
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage your admin account preferences and settings
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        <Icon size={18} className="mr-2" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Profile Settings */}
                        {activeTab === "profile" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Surname
                                        </label>
                                        <input
                                            type="text"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    <Save size={18} className="mr-2" />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        )}

                        {/* Preferences */}
                        {activeTab === "preferences" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Notification Preferences
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(preferences).map(
                                        ([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800 capitalize">
                                                        {key
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .toLowerCase()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Receive notifications
                                                        for{" "}
                                                        {key
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .toLowerCase()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handlePreferenceChange(
                                                            key
                                                        )
                                                    }
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                                        value
                                                            ? "bg-blue-600"
                                                            : "bg-gray-200"
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                            value
                                                                ? "translate-x-6"
                                                                : "translate-x-1"
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                                        Save Preferences
                                    </button>
                                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                                        Reset to Default
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Security */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Security Settings
                                </h3>

                                {/* Change Password */}
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center mb-4">
                                        <Key
                                            size={20}
                                            className="text-blue-600 mr-3"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                Change Password
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Update your password regularly
                                                for security
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handlePasswordChange}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={
                                                    passwordData.currentPassword
                                                }
                                                onChange={
                                                    handlePasswordDataChange
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={
                                                    handlePasswordDataChange
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordDataChange
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                        >
                                            {loading
                                                ? "Updating..."
                                                : "Change Password"}
                                        </button>
                                    </form>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Shield
                                                size={20}
                                                className="text-green-600 mr-3"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    Two-Factor Authentication
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Add an extra layer of
                                                    security to your account
                                                </p>
                                            </div>
                                        </div>
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>

                                {/* Session Management */}
                                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-yellow-800">
                                                Active Sessions
                                            </p>
                                            <p className="text-sm text-yellow-600">
                                                Manage your active login
                                                sessions
                                            </p>
                                        </div>
                                        <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                                            View Sessions
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Role Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start">
                        <Shield className="text-blue-600 mr-3 mt-1" size={20} />
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Admin Account
                            </h3>
                            <p className="text-blue-700 text-sm">
                                You are logged in as a{" "}
                                <span className="font-medium capitalize">
                                    {user?.role}
                                </span>
                                . This account has full administrative
                                privileges to manage the training center system.
                            </p>
                        </div>
                    </div>
                </div>

                {toast && (
                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
