import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/profilingService";
import { Award, Camera, CheckCircle, Shield } from "react-feather";
import FacialRecognitionModal from "../../components/user/FacialRecognitionModal";

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        birthdate: "",
        gender: "",
        contactNumber: "",
        address: "",
        education: [
            {
                educationLevel: "",
                schoolName: "",
                yearGraduated: "",
                proof: null,
            },
        ],
        certificates: [
            {
                name: "",
                issuer: "",
                date: "",
                expiration: "",
                proof: null,
            },
        ],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFaceModal, setShowFaceModal] = useState(false);
    const [faceEnrolled, setFaceEnrolled] = useState(false);
    const [faceEnrollmentSuccess, setFaceEnrollmentSuccess] = useState(false);

    // Handle basic form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    // Handle education array changes
    const handleEducationChange = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            education: prev.education.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            ),
        }));
        setError("");
    };

    // Handle certificate array changes
    const handleCertificateChange = (index, field, value) => {
        setForm((prev) => ({
            ...prev,
            certificates: prev.certificates.map((cert, i) =>
                i === index ? { ...cert, [field]: value } : cert
            ),
        }));
        setError("");
    };

    // Handle file uploads
    const handleFileChange = (e, type, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((prev) => ({
            ...prev,
            [type]: prev[type].map((item, i) =>
                i === index ? { ...item, proof: file } : item
            ),
        }));
        setError("");
    };

    // Add/remove education entries
    const addEducation = () => {
        setForm((prev) => ({
            ...prev,
            education: [
                ...prev.education,
                {
                    educationLevel: "",
                    schoolName: "",
                    yearGraduated: "",
                    proof: null,
                },
            ],
        }));
    };

    const removeEducation = (index) => {
        setForm((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index),
        }));
    };

    // Add/remove certificate entries
    const addCertificate = () => {
        setForm((prev) => ({
            ...prev,
            certificates: [
                ...prev.certificates,
                { name: "", issuer: "", date: "", expiration: "", proof: null },
            ],
        }));
    };

    const removeCertificate = (index) => {
        setForm((prev) => ({
            ...prev,
            certificates: prev.certificates.filter((_, i) => i !== index),
        }));
    };

    // Face enrollment handlers
    const handleFaceEnrollment = () => {
        setShowFaceModal(true);
    };

    const handleFaceEnrollmentSuccess = () => {
        setFaceEnrolled(true);
        setFaceEnrollmentSuccess(true);
        setShowFaceModal(false);
        setTimeout(() => {
            setStep(4);
            setFaceEnrollmentSuccess(false);
        }, 1500);
    };

    const handleSkipFaceEnrollment = () => {
        setStep(4);
    };

    // Validation
    const validateStep = () => {
        const errors = [];

        if (step === 1) {
            if (!form.birthdate) errors.push("Birthdate");
            if (!form.gender) errors.push("Gender");
            if (!form.contactNumber) errors.push("Contact Number");
            if (!form.address) errors.push("Address");
        } else if (step === 2) {
            const hasValidEducation = form.education.some(
                (edu) =>
                    edu.educationLevel && edu.schoolName && edu.yearGraduated
            );
            if (!hasValidEducation) {
                errors.push("At least one complete education entry");
            }
        }

        return errors;
    };

    const handleNext = () => {
        const errors = validateStep();
        if (errors.length > 0) {
            setError(`Please complete: ${errors.join(", ")}`);
            return;
        }
        setStep(step + 1);
        setError("");
    };

    const handleBack = () => {
        setStep(step - 1);
        setError("");
    };

    // Skip profile setup - redirect to dashboard
    const handleSkip = () => {
        const redirectPath = user?.role === "company" ? "/company" : "/user";
        navigate(redirectPath, { replace: true });
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const files = [];
            const educationData = [];
            const certificatesData = [];

            form.education.forEach((edu) => {
                if (edu.educationLevel && edu.schoolName && edu.yearGraduated) {
                    const educationItem = {
                        educationLevel: edu.educationLevel,
                        schoolName: edu.schoolName,
                        yearGraduated: edu.yearGraduated,
                        proof: edu.proof ? "new" : undefined,
                    };
                    educationData.push(educationItem);
                    if (edu.proof) files.push(edu.proof);
                }
            });

            form.certificates.forEach((cert) => {
                if (cert.name && cert.issuer && cert.date) {
                    const certificateItem = {
                        name: cert.name,
                        issuer: cert.issuer,
                        date: cert.date,
                        expiration: cert.expiration || undefined,
                        proof: cert.proof ? "new" : undefined,
                    };
                    certificatesData.push(certificateItem);
                    if (cert.proof) files.push(cert.proof);
                }
            });

            const updatedUser = await updateProfile({
                birthdate: form.birthdate,
                gender: form.gender,
                contactNumber: form.contactNumber,
                address: form.address,
                education: educationData,
                certificates: certificatesData,
                files: files,
            });

            setUser(updatedUser);
            const redirectPath =
                user?.role === "company" ? "/company" : "/user";
            navigate(redirectPath, { replace: true });
        } catch (error) {
            setError(
                error.message || "Failed to save profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Complete Your Profile
                    </h3>
                    <p className="text-gray-600 text-sm">Step {step} of 4</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-center mb-8 space-x-1">
                    {[1, 2, 3, 4].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`h-2 w-12 rounded-full transition-all duration-300 ${
                                step >= stepNum ? "bg-blue-600" : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm text-center">
                            {error}
                        </p>
                    </div>
                )}

                {/* Success Message for Face Enrollment */}
                {faceEnrollmentSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-800 justify-center">
                            <CheckCircle size={16} className="mr-2" />
                            <span className="text-sm font-medium">
                                Face verification complete!
                            </span>
                        </div>
                    </div>
                )}

                {/* Form Steps */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="text-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Personal Information
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Let's start with the basics
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Birthdate
                                </label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={form.birthdate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-pointer"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Contact Number
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="+63 912 345 6789"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your complete address"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                            >
                                Continue to Education
                            </button>
                        </div>
                    )}

                    {/* Step 2: Education */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="text-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Education Background
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Tell us about your education
                                </p>
                            </div>

                            {form.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-700">
                                            Education #{index + 1}
                                        </h5>
                                        {form.education.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeEducation(index)
                                                }
                                                className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Education Level
                                        </label>
                                        <select
                                            value={edu.educationLevel}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "educationLevel",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-pointer"
                                        >
                                            <option value="">
                                                Select Level
                                            </option>
                                            <option value="High School">
                                                High School
                                            </option>
                                            <option value="Senior High School">
                                                Senior High School
                                            </option>
                                            <option value="College">
                                                College
                                            </option>
                                            <option value="Vocational">
                                                Vocational
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            School Name
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.schoolName}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "schoolName",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter school name"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Year Graduated
                                        </label>
                                        <input
                                            type="text"
                                            value={edu.yearGraduated}
                                            onChange={(e) =>
                                                handleEducationChange(
                                                    index,
                                                    "yearGraduated",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., 2020"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Proof Document
                                        </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e,
                                                    "education",
                                                    index
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {edu.proof && (
                                            <p className="text-sm text-green-600 mt-1">
                                                File selected: {edu.proof.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addEducation}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition duration-200 cursor-pointer"
                            >
                                + Add Another Education
                            </button>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                                >
                                    Continue to Face Verification
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Face Verification - MINIMALIST */}
                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                                        <Shield
                                            size={40}
                                            className="text-blue-600"
                                        />
                                    </div>
                                </div>

                                {/* Minimal Text */}
                                <h4 className="text-2xl font-bold text-gray-900 mb-3">
                                    Face Verification
                                </h4>
                                <p className="text-gray-600 mb-6">
                                    Required for course attendance tracking
                                </p>

                                {/* Quick Tips */}
                                <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 mb-6">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Good lighting
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        Face centered
                                    </div>
                                </div>

                                {/* Primary CTA */}
                                <button
                                    type="button"
                                    onClick={handleFaceEnrollment}
                                    className="w-full py-4 px-6 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl mb-4 cursor-pointer"
                                >
                                    <Camera size={20} className="mr-3" />
                                    Start Face Verification
                                </button>

                                {/* Navigation */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 cursor-pointer"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSkipFaceEnrollment}
                                        className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 cursor-pointer"
                                    >
                                        Skip for Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Certificates */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <div className="text-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Certificates & Training
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Add any relevant certificates or training
                                </p>
                            </div>

                            {form.certificates.map((cert, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 space-y-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-700">
                                            Certificate #{index + 1}
                                        </h5>
                                        {form.certificates.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCertificate(index)
                                                }
                                                className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Certificate Name
                                        </label>
                                        <input
                                            type="text"
                                            value={cert.name}
                                            onChange={(e) =>
                                                handleCertificateChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Web Development Certificate"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Issuing Organization
                                        </label>
                                        <input
                                            type="text"
                                            value={cert.issuer}
                                            onChange={(e) =>
                                                handleCertificateChange(
                                                    index,
                                                    "issuer",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., FAST-C Training Center"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Date Issued
                                        </label>
                                        <input
                                            type="date"
                                            value={cert.date}
                                            onChange={(e) =>
                                                handleCertificateChange(
                                                    index,
                                                    "date",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Expiration Date
                                        </label>
                                        <input
                                            type="date"
                                            value={cert.expiration}
                                            onChange={(e) =>
                                                handleCertificateChange(
                                                    index,
                                                    "expiration",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                            Proof Document
                                        </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    e,
                                                    "certificates",
                                                    index
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {cert.proof && (
                                            <p className="text-sm text-green-600 mt-1">
                                                File selected: {cert.proof.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addCertificate}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition duration-200 cursor-pointer"
                            >
                                + Add Another Certificate
                            </button>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center cursor-wait">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        "Complete Profile"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Skip Profile Setup Button */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-sm text-gray-500 hover:text-gray-700 underline transition duration-200 cursor-pointer"
                    >
                        Skip profile setup for now
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        You can complete your profile later from your dashboard
                    </p>
                </div>
            </div>

            {/* Face Enrollment Modal */}
            <FacialRecognitionModal
                isOpen={showFaceModal}
                onClose={() => setShowFaceModal(false)}
                onSuccess={handleFaceEnrollmentSuccess}
                courseId={null}
                lessonId={null}
                courseTitle="Profile Setup"
                lessonTitle="Face Verification"
                isEnrollment={true}
            />
        </div>
    );
};

export default ProfileSetup;
