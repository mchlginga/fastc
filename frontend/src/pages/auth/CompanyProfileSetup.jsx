import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/authService";
import {
    Award,
    Briefcase,
    MapPin,
    Phone,
    Upload,
    User,
    ArrowLeft,
    ArrowRight,
} from "react-feather";

function CompanyProfileSetup() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        industryType: "",
        businessPermit: null,
        address: "",
        contactNumber: "",
        representativeName: "",
        representativePosition: "",
        representativeContactNumber: "",
        representativeIdProof: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setError("");
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        setForm({ ...form, [name]: e.target.files[0] });
        setError("");
    };

    const handleNext = () => {
        if (!form.industryType || !form.address || !form.contactNumber) {
            setError("Please complete all company information fields.");
            return;
        }
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (
            !form.representativeName ||
            !form.representativePosition ||
            !form.representativeContactNumber
        ) {
            setError("Please complete all representative information fields.");
            setLoading(false);
            return;
        }

        try {
            await updateProfile({
                industryType: form.industryType,
                businessPermit: form.businessPermit,
                address: form.address,
                contactNumber: form.contactNumber,
                representative: {
                    name: form.representativeName,
                    position: form.representativePosition,
                    contactNumber: form.representativeContactNumber,
                    idProof: form.representativeIdProof,
                },
                profileStatus: "pending",
            });

            navigate("/pending-approval", { replace: true });
        } catch (error) {
            setError(error.message || "Failed to save profile.");
            setLoading(false);
        }
    };

    const handleSkip = () => navigate("/", { replace: true });

    if (!user || user.role !== "company") {
        return <div>Invalid user or role. Redirecting...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 ">
            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                    {step === 1
                        ? "Company Information"
                        : "Company Representative"}
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
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 transition-all duration-300"
                >
                    {step === 1 && (
                        <>
                            {/* Industry Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Industry Type
                                </label>
                                <div className="relative">
                                    <Briefcase
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <select
                                        name="industryType"
                                        value={form.industryType}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    >
                                        <option value="">
                                            Select Industry
                                        </option>
                                        <option value="Technology">
                                            Technology
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="Manufacturing">
                                            Manufacturing
                                        </option>
                                        <option value="Retail">Retail</option>
                                        <option value="Healthcare">
                                            Healthcare
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Business Permit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Permit (JPEG/PNG/PDF)
                                </label>
                                <div className="relative">
                                    <Upload
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="file"
                                        name="businessPermit"
                                        accept="image/jpeg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <div className="relative">
                                    <MapPin
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter company address"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+63 912 345 6789"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
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
                            {/* Representative Fields */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Representative Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        name="representativeName"
                                        value={form.representativeName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter representative name"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Representative Position
                                </label>
                                <div className="relative">
                                    <Briefcase
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <select
                                        name="representativePosition"
                                        value={form.representativePosition}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    >
                                        <option value="">
                                            Select Position
                                        </option>
                                        <option value="CEO">CEO</option>
                                        <option value="HR Manager">
                                            HR Manager
                                        </option>
                                        <option value="Operations Manager">
                                            Operations Manager
                                        </option>
                                        <option value="Finance Manager">
                                            Finance Manager
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Representative Contact Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="tel"
                                        name="representativeContactNumber"
                                        value={form.representativeContactNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+63 987 654 3210"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Representative ID (JPEG/PNG/PDF)
                                </label>
                                <div className="relative">
                                    <Upload
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="file"
                                        name="representativeIdProof"
                                        accept="image/jpeg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-700"
                                    />
                                </div>
                            </div>

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
                                    className="flex-1 py-2.5 rounded-md text-sm font-medium cursor-pointer text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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

export default CompanyProfileSetup;
