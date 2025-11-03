import { useState, useEffect } from "react";
import { X, Plus } from "react-feather";
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
        representative: {
            name: "",
            email: "",
            contactNumber: "",
        },
        businessPermit: "",
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
                representative: user.representative || {
                    name: "",
                    email: "",
                    contactNumber: "",
                },
                businessPermit: user.businessPermit || "",
            });
        }
    }, [user]);

    const handleClose = () => {
        if (loading) return;
        setErrors({});
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested representative fields
        if (name.startsWith("representative.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                representative: {
                    ...prev.representative,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

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
            if (!formData.companyName?.trim()) {
                newErrors.companyName = "Company name is required";
            }
        } else {
            if (!formData.firstName?.trim()) {
                newErrors.firstName = "First name is required";
            }
            if (!formData.surname?.trim()) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col cursor-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit User
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Update user information and preferences
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                User Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
                                disabled={loading}
                            >
                                <option value="user">Trainee</option>
                                <option value="company">Company</option>
                                <option value="admin">Admin</option>
                                <option value="superAdmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Role-specific fields */}
                        {formData.role === "company" ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text ${
                                            errors.companyName
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter company name"
                                        disabled={loading}
                                    />
                                    {errors.companyName && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.companyName}
                                        </p>
                                    )}
                                </div>

                                {/* Company Representative Fields */}
                                <div className="border-t pt-4">
                                    <h4 className="font-medium text-gray-700 mb-3">
                                        Company Representative
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                                Representative Name
                                            </label>
                                            <input
                                                type="text"
                                                name="representative.name"
                                                value={
                                                    formData.representative.name
                                                }
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                                placeholder="Representative full name"
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
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
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                                    placeholder="rep@company.com"
                                                    disabled={loading}
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
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                                    placeholder="Phone number"
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text ${
                                            errors.firstName
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="First name"
                                        disabled={loading}
                                    />
                                    {errors.firstName && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                        Surname *
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text ${
                                            errors.surname
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Surname"
                                        disabled={loading}
                                    />
                                    {errors.surname && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.surname}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text ${
                                    errors.email
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="user@example.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Contact and Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                    placeholder="Phone number"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Status
                                </label>
                                <select
                                    name="profileStatus"
                                    value={formData.profileStatus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                placeholder="Full address"
                                disabled={loading}
                            />
                        </div>

                        {/* Skills (for trainees only) */}
                        {formData.role === "user" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Skills
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) =>
                                            setNewSkill(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                                        placeholder="Add a skill"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                                        disabled={loading}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                                className="text-blue-600 hover:text-blue-800 cursor-pointer p-0.5 rounded"
                                                disabled={loading}
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Availability (for trainees only) */}
                        {formData.role === "user" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Availability
                                </label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="N/A">Not Specified</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>
                        )}

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    {errors.submit}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
