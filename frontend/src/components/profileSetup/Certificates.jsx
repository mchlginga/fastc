import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/authService";

function Certificates() {
    const navigate = useNavigate();
    const { profileData, setProfileData } = useContext(ProfileContext);
    const [certificates, setCertificates] = useState(
        profileData.certificates || []
    );
    const [newCertificate, setNewCertificate] = useState({
        name: "",
        issuer: "",
        date: "",
        proof: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCertificate({ ...newCertificate, [name]: value });
        setError("");
    };

    const handleFileChange = (e) => {
        setNewCertificate({ ...newCertificate, proof: e.target.files[0] });
        setError("");
    };

    const handleAddCertificate = () => {
        if (
            !newCertificate.name ||
            !newCertificate.issuer ||
            !newCertificate.date
        ) {
            setError("Please fill in all certificate fields.");
            return;
        }
        setCertificates([
            ...certificates,
            { ...newCertificate, proof: newCertificate.proof ? "new" : "" },
        ]);
        setNewCertificate({ name: "", issuer: "", date: "", proof: null });
        setError("");
    };

    const handleRemoveCertificate = (index) => {
        setCertificates(certificates.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const proofs = certificates
                .filter((cert) => cert.proof === "new")
                .map((cert) => cert.proof);
            await updateProfile({ certificates, proofs });

            setProfileData({
                ...profileData,
                certificates: certificates.map((cert) => ({
                    ...cert,
                    proof:
                        cert.proof === "new"
                            ? URL.createObjectURL(cert.proof)
                            : cert.proof,
                })),
            });

            navigate("/profile-setup/step4", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to save certificates.");
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/profile-setup/step4", { replace: true });
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
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mx-auto hover:bg-gray-300 transition duration-200">
                                2
                            </div>
                            <p className="text-xs mt-2">Education</p>
                        </div>
                        <div
                            className="flex-1 text-center cursor-pointer"
                            onClick={() => handleStepClick(3)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white mx-auto hover:bg-blue-700 transition duration-200">
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
                        <div className="bg-blue-600 h-1 rounded-full w-3/4"></div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Certificates
                </h3>
                {error && (
                    <p className="text-red-500 text-sm text-center mb-6">
                        {error}
                    </p>
                )}
                <div className="space-y-5">
                    <div className="p-4 rounded-lg">
                        <h4 className="text-lg font-medium text-gray-700 mb-4">
                            Add New Certificate
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Certificate Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={newCertificate.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Cookery NC2"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="issuer"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Issuer
                                </label>
                                <input
                                    id="issuer"
                                    name="issuer"
                                    type="text"
                                    value={newCertificate.issuer}
                                    onChange={handleChange}
                                    placeholder="e.g., TESDA"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Date Issued
                                </label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={newCertificate.date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="proof"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Certificate Proof (Optional, JPEG/PNG/PDF)
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
                                onClick={handleAddCertificate}
                                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-green-600 cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            >
                                Add Certificate
                            </button>
                        </div>
                    </div>

                    {certificates.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium text-gray-700">
                                Added Certificates
                            </h4>
                            {certificates.map((cert, index) => (
                                <div
                                    key={index}
                                    className="border p-4 rounded-lg flex justify-between items-center"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {cert.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Issuer: {cert.issuer}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Date: {cert.date}
                                        </p>
                                        {cert.proof && (
                                            <p className="text-sm text-blue-600">
                                                Proof:{" "}
                                                {typeof cert.proof === "string"
                                                    ? cert.proof
                                                    : "Uploaded"}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveCertificate(index)
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

export default Certificates;
