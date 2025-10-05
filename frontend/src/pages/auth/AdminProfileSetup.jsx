import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { checkUsername, updateProfile } from "../../services/authService";
import { Award, User, Briefcase, Phone, Upload } from "react-feather";

const AdminProfileSetup = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [form, setForm] = useState({
        username: "",
        position: "",
        contactNumber: "",
        idProof: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, idProof: e.target.files[0] }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const missing = [];
        if (!form.username) missing.push("Username");
        if (!form.position) missing.push("Position/Role");
        if (!form.contactNumber) missing.push("Contact Number");

        if (missing.length > 0) {
            setError(`Please provide: ${missing.join(", ")}.`);
            setLoading(false);
            return;
        }

        try {
            const { available } = await checkUsername(form.username);
            if (!available) {
                setError("Username is already taken.");
                setLoading(false);
                return;
            }

            await updateProfile({
                username: form.username,
                position: form.position,
                contactNumber: form.contactNumber,
                idProof: form.idProof,
                profileStatus: "pending",
            });

            navigate("/pending-approval", { replace: true });
        } catch (err) {
            setError(err.message || "Failed to save profile.");
            setLoading(false);
        }
    };

    const handleSkip = () => navigate("/admin", { replace: true });

    if (!user || (user.role !== "admin" && user.role !== "superAdmin")) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg">
                Invalid user or role. Redirecting...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    Admin Profile Setup
                </h3>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <div className="relative">
                            <User
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* Position */}
                    <div>
                        <label
                            htmlFor="position"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Position/Role
                        </label>
                        <div className="relative">
                            <Briefcase
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <select
                                id="position"
                                name="position"
                                value={form.position}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                            >
                                <option value="">Select Position</option>
                                <option value="System Admin">
                                    System Admin
                                </option>
                                <option value="FAST-C Officer">
                                    FAST-C Officer
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label
                            htmlFor="contactNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Contact Number
                        </label>
                        <div className="relative">
                            <Phone
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                value={form.contactNumber}
                                onChange={handleChange}
                                placeholder="+63 912 345 6789"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                        </div>
                    </div>

                    {/* ID Upload */}
                    <div>
                        <label
                            htmlFor="idProof"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            ID Proof (Optional, JPEG/PNG/PDF)
                        </label>
                        <div className="relative">
                            <Upload
                                size={20}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="idProof"
                                name="idProof"
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={handleFileChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition duration-200 cursor-pointer"
                        >
                            {loading ? "Saving..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                © 2025 FAST-C Digital Profiling System. All rights reserved.
            </div>
        </div>
    );
};

export default AdminProfileSetup;
