import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Mail, Lock } from "react-feather";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const { setUser } = useAuth();
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getRedirectPath = (role) => {
        const rolePaths = {
            admin: "/admin",
            company: "/company",
            user: "/user",
        };
        return rolePaths[role] || "/login";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const userData = await login(
                form.email,
                form.password,
                form.rememberMe
            );
            setUser(userData);
            const redirectPath = getRedirectPath(userData.role);
            navigate(redirectPath);
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Login failed.");
        } finally {
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
                    Empowering Fernandinos with digital profiling, verified
                    certificates, and AI-powered job opportunities.
                </p>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        Welcome Back
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                        Sign in to access your account
                    </p>

                    {error && (
                        <p className="text-red-500 text-sm text-center mb-6">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
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
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>
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
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
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
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="/reset-password"
                                className="text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Logging in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            New to FAST-C?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
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
