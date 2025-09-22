import { useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    MapPin,
    Phone,
    Calendar,
    Award,
    Key,
    Bell,
    Trash2,
    Upload,
} from "react-feather";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const [personalInfo, setPersonalInfo] = useState({
        fullName: "Juan Dela Cruz",
        email: "juandelacruz@email.com",
        phone: "63 912 345 6789",
        address: "San Fernando, Pampanga",
        birthdate: "1995-05-15",
        gender: "Male",
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [education, setEducation] = useState({
        attainment: "Bachelor's Degree",
        school: "Pampanga State University",
        course: "Information Technology",
        yearGraduated: "2017",
    });
    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
    });

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleEducationChange = (e) => {
        setEducation({ ...education, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e) => {
        setNotifications({
            ...notifications,
            [e.target.name]: e.target.checked,
        });
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSavePersonalInfo = () => {
        console.log("Saving personal info:", personalInfo, profilePicture);
        // Add API call to save personal info
    };

    const handleSaveEducation = () => {
        console.log("Saving education:", education);
        // Add API call to save education
    };

    const handleChangePassword = () => {
        console.log("Changing password:", password);
        // Add API call to change password
    };

    const handleSaveNotifications = () => {
        console.log("Saving notifications:", notifications);
        // Add API call to save notification preferences
    };

    const handleDeleteAccount = () => {
        console.log("Deleting account");
        // Add API call to delete/deactivate account
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                <p className="text-gray-600">
                    Manage your personal information and account settings
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
                            activeTab === "education" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("education")}
                    >
                        Educational Background
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
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={personalInfo.fullName}
                                onChange={handlePersonalInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
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
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
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
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={personalInfo.address}
                                onChange={handlePersonalInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                name="birthdate"
                                value={personalInfo.birthdate}
                                onChange={handlePersonalInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={personalInfo.gender}
                                onChange={handlePersonalInfoChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
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
                        <button
                            onClick={handleSavePersonalInfo}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "education" ? "" : "hidden"}
                id="education"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Educational Background
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Highest Educational Attainment
                            </label>
                            <input
                                type="text"
                                name="attainment"
                                value={education.attainment}
                                onChange={handleEducationChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                School/University
                            </label>
                            <input
                                type="text"
                                name="school"
                                value={education.school}
                                onChange={handleEducationChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course/Strand
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={education.course}
                                onChange={handleEducationChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Year Graduated
                            </label>
                            <input
                                type="number"
                                name="yearGraduated"
                                value={education.yearGraduated}
                                onChange={handleEducationChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleSaveEducation}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
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
                            Certificates
                        </h2>
                        <Link
                            to="/user/certificates"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <Upload size={16} className="mr-1" />
                            Upload New Certificate
                        </Link>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    Welding NC II
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Active
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    Expires: June 15, 2025
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    Dressmaking NC II
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Active
                                </p>
                                <p className="text-sm text-green-600 mt-1">
                                    Expires: March 10, 2025
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="bg-gray-200 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-600">
                                    Computer Systems Servicing NC II
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Status: Expired
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                    Expired: January 15, 2023
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
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
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
                                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleChangePassword}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
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
                                <button
                                    onClick={handleSaveNotifications}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                >
                                    Save Notification Preferences
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                Delete Account
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Permanently delete your account and all
                                associated data. This action cannot be undone.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                            >
                                <Trash2 size={16} className="inline mr-2" />
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
