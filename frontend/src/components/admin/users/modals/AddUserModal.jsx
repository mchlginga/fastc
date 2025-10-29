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
    const [showPassword, setShowPassword] = useState(false); // NEW: Show password state
    const modalRef = useRef(null);

    const isSuperAdmin = currentUser?.role === "superAdmin";

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Memoized form reset
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
        setShowPassword(false); // Reset show password state
    }, []);

    const handleClose = () => {
        if (loading) return; // Prevent closing while loading
        resetForm();
        onClose();
    };

    // Optimized change handler
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error only if it exists
        setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    }, []);

    // NEW: Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Simplified validation
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
            onUserAdded(); // This will trigger the toast notification
            resetForm();
            onClose();
        } catch (error) {
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden cursor-auto"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking inside
            >
                {/* Header - Simplified */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add New User
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form - Simplified styling */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 space-y-3 max-h-[calc(90vh-120px)] overflow-y-auto"
                >
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                            User Role *
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            disabled={loading}
                        >
                            <option value="user">Trainee</option>
                            <option value="company">Company</option>
                            <option value="admin">Admin</option>
                            {isSuperAdmin && (
                                <option value="superAdmin">Super Admin</option>
                            )}
                        </select>
                        {errors.role && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Dynamic Fields */}
                    {formData.role === "company" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                    errors.companyName
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter company name"
                                disabled={loading}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.firstName
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="First name"
                                    disabled={loading}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Surname *
                                </label>
                                <input
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.surname
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Surname"
                                    disabled={loading}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                errors.email
                                    ? "border-red-300"
                                    : "border-gray-300"
                            }`}
                            placeholder="user@example.com"
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password with show/hide toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-2 pr-10 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
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
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Optional Fields */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Contact Number
                            </label>
                            <input
                                type="text"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                placeholder="Phone number"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Status
                            </label>
                            <select
                                name="profileStatus"
                                value={formData.profileStatus}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                            placeholder="Full address"
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs text-red-600">
                                {errors.submit}
                            </p>
                        </div>
                    )}
                </form>

                {/* Footer - Simplified */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                        disabled={loading}
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
