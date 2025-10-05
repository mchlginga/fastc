import { useState, useEffect } from "react";
import {
    Settings,
    Upload,
    Trash2,
    Plus,
    X,
    AlertTriangle,
    Edit,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, getMe } from "../../services/authService";

function UserSettings() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        surname: "",
        email: "",
        birthdate: "",
        gender: "",
        contactNumber: "",
        address: "",
    });
    const [educations, setEducations] = useState([
        { id: Date.now(), level: "", school: "", year: "", file: null },
    ]);
    const [certificates, setCertificates] = useState([
        { id: Date.now(), name: "", issuer: "", date: "", file: null },
    ]);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                surname: user.surname || "",
                email: user.email || "",
                birthdate: user.birthdate || "",
                gender: user.gender || "",
                contactNumber: user.contactNumber || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrors((prev) => ({ ...prev, [id]: "" }));
    };

    const handleEducationChange = (id, field, value) => {
        setEducations((prev) =>
            prev.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        );
    };

    const handleCertificateChange = (id, field, value) => {
        setCertificates((prev) =>
            prev.map((cert) =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        );
    };

    const handleAddEducation = () => {
        setEducations((prev) => [
            ...prev,
            { id: Date.now(), level: "", school: "", year: "", file: null },
        ]);
    };

    const handleRemoveEducation = (id) => {
        if (educations.length > 1) {
            setEducations((prev) => prev.filter((edu) => edu.id !== id));
        }
    };

    const handleAddCertificate = () => {
        setCertificates((prev) => [
            ...prev,
            { id: Date.now(), name: "", issuer: "", date: "", file: null },
        ]);
    };

    const handleRemoveCertificate = (id) => {
        if (certificates.length > 1) {
            setCertificates((prev) => prev.filter((cert) => cert.id !== id));
        }
    };

    const handleProfilePicChange = () => {
        setMessage({
            type: "info",
            text: "Profile picture upload coming soon.",
        });
    };

    const handleRemoveProfilePic = () => {
        setMessage({
            type: "info",
            text: "Remove profile picture coming soon.",
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName)
            newErrors["firstName"] = "First name is required";
        if (!formData.surname) newErrors["surname"] = "Last name is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const updatedUser = await updateProfile({
                firstName: formData.firstName,
                surname: formData.surname,
                birthdate: formData.birthdate,
                gender: formData.gender,
                contactNumber: formData.contactNumber,
                address: formData.address,
            });
            setUser(updatedUser);
            setMessage({
                type: "success",
                text: "Profile updated successfully!",
            });
            // Refresh user data
            const refreshedUser = await getMe();
            setUser(refreshedUser);
            setTimeout(() => {
                window.location.reload(); // Force page refresh
            }, 1500);
        } catch (error) {
            setMessage({
                type: "error",
                text: error.message || "Failed to update profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Warning Message */}
            {user?.profileStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                    <p className="text-sm">
                        Your profile is under review. You cannot enroll in
                        courses until approved.
                        <span className="text-blue-600 hover:text-blue-800 font-medium ml-2 cursor-pointer">
                            Edit Profile
                        </span>
                    </p>
                </div>
            )}

            {/* Settings Header */}
            <section className="mb-10">
                <div className="flex items-center mb-2">
                    <Settings size={26} className="text-blue-600 mr-3" />
                    <h2 className="text-3xl font-bold text-gray-800">
                        Settings
                    </h2>
                </div>
                <p className="text-gray-600 text-lg">
                    Manage your account preferences and notification settings
                </p>
            </section>

            {/* Edit Profile Section */}
            <section className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Profile Information
                </h3>

                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                        <h4 className="font-medium text-gray-800">
                            Basic Information
                        </h4>
                        <p className="text-gray-600 text-sm">
                            Update your personal details
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="firstName"
                                >
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.firstName
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition`}
                                />
                                {errors.firstName && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="surname"
                                >
                                    Last Name
                                </label>
                                <input
                                    id="surname"
                                    type="text"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border ${
                                        errors.surname
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition`}
                                />
                                {errors.surname && (
                                    <p className="text-red-600 text-xs mt-1">
                                        {errors.surname}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                    readOnly
                                    title="Email cannot be changed."
                                />
                                <p className="text-gray-500 text-xs mt-1">
                                    Contact support to change your email.
                                </p>
                            </div>
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="birthdate"
                                >
                                    Birthdate
                                </label>
                                <input
                                    id="birthdate"
                                    type="date"
                                    value={formData.birthdate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="gender"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">
                                        Prefer not to say
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="contactNumber"
                                >
                                    Contact Number
                                </label>
                                <input
                                    id="contactNumber"
                                    type="tel"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    placeholder="+09212754390"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    className="block text-gray-600 text-sm font-medium mb-1"
                                    htmlFor="address"
                                >
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            {message && (
                                <div
                                    className={`border ${
                                        message.type === "success"
                                            ? "border-green-300 bg-green-50 text-green-700"
                                            : message.type === "info"
                                            ? "border-blue-300 bg-blue-50 text-blue-700"
                                            : "border-red-300 bg-red-50 text-red-700"
                                    } px-4 py-2 rounded-lg shadow-sm flex items-center max-w-md`}
                                >
                                    <span>{message.text}</span>
                                    <button
                                        onClick={() => setMessage(null)}
                                        className="ml-auto text-current hover:opacity-75 cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            <div className="flex-1"></div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                                    loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition mt-6">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                        <h4 className="font-medium text-gray-800">
                            Profile Picture
                        </h4>
                        <p className="text-gray-600 text-sm">
                            Upload a clear photo of yourself (Max 5MB, JPEG/PNG
                            only)
                        </p>
                    </div>

                    <div className="flex items-center">
                        <div className="relative mr-6">
                            <img
                                src="/pic.png"
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-gray-200"
                            />
                            <button
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition cursor-pointer"
                                onClick={handleProfilePicChange}
                            >
                                <Edit size={12} />
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleProfilePicChange}
                                />
                                <div className="flex items-center">
                                    <Upload size={16} className="mr-2" />
                                    Upload New
                                </div>
                            </label>
                            <button
                                onClick={handleRemoveProfilePic}
                                className="text-red-600 hover:text-red-700 font-medium flex items-center text-sm cursor-pointer"
                            >
                                <Trash2 size={16} className="mr-1" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education Section */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Education Background
                    </h3>
                    <button
                        id="add-education"
                        onClick={handleAddEducation}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm cursor-pointer"
                    >
                        <Plus size={16} className="mr-1" />
                        Add Education
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                    {educations.map((edu, index) => (
                        <div
                            key={edu.id}
                            className="education-entry mb-6 last:mb-0"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-gray-800">
                                    Education {index + 1}
                                </h4>
                                {educations.length > 1 && (
                                    <button
                                        onClick={() =>
                                            handleRemoveEducation(edu.id)
                                        }
                                        className="text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`education-level-${edu.id}`}
                                    >
                                        Education Level
                                    </label>
                                    <select
                                        id={`education-level-${edu.id}`}
                                        value={edu.level}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                edu.id,
                                                "level",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    >
                                        <option value="">Select Level</option>
                                        <option value="elementary">
                                            Elementary
                                        </option>
                                        <option value="high-school">
                                            High School
                                        </option>
                                        <option value="college">College</option>
                                        <option value="vocational">
                                            Vocational
                                        </option>
                                        <option value="graduate">
                                            Graduate
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`school-name-${edu.id}`}
                                    >
                                        School Name
                                    </label>
                                    <input
                                        id={`school-name-${edu.id}`}
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                edu.id,
                                                "school",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`year-graduated-${edu.id}`}
                                    >
                                        Year Graduated
                                    </label>
                                    <input
                                        id={`year-graduated-${edu.id}`}
                                        type="number"
                                        min="1900"
                                        max="2099"
                                        step="1"
                                        value={edu.year}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                edu.id,
                                                "year",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`proof-document-${edu.id}`}
                                    >
                                        Proof Document
                                    </label>
                                    <div className="flex items-center">
                                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex-1 truncate">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        edu.id,
                                                        "file",
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                            <div className="flex items-center">
                                                <Plus
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                <span className="truncate">
                                                    {edu.file
                                                        ? edu.file.name
                                                        : "Upload Document"}
                                                </span>
                                            </div>
                                        </label>
                                        <button
                                            onClick={() =>
                                                handleEducationChange(
                                                    edu.id,
                                                    "file",
                                                    null
                                                )
                                            }
                                            className="ml-2 text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Certificates Section */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Certificates
                    </h3>
                    <button
                        id="add-certificate"
                        onClick={handleAddCertificate}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm cursor-pointer"
                    >
                        <Plus size={16} className="mr-1" />
                        Add Certificate
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                    {certificates.map((cert, index) => (
                        <div
                            key={cert.id}
                            className="certificate-entry mb-6 last:mb-0"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-gray-800">
                                    Certificate {index + 1}
                                </h4>
                                {certificates.length > 1 && (
                                    <button
                                        onClick={() =>
                                            handleRemoveCertificate(cert.id)
                                        }
                                        className="text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`certificate-name-${cert.id}`}
                                    >
                                        Certificate Name
                                    </label>
                                    <input
                                        id={`certificate-name-${cert.id}`}
                                        type="text"
                                        value={cert.name}
                                        onChange={(e) =>
                                            handleCertificateChange(
                                                cert.id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`issuer-${cert.id}`}
                                    >
                                        Issuer/Organization
                                    </label>
                                    <input
                                        id={`issuer-${cert.id}`}
                                        type="text"
                                        value={cert.issuer}
                                        onChange={(e) =>
                                            handleCertificateChange(
                                                cert.id,
                                                "issuer",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`date-issued-${cert.id}`}
                                    >
                                        Date Issued
                                    </label>
                                    <input
                                        id={`date-issued-${cert.id}`}
                                        type="date"
                                        value={cert.date}
                                        onChange={(e) =>
                                            handleCertificateChange(
                                                cert.id,
                                                "date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-600 text-sm font-medium mb-1"
                                        htmlFor={`certificate-file-${cert.id}`}
                                    >
                                        Certificate File
                                    </label>
                                    <div className="flex items-center">
                                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex-1 truncate">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) =>
                                                    handleCertificateChange(
                                                        cert.id,
                                                        "file",
                                                        e.target.files[0]
                                                    )
                                                }
                                            />
                                            <div className="flex items-center">
                                                <Plus
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                <span className="truncate">
                                                    {cert.file
                                                        ? cert.file.name
                                                        : "Upload File"}
                                                </span>
                                            </div>
                                        </label>
                                        <button
                                            onClick={() =>
                                                handleCertificateChange(
                                                    cert.id,
                                                    "file",
                                                    null
                                                )
                                            }
                                            className="ml-2 text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Security Section */}
            <section className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Security
                </h3>
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                        <h4 className="font-medium text-gray-800">Password</h4>
                        <p className="text-gray-600 text-sm">
                            Change your account password
                        </p>
                    </div>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                        Change Password
                    </button>
                </div>
            </section>

            {/* Password Change Modal */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
                    showPasswordModal ? "block" : "hidden"
                }`}
            >
                <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
                    <div className="p-6 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Change Password
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-1"
                                htmlFor="current-password"
                            >
                                Current Password
                            </label>
                            <input
                                id="current-password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-1"
                                htmlFor="new-password"
                            >
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-1"
                                htmlFor="confirm-password"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-300 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
                    showDeleteModal ? "block" : "hidden"
                }`}
            >
                <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
                    <div className="p-6 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Delete Account
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4">
                            Are you sure you want to delete your account? This
                            action cannot be undone. All your data will be
                            permanently removed.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center cursor-pointer">
                                <AlertTriangle size={16} className="mr-2" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Preferences Section */}
            <section className="mb-10">
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                        <h4 className="font-medium text-gray-800">
                            Account Preferences
                        </h4>
                        <p className="text-gray-600 text-sm">
                            Manage your learning preferences
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h5 className="font-medium text-gray-800">
                                    Dark Mode
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Switch between light and dark theme
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h5 className="font-medium text-gray-800">
                                    Email Notifications
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Receive updates via email
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h5 className="font-medium text-gray-800">
                                    Weekly Progress Report
                                </h5>
                                <p className="text-gray-600 text-sm">
                                    Get a weekly summary of your learning
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone Section */}
            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Danger Zone
                </h3>
                <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border border-red-300">
                    <div className="border-b border-red-300 pb-4 mb-4 bg-red-50">
                        <h4 className="font-medium text-gray-800">
                            Delete Account
                        </h4>
                        <p className="text-gray-600 text-sm">
                            Permanently delete your account and all associated
                            data
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-4">
                            This will immediately log you out and you won’t be
                            able to access your account again.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center cursor-pointer"
                        >
                            <AlertTriangle size={16} className="mr-2" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserSettings;
