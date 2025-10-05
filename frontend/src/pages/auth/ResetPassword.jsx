import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Award } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    requestPasswordReset,
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
        try {
            await requestPasswordReset(form.email);
            setEmailSent(true);
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to send reset email."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (form.newPassword !== form.confirmNewPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        try {
            await resetPassword({ token, newPassword: form.newPassword });
            setUser(null);
            navigate("/login", { replace: true });
        } catch (error) {
            setError(error.response?.data?.message || "Password reset failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center space-x-2 mb-2">
                        <Award size={40} className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            FAST-C
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Digital Profiling System
                    </p>
                </div>

                {/* Step 1: Request Email */}
                {!token && !emailSent && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
                            Forgot Your Password?
                        </h2>
                        <p className="text-gray-600 text-center mb-6 text-sm">
                            Enter your email below to receive a password reset
                            link.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">
                                {error}
                            </p>
                        )}

                        <form
                            onSubmit={handleRequestReset}
                            className="space-y-5"
                        >
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
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 transition duration-200"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
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
                        <p className="text-gray-600 text-sm mb-6">
                            A reset link has been sent to{" "}
                            <span className="font-medium text-gray-800">
                                {form.email}
                            </span>
                            . Follow the link to reset your password.
                        </p>
                        <button
                            onClick={() => setEmailSent(false)}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        >
                            Back
                        </button>
                    </div>
                )}

                {/* Step 3: Reset Password Form */}
                {token && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-3">
                            Reset Password
                        </h2>
                        <p className="text-gray-600 text-center mb-6 text-sm">
                            Enter and confirm your new password below.
                        </p>

                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">
                                {error}
                            </p>
                        )}

                        <form
                            onSubmit={handleResetPassword}
                            className="space-y-5"
                        >
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="New password"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 transition duration-200"
                                />
                            </div>

                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={form.confirmNewPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm new password"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 transition duration-200"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
