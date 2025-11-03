import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile, changePassword } from "../../services/userService";
import { Settings, Save, Briefcase, Lock, Key, Shield } from "react-feather";

import { ToastNotification } from "../../components/common";

const CompanySettings = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        contactNumber: "",
        address: "",
        representative: {
            name: "",
            email: "",
            contactNumber: "",
        },
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
                companyName: user?.companyName || "",
                email: user?.email || "",
                contactNumber: user?.contactNumber || "",
                address: user?.address || "",
                representative: {
                    name: user?.representative?.name || "",
                    email: user?.representative?.email || "",
                    contactNumber: user?.representative?.contactNumber || "",
                },
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
                    message: "Company profile updated successfully!",
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
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePasswordDataChange = (e) => {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const tabs = [
        { id: "profile", label: "Company Profile", icon: Briefcase },
        { id: "security", label: "Security", icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        <Settings size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Company Settings
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage your company account preferences and settings
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
                        {/* Company Profile Settings */}
                        {activeTab === "profile" && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-6">
                                    {/* Company Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                            <Briefcase
                                                size={16}
                                                className="mr-2"
                                            />
                                            Company Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                    Company Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                    required
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                    readOnly
                                                />
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Contact support to change
                                                    your email.
                                                </p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    value={
                                                        formData.contactNumber
                                                    }
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
                                    </div>

                                    {/* Representative Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                                            <Briefcase
                                                size={16}
                                                className="mr-2"
                                            />
                                            Representative Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                    Representative Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="representative.name"
                                                    value={
                                                        formData.representative
                                                            .name
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                    Representative Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="representative.email"
                                                    value={
                                                        formData.representative
                                                            .email
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                    Representative Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="representative.contactNumber"
                                                    value={
                                                        formData.representative
                                                            .contactNumber
                                                    }
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text"
                                                />
                                            </div>
                                        </div>
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

                                {/* Account Security */}
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Company Role Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start">
                        <Briefcase
                            className="text-blue-600 mr-3 mt-1"
                            size={20}
                        />
                        <div>
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Company Account
                            </h3>
                            <p className="text-blue-700 text-sm">
                                You are logged in as a{" "}
                                <span className="font-medium capitalize">
                                    {user?.role}
                                </span>
                                . This account provides access to talent
                                discovery and matching features for your
                                company.
                                {user?.profileStatus === "pending" && (
                                    <span className="block mt-2 font-medium">
                                        Your account is currently under review.
                                        Some features may be limited until
                                        approval.
                                    </span>
                                )}
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

export default CompanySettings;
