import { useState, useCallback, useRef, useEffect } from "react";
import { X, Eye, EyeOff } from "react-feather";
import { useAuth } from "../../../../context/AuthContext";
import { adminUserService } from "../../../../services/userService";

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        role: "user",
        firstName: "",
        surname: "",
        companyName: "",
        email: "",
        password: "",
        contactNumber: "",
        address: "",
        profileStatus: "approved",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const modalRef = useRef(null);

    const isSuperAdmin = currentUser?.role === "superAdmin";

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const resetForm = useCallback(() => {
        setFormData({
            role: "user",
            firstName: "",
            surname: "",
            companyName: "",
            email: "",
            password: "",
            contactNumber: "",
            address: "",
            profileStatus: "approved",
        });
        setErrors({});
        setShowPassword(false);
    }, []);

    const handleClose = useCallback(() => {
        if (loading) return;
        resetForm();
        onClose();
    }, [loading, resetForm, onClose]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
            // Clear error when user starts typing
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: "" }));
            }
            if (errors.submit) {
                setErrors((prev) => ({ ...prev, submit: "" }));
            }
        },
        [errors]
    );

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (formData.role === "superAdmin" && !isSuperAdmin) {
            newErrors.role =
                "Only Super Admins can create Super Admin accounts";
        }

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

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, isSuperAdmin]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === "superAdmin" && !isSuperAdmin) {
            setErrors({
                submit: "Unauthorized: Only Super Admins can create Super Admin accounts",
            });
            return;
        }

        if (!validateForm()) return;

        setLoading(true);
        try {
            await adminUserService.createUser(formData);
            onUserAdded();
            resetForm();
            onClose();
        } catch (error) {
            setErrors({
                submit:
                    error.message || "Failed to create user. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Early return for performance
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add New User
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                User Role *
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                disabled={loading}
                            >
                                <option value="user">Trainee</option>
                                <option value="company">Company</option>
                                <option value="admin">Admin</option>
                                {isSuperAdmin && (
                                    <option value="superAdmin">
                                        Super Admin
                                    </option>
                                )}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                                    {errors.role}
                                </p>
                            )}
                        </div>

                        {/* Dynamic Fields */}
                        {formData.role === "company" ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.companyName
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter company name"
                                    disabled={loading}
                                />
                                {errors.companyName && (
                                    <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                                        {errors.companyName}
                                    </p>
                                )}
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
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                            errors.firstName
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="First name"
                                        disabled={loading}
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600 animate-fadeIn">
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
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                            errors.surname
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Surname"
                                        disabled={loading}
                                    />
                                    {errors.surname && (
                                        <p className="mt-1 text-sm text-red-600 animate-fadeIn">
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
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                    errors.email
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="user@example.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password with show/hide toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.password
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Optional Fields */}
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
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
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
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
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
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                placeholder="Full address"
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
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
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
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
                                Creating...
                            </span>
                        ) : (
                            "Create User"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
