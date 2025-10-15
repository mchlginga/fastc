import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { checkUsername, updateProfile } from "../../services/authService";
import {
    Award,
    User,
    Calendar,
    Phone,
    MapPin,
    Book,
    Upload,
    ArrowLeft,
    ArrowRight,
} from "react-feather";

function ProfileSetup() {
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log("ProfileSetup user:", user); // Debug: Log user object

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        username: "",
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
        certificates: [{ name: "", issuer: "", date: "", proof: null }],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...form.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setForm({ ...form, education: newEducation });
        setError("");
    };

    const handleCertificateChange = (index, field, value) => {
        const newCertificates = [...form.certificates];
        newCertificates[index] = { ...newCertificates[index], [field]: value };
        setForm({ ...form, certificates: newCertificates });
        setError("");
    };

    const handleFileChange = (e, type, index) => {
        const { files } = e.target;
        if (type === "education") {
            const newEducation = [...form.education];
            newEducation[index] = { ...newEducation[index], proof: files[0] };
            setForm({ ...form, education: newEducation });
        } else if (type === "certificate") {
            const newCertificates = [...form.certificates];
            newCertificates[index] = {
                ...newCertificates[index],
                proof: files[0],
            };
            setForm({ ...form, certificates: newCertificates });
        }
        setError("");
    };

    const addEducation = () => {
        setForm({
            ...form,
            education: [
                ...form.education,
                {
                    educationLevel: "",
                    schoolName: "",
                    yearGraduated: "",
                    proof: null,
                },
            ],
        });
    };

    const removeEducation = (index) => {
        setForm({
            ...form,
            education: form.education.filter((_, i) => i !== index),
        });
    };

    const addCertificate = () => {
        setForm({
            ...form,
            certificates: [
                ...form.certificates,
                { name: "", issuer: "", date: "", proof: null },
            ],
        });
    };

    const removeCertificate = (index) => {
        setForm({
            ...form,
            certificates: form.certificates.filter((_, i) => i !== index),
        });
    };

    const handleNext = () => {
        const missingFields = [];
        if (step === 1) {
            if (!form.username) missingFields.push("Username");
            if (!form.birthdate) missingFields.push("Birthdate");
            if (!form.gender) missingFields.push("Gender");
            if (!form.contactNumber) missingFields.push("Contact Number");
            if (!form.address) missingFields.push("Address");
        } else if (step === 2) {
            if (
                !form.education.some(
                    (edu) =>
                        edu.educationLevel &&
                        edu.schoolName &&
                        edu.yearGraduated
                )
            ) {
                missingFields.push("At least one complete Education entry");
            }
        }

        if (missingFields.length > 0) {
            setError(`Please provide: ${missingFields.join(", ")}.`);
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { available } = await checkUsername(form.username);
            if (!available) {
                setError("Username is already taken.");
                setLoading(false);
                return;
            }

            const cleanedEducation = form.education.filter(
                (edu) =>
                    edu.educationLevel && edu.schoolName && edu.yearGraduated
            );
            const cleanedCertificates = form.certificates.filter(
                (cert) => cert.name && cert.issuer && cert.date
            );

            const proofs = [
                ...cleanedEducation
                    .map((edu) => edu.proof)
                    .filter((proof) => proof),
                ...cleanedCertificates
                    .map((cert) => cert.proof)
                    .filter((proof) => proof),
            ];

            await updateProfile({
                username: form.username,
                birthdate: form.birthdate,
                gender: form.gender,
                contactNumber: form.contactNumber,
                address: form.address,
                education: cleanedEducation.map(
                    ({ educationLevel, schoolName, yearGraduated }) => ({
                        educationLevel,
                        schoolName,
                        yearGraduated,
                        proof: "new",
                    })
                ),
                certificates: cleanedCertificates.map(
                    ({ name, issuer, date }) => ({
                        name,
                        issuer,
                        date,
                        proof: "new",
                    })
                ),
                proofs,
                profileStatus: "pending",
            });

            navigate("/user", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to save profile.");
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate("/user", { replace: true });
    };

    if (!user || (user.role !== "user" && user.role !== "superAdmin")) {
        return <div>Invalid user or role. Redirecting...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {step === 1
                        ? "Personal Information"
                        : step === 2
                        ? "Education"
                        : "Certificates"}
                </h3>

                {/* Step Indicator */}
                <div className="flex justify-center mb-6 space-x-2">
                    <div
                        className={`h-2 w-20 rounded-full ${
                            step === 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    ></div>
                    <div
                        className={`h-2 w-20 rounded-full ${
                            step === 2 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    ></div>
                    <div
                        className={`h-2 w-20 rounded-full ${
                            step === 3 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    ></div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 transition-all duration-300"
                >
                    {step === 1 && (
                        <>
                            <h4 className="text-lg font-medium text-gray-800 mb-4">
                                Personal Information
                            </h4>
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
                                        required
                                        placeholder="Enter your username"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="birthdate"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Birthdate
                                </label>
                                <div className="relative">
                                    <Calendar
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        value={form.birthdate}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Gender
                                </label>
                                <div className="relative">
                                    <User
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none cursor-pointer"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
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
                                        required
                                        placeholder="+63 912 345 6789"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none "
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Address
                                </label>
                                <div className="relative">
                                    <MapPin
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your address"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200 cursor-pointer"
                                >
                                    Next <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h4 className="text-lg font-medium text-gray-800 mb-4">
                                Education
                            </h4>
                            {form.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="space-y-3 border-b pb-4 mb-4"
                                >
                                    <div>
                                        <label
                                            htmlFor={`educationLevel-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Education Level
                                        </label>
                                        <div className="relative">
                                            <Book
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <select
                                                id={`educationLevel-${index}`}
                                                value={edu.educationLevel}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "educationLevel",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            >
                                                <option value="">
                                                    Select Level
                                                </option>
                                                <option value="highSchool">
                                                    High School
                                                </option>
                                                <option value="senioHighSchool">
                                                    Senior High School
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`schoolName-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            School Name
                                        </label>
                                        <div className="relative">
                                            <Book
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 "
                                            />
                                            <input
                                                id={`schoolName-${index}`}
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
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700 focus:outline-none "
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`yearGraduated-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Year Graduated
                                        </label>
                                        <div className="relative">
                                            <Book
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`yearGraduated-${index}`}
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
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700focus:outline-none "
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`educationProof-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Proof (JPEG/PNG/PDF)
                                        </label>
                                        <div className="relative">
                                            <Upload
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`educationProof-${index}`}
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "education",
                                                        index
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    {form.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeEducation(index)
                                            }
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addEducation}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Add Education
                            </button>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200 cursor-pointer"
                                >
                                    Next <ArrowRight size={16} />
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h4 className="text-lg font-medium text-gray-800 mb-4">
                                Certificates (Optional)
                            </h4>
                            {form.certificates.map((cert, index) => (
                                <div
                                    key={index}
                                    className="space-y-3 border-b pb-4 mb-4"
                                >
                                    <div>
                                        <label
                                            htmlFor={`certificateName-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Certificate Name
                                        </label>
                                        <div className="relative">
                                            <Upload
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`certificateName-${index}`}
                                                type="text"
                                                value={cert.name}
                                                onChange={(e) =>
                                                    handleCertificateChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter certificate name"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`issuer-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Issuer
                                        </label>
                                        <div className="relative">
                                            <Upload
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`issuer-${index}`}
                                                type="text"
                                                value={cert.issuer}
                                                onChange={(e) =>
                                                    handleCertificateChange(
                                                        index,
                                                        "issuer",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter issuer"
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`certificateDate-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Date Issued
                                        </label>
                                        <div className="relative">
                                            <Calendar
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`certificateDate-${index}`}
                                                type="date"
                                                value={cert.date}
                                                onChange={(e) =>
                                                    handleCertificateChange(
                                                        index,
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`certificateProof-${index}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Proof (JPEG/PNG/PDF)
                                        </label>
                                        <div className="relative">
                                            <Upload
                                                size={20}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />
                                            <input
                                                id={`certificateProof-${index}`}
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "certificate",
                                                        index
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    {form.certificates.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCertificate(index)
                                            }
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCertificate}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Add Certificate
                            </button>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                >
                                    {loading ? "Saving..." : "Submit"}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                © 2025 FAST-C Digital Profiling System. All rights reserved.
            </div>
        </div>
    );
}

export default ProfileSetup;
