import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get("email") || "";

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
            setUser(publicUser); // Update user in AuthContext
            navigate("/profile-setup/step1", { replace: true });
        } catch (error) {
            setError(
                error.response?.data?.message || "Invalid verification code."
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
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to resend code. Try again."
            );
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if (!email) {
            navigate("/register", { replace: true });
        }
    }, [email, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Email Verification
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Enter the 6-digit code sent to {email}
                </p>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-6">
                        {error}
                    </p>
                )}
                {resendMessage && (
                    <p className="text-green-600 text-sm text-center mb-6">
                        {resendMessage}
                    </p>
                )}

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
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={code}
                                onChange={handleChange}
                                required
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
