import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import { checkUsername, updateProfile } from "../../services/authService";

function PersonalInfo() {
    const navigate = useNavigate();
    const { profileData, setProfileData } = useContext(ProfileContext);
    const [form, setForm] = useState({
        username: profileData.personal.username || "",
        birthdate: profileData.personal.birthDate || "",
        gender: profileData.personal.gender || "",
        contactNumber: profileData.personal.contactNumber || "",
        address: profileData.address || "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validate all fields
        const missingFields = [];
        if (!form.username) missingFields.push("Username");
        if (!form.birthdate) missingFields.push("Birthdate");
        if (!form.gender) missingFields.push("Gender");
        if (!form.contactNumber) missingFields.push("Contact Number");
        if (!form.address) missingFields.push("Address");

        if (missingFields.length > 0) {
            setError(`Please provide: ${missingFields.join(", ")}.`);
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
                birthdate: form.birthdate,
                gender: form.gender,
                contactNumber: form.contactNumber,
                address: form.address,
            });

            setProfileData({
                ...profileData,
                personal: {
                    ...profileData.personal,
                    username: form.username,
                    birthDate: form.birthdate,
                    gender: form.gender,
                    contactNumber: form.contactNumber,
                },
                address: form.address,
            });

            navigate("/profile-setup/step2", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to save profile.");
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/profile-setup/step2", { replace: true });
    };

    const handleStepClick = (step) => {
        navigate(`/profile-setup/step${step}`, { replace: true });
    };

    return (
        <div className="w-full max-w-lg">
            <div className="rounded-xl p-8 border border-gray-100">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(1)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white mx-auto hover:bg-blue-700 transition duration-200">
                                1
                            </div>
                            <p className="text-xs mt-2">Personal Info</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(2)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mx-auto hover:bg-gray-300 transition duration-200">
                                2
                            </div>
                            <p className="text-xs mt-2">Education</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(3)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mx-auto hover:bg-gray-300 transition duration-200">
                                3
                            </div>
                            <p className="text-xs mt-2">Certificates</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(4)}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mx-auto hover:bg-gray-300 transition duration-200">
                                4
                            </div>
                            <p className="text-xs mt-2">Review</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-1/4"></div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Personal Information
                </h3>
                {error && (
                    <p className="text-red-500 text-sm text-center mb-6">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="birthdate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Birthdate
                        </label>
                        <input
                            id="birthdate"
                            name="birthdate"
                            type="date"
                            value={form.birthdate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="gender"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="contactNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Contact Number
                        </label>
                        <input
                            id="contactNumber"
                            name="contactNumber"
                            type="tel"
                            value={form.contactNumber}
                            onChange={handleChange}
                            required
                            placeholder="+63 912 345 6789"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter your address"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                        />
                    </div>
                    <div className="pt-4 flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Saving..." : "Next"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSkip}
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                    © 2025 FAST-C Digital Profiling System. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default PersonalInfo;
