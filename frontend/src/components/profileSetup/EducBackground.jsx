import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/authService";

function EducBackground() {
    const navigate = useNavigate();
    const { profileData, setProfileData } = useContext(ProfileContext);
    const [education, setEducation] = useState(profileData.education || []);
    const [newEducation, setNewEducation] = useState({
        educationLevel: "",
        schoolName: "",
        yearGraduated: "",
        proof: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEducation({ ...newEducation, [name]: value });
        setError("");
    };

    const handleFileChange = (e) => {
        setNewEducation({ ...newEducation, proof: e.target.files[0] });
        setError("");
    };

    const handleAddEducation = () => {
        if (
            !newEducation.educationLevel ||
            !newEducation.schoolName ||
            !newEducation.yearGraduated
        ) {
            setError("Please fill in all education fields.");
            return;
        }
        setEducation([
            ...education,
            { ...newEducation, proof: newEducation.proof ? "new" : "" },
        ]);
        setNewEducation({
            educationLevel: "",
            schoolName: "",
            yearGraduated: "",
            proof: null,
        });
        setError("");
    };

    const handleRemoveEducation = (index) => {
        setEducation(education.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const proofs = education
                .filter((edu) => edu.proof === "new")
                .map((edu) => edu.proof);
            await updateProfile({ education, proofs });

            setProfileData({
                ...profileData,
                education: education.map((edu) => ({
                    ...edu,
                    proof:
                        edu.proof === "new"
                            ? URL.createObjectURL(edu.proof)
                            : edu.proof,
                })),
            });

            navigate("/profile-setup/step3", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to save education details.");
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/profile-setup/step3", { replace: true });
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
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mx-auto hover:bg-gray-300 transition duration-200">
                                1
                            </div>
                            <p className="text-xs mt-2">Personal Info</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(2)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white mx-auto hover:bg-blue-700 transition duration-200">
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
                        <div className="bg-blue-600 h-1 rounded-full w-2/4"></div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Educational Background
                </h3>
                {error && (
                    <p className="text-red-500 text-sm text-center mb-6">
                        {error}
                    </p>
                )}
                <div className="space-y-5">
                    <div className=" p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-700 mb-4">
                            Add New Education
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="educationLevel"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Education Level
                                </label>
                                <select
                                    id="educationLevel"
                                    name="educationLevel"
                                    value={newEducation.educationLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                >
                                    <option value="">
                                        Select Education Level
                                    </option>
                                    <option value="highSchool">
                                        High School
                                    </option>
                                    <option value="associate">
                                        Associate Degree
                                    </option>
                                    <option value="bachelor">
                                        Bachelor's Degree
                                    </option>
                                    <option value="master">
                                        Master's Degree
                                    </option>
                                    <option value="doctorate">Doctorate</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="schoolName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    School Name
                                </label>
                                <input
                                    id="schoolName"
                                    name="schoolName"
                                    type="text"
                                    value={newEducation.schoolName}
                                    onChange={handleChange}
                                    placeholder="Enter school name"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="yearGraduated"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Year Graduated
                                </label>
                                <input
                                    id="yearGraduated"
                                    name="yearGraduated"
                                    type="number"
                                    value={newEducation.yearGraduated}
                                    onChange={handleChange}
                                    placeholder="e.g., 2020"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="proof"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Education Proof (JPEG/PNG/PDF)
                                </label>
                                <input
                                    id="proof"
                                    name="proof"
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddEducation}
                                className="w-full py-3 px-4 rounded-lg cursor-pointer text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            >
                                Add Education
                            </button>
                        </div>
                    </div>

                    {education.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-700">
                                Added Education
                            </h4>
                            {education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="border p-4 rounded-lg flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {edu.educationLevel}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            School: {edu.schoolName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Year: {edu.yearGraduated}
                                        </p>
                                        {edu.proof && (
                                            <p className="text-sm text-blue-600">
                                                Proof:{" "}
                                                {typeof edu.proof === "string"
                                                    ? edu.proof
                                                    : "Uploaded"}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveEducation(index)
                                        }
                                        className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="pt-6 flex space-x-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
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
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                    © 2025 FAST-C Digital Profiling System. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default EducBackground;
