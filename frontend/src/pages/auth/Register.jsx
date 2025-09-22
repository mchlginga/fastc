import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Users, Briefcase, BarChart2, User, AtSign, Mail, Lock   } from "react-feather";

import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({
		firstName: "",
        surname: "",
        username: "",
        email: "",
        emailConfirm: "",
		password: "",
        passwordConfirm: "",
		privacyAgreement: false
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getRedirectPath = (role) => {
        const rolePaths = {
            admin: "/admin",
            company: "/company",
            user: "/profile-setup/step1"
        };

        return rolePaths[role] || "/profile-setup/step1";
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

        if (form.password !== form.passwordConfirm) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (form.email !== form.emailConfirm) {
            setError("Email addresses do not match.");
            setLoading(false);
            return;
        }

        if (!form.privacyAgreement) {
            setError("You must agree to the privacy disclaimer to continue.");
            setLoading(false);
            return;
        }

        try {
            const userData = await register({
                username: form.username,
                firstName: form.firstName,
                surname: form.surname,
                email: form.email,
                password: form.password,
                privacyAgreement: form.privacyAgreement
            });
            setUser(userData);

            const redirectPath = getRedirectPath(userData.role);
            navigate(redirectPath);
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed.");
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

				<p className="text-lg opacity-90 max-w-md leading-relaxed mb-12">Create your digital profile to access AI-powered job matching and training opportunities.</p>

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
                            <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                            <p className="text-gray-600 mb-2">Join FAST-C's digital profiling system</p>
                        </div>

                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                           <div>
                                <label for="First Name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="First Name"
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="First name"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>

                           <div>
                                <label for="Surname" className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="Surname"
                                        type="text"
                                        name="surname"
                                        value={form.surname}
                                        onChange={handleChange}
                                        required
                                        placeholder="Surname"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>
                           <div>
                                <label for="Username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <AtSign color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="Username"
                                        type="text"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        placeholder="Username"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>
                           <div>
                                <label for="Email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                                        placeholder="Email"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>
                           <div>
                                <label for="emailConfirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail color="gray" size={20}/>
                                    </div>

                                    <input 
                                        label="emailConfirm"
                                        type="email"
                                        name="emailConfirm"
                                        value={form.emailConfirm}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm email"
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
                                        placeholder="Password"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>
                           <div>
                                <label for="Confirm Password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock color="gray" size={20}/>
                                    </div>

                                    <input 
										label="Confirm Password"
										type="password"
										name="passwordConfirm"
										value={form.passwordConfirm}
										onChange={handleChange}
										required
                                        placeholder="Confirm Password"
                                        className="focus w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="privacyAgreement"
                                        name="privacyAgreement"
                                        type="checkbox"
                                        checked={form.privacyAgreement}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded hover:cursor-pointer"
                                    />
                                    <label for="privacyAgreement" className="ml-2 block text-sm font-medium text-gray-700 hover:cursor-pointer">
                                        I agree to the <Link to="/privacy" className="text-blue-600 hover:text-blue-500 underline">Privacy Policy</Link> and <Link to="/terms" className="text-blue-600 hover:text-blue-500 underline">Terms of Service</Link>
                                    </label>
                                </div>
							</div>

                            <div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {loading ? "Registering..." : "Create Account"}
                                </button>
                            </div>

							<div className="mt-6 text-center text-sm">
								<p className="text-gray-600">
									Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
								</p>
							</div>

							{/* */}

                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>© 2025 FAST-C Digital Profiling System. All rights reserved.</p>  
                    </div>
                </div>
			</div>
		</div>
/*         <div>
            <form action="" onSubmit={handleSubmit}>
                <h2>Register</h2>

                {error && <p>{error}</p>}

                choose your username and password
                <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    required
                />

                more details
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Confirm Email"
                    type="email"
                    name="emailConfirm"
                    value={form.emailConfirm}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Surname"
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    required
                />

                <div>
                    <label htmlFor="">
                        <input 
                            type="checkbox"
                            name="privacyAgreement"
                            checked={form.privacyAgreement}
                            onChange={handleChange}
                        />
                        I agree to the privacy policy
                    </label>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Registerring..." : "Register"}
                </Button>
            </form>
        </div> */
    );
};

export default Register;