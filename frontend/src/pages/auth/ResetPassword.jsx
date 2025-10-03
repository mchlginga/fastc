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
        <div className="min-h-screen  flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {!token && !emailSent ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Request Password Reset
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your email to receive a password reset link
                        </p>
                        {error && (
                            <p className="text-red-500 text-sm text-center mb-6">
                                {error}
                            </p>
                        )}
                        <form
                            onSubmit={handleRequestReset}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
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
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : !token && emailSent ? (
                    <>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Check Your Email
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            A password reset link has been sent to {form.email}.
                        </p>
                        <button
                            onClick={() => setEmailSent(false)}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            Back to Request
                        </button>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                            Reset Password
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your new password
                        </p>
                        {error && (
                            <p className="text-red-500 text-sm text-center mb-6">
                                {error}
                            </p>
                        )}
                        <form
                            onSubmit={handleResetPassword}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="newPassword"
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="New password"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmNewPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="confirmNewPassword"
                                        type="password"
                                        name="confirmNewPassword"
                                        value={form.confirmNewPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    </>
                )}

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
