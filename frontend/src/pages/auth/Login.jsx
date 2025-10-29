import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Mail, Lock, Eye, EyeOff } from "react-feather";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const ROUTE_CONFIG = {
    superAdmin: "/admin",
    admin: "/admin",
    company: "/company",
    user: "/user",
};

// Validation helper
const validateForm = (email, password) => {
    const errors = [];

    if (!email) {
        errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push("Please enter a valid email address");
    }

    if (!password) {
        errors.push("Password is required");
    } /*  else if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
 */
    return errors;
};

const Login = () => {
    const { setUser } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });

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
        const validationErrors = validateForm(form.email, form.password);
        if (validationErrors.length > 0) {
            setError(validationErrors[0]);
            setLoading(false);
            return;
        }

        try {
            const userData = await login(
                form.email,
                form.password,
                form.rememberMe
            );
            setUser(userData);

            // Use centralized route config with proper fallback
            const redirectTo = ROUTE_CONFIG[userData.role] || ROUTE_CONFIG.user;

            navigate(redirectTo, {
                replace: true,
                state: {
                    welcomeBack: true,
                    timestamp: new Date().toISOString(),
                },
            });
        } catch (error) {
            console.error("Login error:", error);

            // Enhanced error handling
            const errorMessage =
                error.message || "Login failed. Please check your credentials.";

            if (errorMessage.includes("verify your email")) {
                // Give user option to navigate to verification
                setError(
                    <span>
                        {errorMessage}{" "}
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/verify-email", {
                                    state: { email: form.email },
                                })
                            }
                            className="text-blue-600 hover:text-blue-800 underline font-medium cursor-pointer"
                        >
                            Verify email now
                        </button>
                    </span>
                );
            } else if (
                errorMessage.includes("password") ||
                errorMessage.includes("credentials")
            ) {
                setFieldErrors({ password: errorMessage });
            } else if (errorMessage.includes("email")) {
                setFieldErrors({ email: errorMessage });
            } else {
                setError(errorMessage);
            }

            // Clear password on error for security
            setForm((prev) => ({ ...prev, password: "" }));
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    Empowering Fernandinos with digital profiling, verified
                    certificates, and AI-powered job opportunities.
                </p>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 ">
                <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Welcome Back
                        </h3>
                        <p className="text-gray-600">
                            Login to access your account
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
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
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
                                    autoComplete="current-password"
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

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={form.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-sm text-gray-700 cursor-pointer"
                            >
                                Keep me logged in
                            </label>
                        </div>

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
                                    Logging in...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>

                    {/* Registration Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600 cursor-default">
                            New to FAST-C?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
