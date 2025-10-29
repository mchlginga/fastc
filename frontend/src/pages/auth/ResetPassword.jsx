import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Award, Eye, EyeOff } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    requestResetPassword,
    resetPassword,
} from "../../services/authService";

const ResetPassword = () => {
    const { setUser } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Client-side validation
        if (!form.email) {
            setError("Email is required.");
            setLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        try {
            await requestResetPassword(form.email);
            setEmailSent(true);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to send reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Client-side validation
        if (!form.newPassword) {
            setError("New password is required.");
            setLoading(false);
            return;
        }

        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        if (form.newPassword !== form.confirmNewPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await resetPassword({ token, newPassword: form.newPassword });
            setUser(null);
            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Password reset successfully! Please login with your new password.",
                    success: true,
                },
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Password reset failed. The link may have expired."
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className=" flex items-center justify-center  px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center space-x-2 mb-2">
                        <Award size={40} className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            FAST-C
                        </h1>
                    </div>
                </div>

                {/* Step 1: Request Email */}
                {!token && !emailSent && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Forgot Password?
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Enter your email to receive a password reset
                                link.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg cursor-default">
                                <p className="text-red-700 text-sm text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleRequestReset}
                            className="space-y-6"
                        >
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
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

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
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Email Sent */}
                {!token && emailSent && (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <Mail className="text-blue-600 w-12 h-12" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 text-sm mb-6 cursor-default">
                            A reset link has been sent to{" "}
                            <span className="font-medium text-gray-800">
                                {form.email}
                            </span>
                            . Follow the link to reset your password.
                        </p>
                        <button
                            onClick={() => {
                                setEmailSent(false);
                                setError("");
                            }}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            Back to Reset
                        </button>
                    </div>
                )}

                {/* Step 3: Reset Password Form */}
                {token && (
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Reset Password
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Enter and confirm your new password below.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg cursor-default">
                                <p className="text-red-700 text-sm text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleResetPassword}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={
                                            showNewPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleNewPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmNewPassword"
                                        value={form.confirmNewPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={
                                            toggleConfirmPasswordVisibility
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

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
                                        Resetting...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600 cursor-default">
                        Back to{" "}
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
    );
};

export default ResetPassword;
