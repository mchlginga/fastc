import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, User, Mail, Lock } from "react-feather";
import { register, resendVerificationCode } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { setUser } = useAuth();
    const [form, setForm] = useState({
        firstName: "",
        surname: "",
        email: "",
        password: "",
        passwordConfirm: "",
        privacyAgreement: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const getRedirectPath = (role) => {
        const rolePaths = {
            admin: "/admin",
            company: "/company",
            user: "/profile-setup/step1",
        };
        return rolePaths[role] || "/profile-setup/step1";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        if (form.password !== form.passwordConfirm) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        if (!form.privacyAgreement) {
            setError("You must agree to the privacy disclaimer to continue.");
            setLoading(false);
            return;
        }
        try {
            await register({
                firstName: form.firstName,
                surname: form.surname,
                email: form.email,
                password: form.password,
                privacyAgreement: form.privacyAgreement,
            });
            try {
                await resendVerificationCode(form.email);
                setSuccess(true);
                setTimeout(
                    () =>
                        navigate(
                            `/verify-email?email=${encodeURIComponent(
                                form.email
                            )}`
                        ),
                    2000
                );
            } catch (resendError) {
                setError(
                    `Registration successful, but failed to send verification code: ${resendError.message}`
                );
                setLoading(false);
            }
        } catch (registerError) {
            setError(
                registerError.response?.data?.message || "Registration failed."
            );
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
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
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        Create Account
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                        Join FAST-C's digital profiling system
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm text-center mb-6">
                            {error}
                        </p>
                    )}
                    {success && !error && !loading && (
                        <p className="text-green-600 text-sm text-center mb-6">
                            Check your inbox for a verification code.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Fields */}

                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="surname"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Email Fields */}

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
                                    placeholder="Email"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Password Fields */}

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Password"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="passwordConfirm"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                    type="password"
                                    name="passwordConfirm"
                                    value={form.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm password"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>

                        {/* Privacy Agreement */}
                        <div className="flex items-center">
                            <input
                                id="privacyAgreement"
                                name="privacyAgreement"
                                type="checkbox"
                                checked={form.privacyAgreement}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label
                                htmlFor="privacyAgreement"
                                className="ml-2 text-sm text-gray-700"
                            >
                                I agree to the{" "}
                                <Link
                                    to="/privacy-policy"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline transition duration-200"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/terms-of-service"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline transition duration-200"
                                >
                                    Terms of Service
                                </Link>
                            </label>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Registering..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
