// TEMPORARY

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { requestPasswordReset, resetPassword } from "../../services/authService";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ResetPassword = () => {
    const { setUser } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await requestPasswordReset(form.email);
            setEmailSent(true);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send reset email.");
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.newPassword !== form.confirmNewPassword) {
            setError("Passwords do not much.");
            setLoading(false);

            return;
        }

        try {
            await resetPassword( { token, newPassword: form.newPassword});
            setUser(null);
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Password reset failed.");
            setLoading(false);
        }
    };

    return (
        <div>
            {!token && !emailSent ? (
                <form action="" onSubmit={handleRequestReset}>
                    <h2>Request Password Reset</h2>
                    {error && <p>{error}</p>}
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            ) : !token && emailSent ? (
                <div>
                    <h2>Check Your Email</h2>
                    <p>A password reset link has been sent to {form.email}.</p>
                </div>
            ) : (
                <form action="" onSubmit={handleResetPassword}>
                    <h2>Reset Password</h2>
                    {error && <p>{error}</p>}
                    <Input
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        name="confirmNewPassword"
                        value={form.confirmNewPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            )};
        </div>
    );
};

export default ResetPassword;