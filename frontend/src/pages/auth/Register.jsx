import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, User, Mail, Lock, Briefcase, Eye, EyeOff } from "react-feather";
import { register } from "../../services/authService";

const Register = () => {
    const [form, setForm] = useState({
        accountType: "user",
        firstName: "",
        surname: "",
        companyName: "",
        email: "",
        password: "",
        passwordConfirm: "",
        privacyAgreement: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    // Validation helper
    const validateForm = () => {
        const errors = {};

        if (form.accountType !== "company") {
            if (!form.firstName) errors.firstName = "First name is required";
            if (!form.surname) errors.surname = "Surname is required";
        } else {
            if (!form.companyName)
                errors.companyName = "Company name is required";
        }

        if (!form.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!form.password) {
            errors.password = "Password is required";
        } else if (form.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (!form.passwordConfirm) {
            errors.passwordConfirm = "Please confirm your password";
        } else if (form.password !== form.passwordConfirm) {
            errors.passwordConfirm = "Passwords do not match";
        }

        if (!form.privacyAgreement) {
            errors.privacyAgreement =
                "You must agree to the privacy policy and terms of service";
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });

        // Clear errors when user types
        if (error) setError("");
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setFieldErrors({});

        // Client-side validation
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            setLoading(false);
            return;
        }

        try {
            const registerData = {
                email: form.email,
                password: form.password,
                role: form.accountType,
                privacyAgreement: form.privacyAgreement,
            };

            if (form.accountType === "company") {
                registerData.companyName = form.companyName;
            } else {
                registerData.firstName = form.firstName;
                registerData.surname = form.surname;
            }

            await register(registerData);

            // Redirect to verify-email page after successful registration
            navigate("/verify-email", {
                state: {
                    email: form.email,
                    message:
                        "Registration successful! Check your email for the verification code.",
                },
            });
        } catch (error) {
            setError(error.message || "Registration failed.");
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordConfirmVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left Section */}
            <div className="gradient-bg text-white w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                <div className="flex items-center mb-6">
                    <Award size={48} className="text-white mr-3" />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        FAST-C
                    </h1>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    Fernandino Assessment & Skills Training
                </h2>
                <p className="text-base sm:text-lg opacity-90 max-w-md leading-relaxed">
                    Create your digital profile to access AI-powered job
                    matching and industry-relevant training opportunities.
                </p>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Create Account
                        </h3>
                        <p className="text-gray-600">
                            Join FAST-C's digital profiling system
                        </p>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg cursor-default">
                            <p className="text-red-700 text-sm text-center">
                                {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Account Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 cursor-pointer">
                                Select Role
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        value: "user",
                                        label: "Trainee",
                                        icon: <User size={20} />,
                                    },
                                    {
                                        value: "company",
                                        label: "Company",
                                        icon: <Briefcase size={20} />,
                                    },
                                ].map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setForm({
                                                ...form,
                                                accountType: option.value,
                                            });
                                            // Clear field errors when switching account type
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                firstName: "",
                                                surname: "",
                                                companyName: "",
                                            }));
                                        }}
                                        className={`cursor-pointer flex flex-col items-center justify-center border rounded-lg py-3 transition-all duration-200 ${
                                            form.accountType === option.value
                                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div
                                            className={`mb-1 ${
                                                form.accountType ===
                                                option.value
                                                    ? "text-blue-600"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {option.icon}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${
                                                form.accountType ===
                                                option.value
                                                    ? "text-blue-700"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {option.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        {form.accountType !== "company" ? (
                            <>
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                                    >
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={20}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder="First name"
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                                fieldErrors.firstName
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    {fieldErrors.firstName && (
                                        <p className="text-red-500 text-xs mt-1 cursor-default">
                                            {fieldErrors.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="surname"
                                        className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                                    >
                                        Surname
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={20}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            id="surname"
                                            type="text"
                                            name="surname"
                                            value={form.surname}
                                            onChange={handleChange}
                                            required
                                            placeholder="Surname"
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                                fieldErrors.surname
                                                    ? "border-red-300 focus:ring-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        />
                                    </div>
                                    {fieldErrors.surname && (
                                        <p className="text-red-500 text-xs mt-1 cursor-default">
                                            {fieldErrors.surname}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div>
                                <label
                                    htmlFor="companyName"
                                    className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                                >
                                    Company Name
                                </label>
                                <div className="relative">
                                    <Briefcase
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="companyName"
                                        type="text"
                                        name="companyName"
                                        value={form.companyName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Company name"
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                            fieldErrors.companyName
                                                ? "border-red-300 focus:ring-red-500"
                                                : "border-gray-300"
                                        }`}
                                    />
                                </div>
                                {fieldErrors.companyName && (
                                    <p className="text-red-500 text-xs mt-1 cursor-default">
                                        {fieldErrors.companyName}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                        fieldErrors.email
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    autoComplete="email"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-red-500 text-xs mt-1 cursor-default">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                        fieldErrors.password
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs mt-1 cursor-default">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="passwordConfirm"
                                className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    id="passwordConfirm"
                                    type={
                                        showPasswordConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                    className={`w-full pl-10 pr-12 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text ${
                                        fieldErrors.passwordConfirm
                                            ? "border-red-300 focus:ring-red-500"
                                            : "border-gray-300"
                                    }`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordConfirmVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showPasswordConfirm ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            {fieldErrors.passwordConfirm && (
                                <p className="text-red-500 text-xs mt-1 cursor-default">
                                    {fieldErrors.passwordConfirm}
                                </p>
                            )}
                        </div>

                        {/* Privacy Agreement */}
                        <div className="flex items-start">
                            <input
                                id="privacyAgreement"
                                name="privacyAgreement"
                                type="checkbox"
                                checked={form.privacyAgreement}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer mt-1"
                            />
                            <label
                                htmlFor="privacyAgreement"
                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                            >
                                I agree to the{" "}
                                <Link
                                    to="/privacy-policy"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline transition duration-200 cursor-pointer"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/terms-of-service"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline transition duration-200 cursor-pointer"
                                >
                                    Terms of Service
                                </Link>
                            </label>
                        </div>
                        {fieldErrors.privacyAgreement && (
                            <p className="text-red-500 text-xs mt-1 cursor-default">
                                {fieldErrors.privacyAgreement}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center cursor-wait">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600 cursor-default">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
