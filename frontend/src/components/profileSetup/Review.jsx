import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/authService";

function Review() {
    const navigate = useNavigate();
    const { profileData, setProfileData } = useContext(ProfileContext);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateProfile = () => {
        const requiredFields = [
            { key: "personal.username", label: "Username" },
            { key: "personal.birthDate", label: "Birthdate" },
            { key: "personal.gender", label: "Gender" },
            { key: "personal.contactNumber", label: "Contact Number" },
            { key: "address", label: "Address" },
        ];
        const missing = requiredFields
            .filter(
                ({ key }) =>
                    !key.split(".").reduce((obj, k) => obj?.[k], profileData)
            )
            .map(({ label }) => label);
        if (
            !profileData.education.some((edu) =>
                [
                    "highSchool",
                    "associate",
                    "bachelor",
                    "master",
                    "doctorate",
                ].includes(edu.educationLevel)
            )
        ) {
            missing.push("High School Education or higher");
        }
        return missing.length
            ? `Please provide: ${missing.join(", ")} to submit for review.`
            : "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const validationError = validateProfile();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            await updateProfile({ profileStatus: "pending" });
            setProfileData({ ...profileData, profileStatus: "pending" });
            navigate("/user", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to submit profile for review.");
            setLoading(false);
        }
    };

    const handleStepClick = (step) =>
        navigate(`/profile-setup/step${step}`, { replace: true });

    const Section = ({ title, data, step, children }) => (
        <div className="border p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-700">{title}</h4>
                <button
                    onClick={() => handleStepClick(step)}
                    className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition duration-200 cursor-pointer"
                >
                    Edit
                </button>
            </div>
            {children}
        </div>
    );

    return (
        <div className="w-full max-w-lg">
            <div className="rounded-xl p-8 border border-gray-100">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {[1, 2, 3, 4].map((step) => (
                            <div
                                key={step}
                                className="flex-1 text-center cursor-pointer"
                                onClick={() => handleStepClick(step)}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-auto transition duration-200 ${
                                        step === 4
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                                >
                                    {step}
                                </div>
                                <p className="text-xs mt-2">
                                    {
                                        [
                                            "Personal Info",
                                            "Education",
                                            "Certificates",
                                            "Review",
                                        ][step - 1]
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-full"></div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Review Your Profile
                </h3>
                {error && (
                    <p className="text-red-500 text-sm text-center mb-6">
                        {error}
                    </p>
                )}
                <div className="space-y-6">
                    <Section
                        title="Personal Info"
                        data={profileData.personal}
                        step={1}
                    >
                        {[
                            "username",
                            "birthDate",
                            "gender",
                            "contactNumber",
                        ].map((key) => (
                            <p key={key} className="text-sm text-gray-600">
                                {key
                                    .replace(/([A-Z])/g, " $1")
                                    .replace(/^./, (str) => str.toUpperCase())}
                                : {profileData.personal[key] || "Not provided"}
                            </p>
                        ))}
                        <p className="text-sm text-gray-600">
                            Address: {profileData.address || "Not provided"}
                        </p>
                    </Section>
                    <Section
                        title="Education"
                        data={profileData.education}
                        step={2}
                    >
                        {profileData.education.length ? (
                            profileData.education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    {[
                                        "educationLevel",
                                        "schoolName",
                                        "yearGraduated",
                                    ].map((key) => (
                                        <p
                                            key={key}
                                            className="text-sm text-gray-600"
                                        >
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) =>
                                                    str.toUpperCase()
                                                )}
                                            : {edu[key] || "Not provided"}
                                        </p>
                                    ))}
                                    <p className="text-sm text-gray-600">
                                        Proof:{" "}
                                        {edu.proof
                                            ? "Provided"
                                            : "Not provided"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">
                                Not provided
                            </p>
                        )}
                    </Section>
                    <Section
                        title="Certificates"
                        data={profileData.certificates}
                        step={3}
                    >
                        {profileData.certificates.length ? (
                            profileData.certificates.map((cert, index) => (
                                <div key={index} className="mb-2">
                                    {["name", "issuer", "date"].map((key) => (
                                        <p
                                            key={key}
                                            className="text-sm text-gray-600"
                                        >
                                            {key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) =>
                                                    str.toUpperCase()
                                                )}
                                            : {cert[key] || "Not provided"}
                                        </p>
                                    ))}
                                    <p className="text-sm text-gray-600">
                                        Proof:{" "}
                                        {cert.proof
                                            ? "Provided"
                                            : "Not provided"}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">
                                Not provided
                            </p>
                        )}
                    </Section>
                </div>
                <div className="pt-6 flex space-x-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Submitting..." : "Submit for Review"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/user", { replace: true })}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        Skip
                    </button>
                </div>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                    © 2025 FAST-C Digital Profiling System. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default Review;
