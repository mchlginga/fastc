// TEMPORARY
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login, getMe } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getRedirectpath = (role) => {
        const rolePaths = {
            admin: "/admin",
            company: "/company",
            user: "/user",
        };

        return rolePaths[role] || "/user";
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(form.email, form.password);

            const userData = await getMe();
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
        <div>
            <form action="" onSubmit={handleSubmit} className="">
                <h2>Login</h2>

                {error && <p>{error}</p>}

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <div className="mt-3">
                    <p>
                        <Link to="/reset-password" className="text-blue-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </p>
                    <p>
                        Don't have an accout?{" "}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );

};

export default Login;