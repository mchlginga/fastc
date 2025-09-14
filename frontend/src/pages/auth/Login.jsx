// TEMPORARY
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({ 
        email: "", 
        password: "" 
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

        return rolePaths[role] || "/user";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ 
            ...form, 
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userData = await login(form.email, form.password);
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
        <div className="">
            <form action="" onSubmit={handleSubmit} className="">
                <h2 className="">Login</h2>

                {error && <p>{error}</p>}

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
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
                <Button 
                    type="submit" 
                    disabled={loading}
                >
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