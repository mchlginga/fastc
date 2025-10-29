import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Award, Mail } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import {
    verifyEmail,
    resendVerificationCode,
} from "../../services/authService";

// Centralized route configuration
const ROUTE_CONFIG = {
    user: "/profile-setup",
    company: "/company-profile-setup",
};

const VerifyEmail = () => {
    const { setUser } = useAuth();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    const navigate = useNavigate();
    const { state } = useLocation();

    // Better state handling with fallbacks
    const email = state?.email || "";

    // Enhanced route protection
    useEffect(() => {
        if (!email) {
            console.warn(
                "VerifyEmail: No email provided, redirecting to register"
            );
            navigate("/register", { replace: true });
            return;
        }
    }, [email, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(
                () => setResendCooldown(resendCooldown - 1),
                1000
            );
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
        // Clear errors when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enhanced validation
        if (code.length !== 6) {
            setError("Please enter a complete 6-digit code.");
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            setError("Verification code must contain only numbers.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const publicUser = await verifyEmail(email, code);
            setUser(publicUser);

            // Use centralized route config with fallback
            const redirectTo =
                ROUTE_CONFIG[publicUser.role] || ROUTE_CONFIG.user;
            navigate(redirectTo, {
                replace: true,
                state: {
                    welcomeMessage: "Email verified successfully!",
                    freshLogin: true,
                },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Invalid verification code. Please check and try again."
            );
            // Clear code on error for better UX
            setCode("");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setResendMessage("");
        setError("");

        try {
            await resendVerificationCode(email);
            setResendMessage(
                "A new verification code has been sent to your email."
            );
            setResendCooldown(30); // 30-second cooldown
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Unable to resend code. Please try again in a few minutes."
            );
        } finally {
            setResendLoading(false);
        }
    };

    // Early return for better readability
    if (!email) {
        return (
            <div className=" flex items-center justify-center p-6 ">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className=" flex items-center justify-center p-6 ">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Title & Instructions */}
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Verify Your Email
                    </h3>

                    <p className="text-sm text-gray-500">
                        Code sent to:{" "}
                        <span className="font-medium text-gray-700">
                            {email}
                        </span>
                    </p>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg cursor-default">
                        <p className="text-red-700 text-sm text-center">
                            {error}
                        </p>
                    </div>
                )}
                {resendMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg cursor-default">
                        <p className="text-green-700 text-sm text-center">
                            {resendMessage}
                        </p>
                    </div>
                )}

                {/* Verification Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="code"
                            className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer"
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
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={code}
                                onChange={handleChange}
                                maxLength={6}
                                placeholder="000000"
                                required
                                autoFocus
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                           text-gray-700 text-center text-lg font-semibold tracking-widest
                                           transition duration-200 cursor-text"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-center cursor-default">
                            Enter the 6-digit code from your email
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white 
                                   bg-blue-600 hover:bg-blue-700 focus:outline-none 
                                   focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                   transition duration-200 
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   shadow-sm hover:shadow-md cursor-pointer"
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
                                Verifying...
                            </span>
                        ) : (
                            "Verify Email"
                        )}
                    </button>
                </form>

                {/* Resend Code Section */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2 cursor-default">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={resendLoading || resendCooldown > 0}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 
                                   transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                   underline cursor-pointer"
                    >
                        {resendLoading
                            ? "Sending..."
                            : resendCooldown > 0
                            ? `Resend available in ${resendCooldown}s`
                            : "Resend Verification Code"}
                    </button>
                </div>

                {/* Footer Navigation */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600 cursor-default">
                        Return to{" "}
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

export default VerifyEmail;
