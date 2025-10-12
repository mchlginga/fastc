import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Award, Mail } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    verifyEmail,
    resendVerificationCode,
} from "../../services/authService";

const VerifyEmail = () => {
    const { setUser } = useAuth();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const navigate = useNavigate();
    const { state } = useLocation();
    const email = state?.email || "";
    const resendSuccess = state?.resendSuccess || false;

    useEffect(() => {
        if (!email) navigate("/login", { replace: true });
    }, [email, navigate]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError("Please enter a 6-digit code.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const publicUser = await verifyEmail(email, code);
            setUser(publicUser);
            // Redirect based on role
            let redirectTo = "/profile-setup";
            if (publicUser.role === "admin") {
                redirectTo = "/admin-profile-setup";
            } else if (publicUser.role === "company") {
                redirectTo = "/company-profile-setup";
            }
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid verification code."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendMessage("");
        setError("");
        try {
            await resendVerificationCode(email);
            setResendMessage("A new code has been sent to your email.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to resend code. Try again."
            );
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-3">
                    Email Verification
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-medium">{email}</span>.
                </p>

                {/* Feedback */}
                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}
                {resendMessage && (
                    <p className="text-green-600 text-sm text-center mb-4">
                        {resendMessage}
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="code"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Verification Code
                        </label>
                        <div className="relative">
                            <Mail
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="code"
                                name="code"
                                type="text"
                                value={code}
                                onChange={handleChange}
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                                           text-gray-700 transition duration-200"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white 
                                   bg-blue-600 hover:bg-blue-700 focus:outline-none 
                                   focus:ring-2 focus:ring-blue-500 transition duration-200 
                                   disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                {/* Resend Code */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-sm text-blue-600 hover:text-blue-800 
                                   font-medium transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
