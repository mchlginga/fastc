import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../services/authService";
import {
    User,
    Calendar,
    Phone,
    MapPin,
    Upload,
    X,
    FileText,
    CheckCircle,
    AlertCircle,
} from "react-feather";

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        birthdate: "",
        gender: "",
        contactNumber: "",
        address: "",
        availability: "N/A",
        educations: [],
        certificates: [],
    });

    const [educationFiles, setEducationFiles] = useState({});
    const [certificateFiles, setCertificateFiles] = useState({});

    const steps = [
        { number: 1, title: "Personal Info" },
        { number: 2, title: "Education" },
        { number: 3, title: "Certificates" },
    ];

    const educationLevels = ["High School", "Senior High School"];

    const availabilityOptions = ["Full-time", "Part-time", "N/A"];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Education handlers
    const addEducation = () => {
        const newId = Date.now();
        setFormData((prev) => ({
            ...prev,
            educations: [
                ...prev.educations,
                { id: newId, level: "", school: "", year: "" },
            ],
        }));
        setEducationFiles((prev) => ({ ...prev, [newId]: [] }));
    };

    const updateEducation = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            educations: prev.educations.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (id) => {
        setFormData((prev) => ({
            ...prev,
            educations: prev.educations.filter((edu) => edu.id !== id),
        }));
        setEducationFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[id];
            return newFiles;
        });
    };

    const handleEducationFiles = (id, files) => {
        const fileArray = Array.from(files);
        setEducationFiles((prev) => ({
            ...prev,
            [id]: [...(prev[id] || []), ...fileArray],
        }));
    };

    const removeEducationFile = (eduId, fileIndex) => {
        setEducationFiles((prev) => ({
            ...prev,
            [eduId]: prev[eduId].filter((_, idx) => idx !== fileIndex),
        }));
    };

    // Certificate handlers
    const addCertificate = () => {
        const newId = Date.now();
        setFormData((prev) => ({
            ...prev,
            certificates: [
                ...prev.certificates,
                { id: newId, name: "", issuer: "", date: "" },
            ],
        }));
        setCertificateFiles((prev) => ({ ...prev, [newId]: [] }));
    };

    const updateCertificate = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            certificates: prev.certificates.map((cert) =>
                cert.id === id ? { ...cert, [field]: value } : cert
            ),
        }));
    };

    const removeCertificate = (id) => {
        setFormData((prev) => ({
            ...prev,
            certificates: prev.certificates.filter((cert) => cert.id !== id),
        }));
        setCertificateFiles((prev) => {
            const newFiles = { ...prev };
            delete newFiles[id];
            return newFiles;
        });
    };

    const handleCertificateFiles = (id, files) => {
        const fileArray = Array.from(files);
        setCertificateFiles((prev) => ({
            ...prev,
            [id]: [...(prev[id] || []), ...fileArray],
        }));
    };

    const removeCertificateFile = (certId, fileIndex) => {
        setCertificateFiles((prev) => ({
            ...prev,
            [certId]: prev[certId].filter((_, idx) => idx !== fileIndex),
        }));
    };

    // Navigation
    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const submitData = new FormData();

            // Basic fields
            Object.keys(formData).forEach((key) => {
                if (key !== "educations" && key !== "certificates") {
                    submitData.append(key, formData[key]);
                }
            });

            // Process educations
            const educationsData = formData.educations.map((edu) => {
                const fileCount = educationFiles[edu.id]?.length || 0;
                return {
                    level: edu.level,
                    school: edu.school,
                    year: edu.year,
                    files: Array(fileCount).fill("new"),
                };
            });
            submitData.append("educations", JSON.stringify(educationsData));

            // Process certificates
            const certificatesData = formData.certificates.map((cert) => {
                const fileCount = certificateFiles[cert.id]?.length || 0;
                return {
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date,
                    files: Array(fileCount).fill("new"),
                };
            });
            submitData.append("certificates", JSON.stringify(certificatesData));

            // Append education files
            formData.educations.forEach((edu) => {
                const files = educationFiles[edu.id] || [];
                files.forEach((file) => {
                    submitData.append("proofs", file);
                });
            });

            // Append certificate files
            formData.certificates.forEach((cert) => {
                const files = certificateFiles[cert.id] || [];
                files.forEach((file) => {
                    submitData.append("proofs", file);
                });
            });

            await updateProfile(submitData);
            setSuccess("Profile updated successfully!");
            setTimeout(() => navigate("/user"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-600">
                        Let's get to know you better
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-8 ">
                    {steps.map((step) => (
                        <div key={step.number} className="flex-1 relative">
                            <div className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                                        currentStep >= step.number
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {currentStep > step.number ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        step.number
                                    )}
                                </div>
                                {step.number < steps.length && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition ${
                                            currentStep > step.number
                                                ? "bg-blue-600"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                )}
                            </div>
                            <p className="text-xs mt-2 text-gray-600 font-medium">
                                {step.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <User
                                        size={24}
                                        className="mr-2 text-blue-600"
                                    />
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username *
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Choose a unique username"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Birthdate *
                                        </label>
                                        <div className="relative">
                                            <Calendar
                                                size={18}
                                                className="absolute left-3 top-3.5 text-gray-400"
                                            />
                                            <input
                                                type="date"
                                                name="birthdate"
                                                value={formData.birthdate}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender *
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Number *
                                        </label>
                                        <div className="relative">
                                            <Phone
                                                size={18}
                                                className="absolute left-3 top-3.5 text-gray-400"
                                            />
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="09XX XXX XXXX"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin
                                            size={18}
                                            className="absolute left-3 top-3.5 text-gray-400"
                                        />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows="3"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Complete address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Availability
                                    </label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {availabilityOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Education */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                        <FileText
                                            size={24}
                                            className="mr-2 text-blue-600"
                                        />
                                        Education Background
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addEducation}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        + Add Education
                                    </button>
                                </div>

                                {formData.educations.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <FileText
                                            size={48}
                                            className="mx-auto text-gray-400 mb-3"
                                        />
                                        <p className="text-gray-600 mb-4">
                                            No education added yet
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addEducation}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            Add Your First Education
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {formData.educations.map(
                                            (edu, index) => (
                                                <div
                                                    key={edu.id}
                                                    className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50 relative"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeEducation(
                                                                edu.id
                                                            )
                                                        }
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <X size={20} />
                                                    </button>

                                                    <h3 className="font-semibold text-gray-700 mb-4">
                                                        Education #{index + 1}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Level *
                                                            </label>
                                                            <select
                                                                value={
                                                                    edu.level
                                                                }
                                                                onChange={(e) =>
                                                                    updateEducation(
                                                                        edu.id,
                                                                        "level",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">
                                                                    Select Level
                                                                </option>
                                                                {educationLevels.map(
                                                                    (level) => (
                                                                        <option
                                                                            key={
                                                                                level
                                                                            }
                                                                            value={
                                                                                level
                                                                            }
                                                                        >
                                                                            {
                                                                                level
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                School/Institution
                                                                *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    edu.school
                                                                }
                                                                onChange={(e) =>
                                                                    updateEducation(
                                                                        edu.id,
                                                                        "school",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="School name"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Year Completed *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={edu.year}
                                                                onChange={(e) =>
                                                                    updateEducation(
                                                                        edu.id,
                                                                        "year",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="e.g., 2020"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* File Upload Section */}
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Upload Proof
                                                            (Diploma,
                                                            Transcript, etc.)
                                                        </label>
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                                                                <Upload
                                                                    size={18}
                                                                    className="mr-2 text-blue-600"
                                                                />
                                                                <span className="text-sm text-gray-600">
                                                                    Choose files
                                                                </span>
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleEducationFiles(
                                                                            edu.id,
                                                                            e
                                                                                .target
                                                                                .files
                                                                        )
                                                                    }
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Display uploaded files */}
                                                        {educationFiles[edu.id]
                                                            ?.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                {educationFiles[
                                                                    edu.id
                                                                ].map(
                                                                    (
                                                                        file,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <FileText
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                    className="text-blue-600 mr-2"
                                                                                />
                                                                                <span className="text-sm text-gray-700">
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </span>
                                                                                <span className="text-xs text-gray-500 ml-2">
                                                                                    (
                                                                                    {(
                                                                                        file.size /
                                                                                        1024
                                                                                    ).toFixed(
                                                                                        1
                                                                                    )}{" "}
                                                                                    KB)
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeEducationFile(
                                                                                        edu.id,
                                                                                        idx
                                                                                    )
                                                                                }
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Certificates */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                                        <FileText
                                            size={24}
                                            className="mr-2 text-blue-600"
                                        />
                                        Certificates & Training
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addCertificate}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        + Add Certificate
                                    </button>
                                </div>

                                {formData.certificates.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <FileText
                                            size={48}
                                            className="mx-auto text-gray-400 mb-3"
                                        />
                                        <p className="text-gray-600 mb-4">
                                            No certificates added yet
                                        </p>
                                        <button
                                            type="button"
                                            onClick={addCertificate}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                        >
                                            Add Your First Certificate
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {formData.certificates.map(
                                            (cert, index) => (
                                                <div
                                                    key={cert.id}
                                                    className="p-6 border-2 border-gray-200 rounded-xl bg-gray-50 relative"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeCertificate(
                                                                cert.id
                                                            )
                                                        }
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
                                                    >
                                                        <X size={20} />
                                                    </button>

                                                    <h3 className="font-semibold text-gray-700 mb-4">
                                                        Certificate #{index + 1}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Certificate Name
                                                                *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    cert.name
                                                                }
                                                                onChange={(e) =>
                                                                    updateCertificate(
                                                                        cert.id,
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="e.g., TESDA NC II"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Issuing
                                                                Organization *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    cert.issuer
                                                                }
                                                                onChange={(e) =>
                                                                    updateCertificate(
                                                                        cert.id,
                                                                        "issuer",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                placeholder="e.g., TESDA"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Date Issued *
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={
                                                                    cert.date
                                                                }
                                                                onChange={(e) =>
                                                                    updateCertificate(
                                                                        cert.id,
                                                                        "date",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                required
                                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* File Upload Section */}
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Upload Certificate
                                                            Files
                                                        </label>
                                                        <div className="flex items-center gap-3">
                                                            <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                                                                <Upload
                                                                    size={18}
                                                                    className="mr-2 text-blue-600"
                                                                />
                                                                <span className="text-sm text-gray-600">
                                                                    Choose files
                                                                </span>
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleCertificateFiles(
                                                                            cert.id,
                                                                            e
                                                                                .target
                                                                                .files
                                                                        )
                                                                    }
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Display uploaded files */}
                                                        {certificateFiles[
                                                            cert.id
                                                        ]?.length > 0 && (
                                                            <div className="mt-3 space-y-2">
                                                                {certificateFiles[
                                                                    cert.id
                                                                ].map(
                                                                    (
                                                                        file,
                                                                        idx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <FileText
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                    className="text-blue-600 mr-2"
                                                                                />
                                                                                <span className="text-sm text-gray-700">
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </span>
                                                                                <span className="text-xs text-gray-500 ml-2">
                                                                                    (
                                                                                    {(
                                                                                        file.size /
                                                                                        1024
                                                                                    ).toFixed(
                                                                                        1
                                                                                    )}{" "}
                                                                                    KB)
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeCertificateFile(
                                                                                        cert.id,
                                                                                        idx
                                                                                    )
                                                                                }
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                <AlertCircle
                                    size={20}
                                    className="text-red-600 mr-3"
                                />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                <CheckCircle
                                    size={20}
                                    className="text-green-600 mr-3"
                                />
                                <p className="text-green-700">{success}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-medium transition ${
                                    currentStep === 1
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                }`}
                            >
                                Previous
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading
                                        ? "Submitting..."
                                        : "Complete Profile"}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
