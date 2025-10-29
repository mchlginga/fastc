import { useState, useEffect } from "react";
import { X } from "react-feather";
import { adminUserService } from "../../../../services/userService";

const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        surname: "",
        companyName: "",
        email: "",
        role: "user",
        contactNumber: "",
        address: "",
        skills: [],
        availability: "N/A",
        profileStatus: "pending",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [newSkill, setNewSkill] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                surname: user.surname || "",
                companyName: user.companyName || "",
                email: user.email || "",
                role: user.role || "user",
                contactNumber: user.contactNumber || "",
                address: user.address || "",
                skills: user.skills || [],
                availability: user.availability || "N/A",
                profileStatus: user.profileStatus || "pending",
            });
        }
    }, [user]);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill !== skillToRemove),
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (formData.role === "company") {
            if (!formData.companyName) {
                newErrors.companyName = "Company name is required";
            }
        } else {
            if (!formData.firstName) {
                newErrors.firstName = "First name is required";
            }
            if (!formData.surname) {
                newErrors.surname = "Surname is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await adminUserService.updateUser(user._id, formData);
            onUserUpdated();
            handleClose();
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit User
                        </h2>
                        <p className="text-sm text-gray-600">
                            Update user information
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                User Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="user">Trainee</option>
                                <option value="company">Company</option>
                                <option value="admin">Admin</option>
                                <option value="superAdmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Role-specific fields */}
                        {formData.role === "company" ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                        errors.companyName
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter company name"
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.companyName}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                            errors.firstName
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="First name"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Surname *
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                            errors.surname
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Surname"
                                    />
                                    {errors.surname && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.surname}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                    errors.email
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="user@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Contact and Status */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="Phone number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="profileStatus"
                                    value={formData.profileStatus}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Full address"
                            />
                        </div>

                        {/* Skills (for trainees) */}
                        {formData.role === "user" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skills
                                </label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) =>
                                            setNewSkill(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Add a skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                                className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability (for trainees) */}
                        {formData.role === "user" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Availability
                                </label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="N/A">Not Specified</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>
                        )}

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs text-red-600">
                                    {errors.submit}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update User"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;
