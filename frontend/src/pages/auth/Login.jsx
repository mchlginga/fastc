import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Users, Briefcase, BarChart2, Mail, Lock } from "react-feather";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({ 
        email: "", 
        password: "",
        rememberMe: false
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getRedirectpath = (role) => {
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
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userData = await login(form.email, form.password, form.rememberMe);
            setUser(userData);
            const redirectPath = getRedirectpath(userData.role);
            navigate(redirectPath);
        } catch (error) {
            setError(error.response?.data?.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div class="absolute inset-0 bg-gradient-to-br"></div>

            {/* LEFT */}
			<div className="gradient-bg text-white w-full lg:w-1/2 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-black opacity-10"></div>
				
                {/* LOGO */}
                <div className="flex items-center justify-center mb-8 brand-logo">
					<Award color="white" size={54} className="mr-3"/>
					<h1 className="text-4xl font-bold tracking-tight">FAST-C</h1>
				</div>

				<h2 className="text-2xl font-semibold mb-4">Fernandino Assessment & Skills Training</h2>

				<p className="text-lg opacity-90 max-w-md leading-relaxed mb-12">Connecting certified trainees with opportunities through digital profiling and AI-powered job matching.</p>

				<div className="flex justify-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100/20 flex items-center justify-center">
                        <Users color="white" size={20}/>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100/20 flex items-center justify-center">
                        <Briefcase color="white" size={20}/>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100/20 flex items-center justify-center">
                        <BarChart2 color="white" size={20}/>
                    </div>
				</div>
			</div>

            {/* RIGHT */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="form-container rounded-xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
                            <p className="text-gray-600 mb-2">Sign in to access your account</p>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label for="Email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label for="Password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="rememberMe"
                                        label="Remember Me"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={form.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded hover:cursor-pointer"
                                    />
                                    <label for="rememberMe" className="ml-2 block text-sm text-gray-700 hover:cursor-pointer">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/reset-password" className="text-blue-600 hover:text-blue-500 transition-colors">
                                Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {loading ? "Logging in..." : "Sign in"}
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>

                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                    New to FAST-C?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link to="/register" className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>© 2025 FAST-C Digital Profiling System. All rights reserved.</p>  
                    </div>
                </div>
			</div>
        </div>
    );

};

export default Login;