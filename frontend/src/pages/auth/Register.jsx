// TEMPORARY

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register, getMe } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Register = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({
        // choose your username and password
        username: "",
        password: "",
        passwordConfirm: "",

        // more details
        email: "",
        emailConfirm: "",
        firstName: "",
        surname: "",
        city: "",
        country: "Philippines",

        role: "user",

        // privacy agreement
        privacyAgreement: false
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getRedirectPath = (role) => {
        const rolePaths = {
            admin: "/admin",
            company: "/company",
            user: "/user"
        };

        return rolePaths[role] || "/user";
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
            await register({
                username: form.username,
                firstName: form.firstName,
                surname: form.surname,
                email: form.email,
                password: form.password,
                city: form.city,
                country: form.country,
                privacyAgreement: form.privacyAgreement
            });

            const userData = await getMe();
            setUser(userData);

            const redirectPath = getRedirectPath(userData.role);
            navigate(redirectPath);
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed.");
            setLoading(false);
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <h2>Register</h2>

                {error && <p>{error}</p>}

                {/* choose your username and password */}
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
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {/* more details */}
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
                <Input
                    label="City"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Country"
                    type="text"
                    name="country"
                    value={form.country}
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
        </div>
    );
};

export default Register;

