import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/profilingService";
import {
    Award,
    Briefcase,
    MapPin,
    Phone,
    Upload,
    User,
    Mail,
    ArrowLeft,
    ArrowRight,
} from "react-feather";

const CompanyProfileSetup = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        address: "",
        contactNumber: "",
        businessPermit: null,
        representative: {
            name: "",
            email: "",
            contactNumber: "",
        }
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle basic form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    // Handle representative form changes
    const handleRepresentativeChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            representative: {
                ...prev.representative,
                [name]: value
            }
        }));
        setError("");
    };

    // Handle file uploads
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm((prev) => ({ ...prev, businessPermit: file }));
        setError("");
    };

    // Validation
    const validateStep = () => {
        const errors = [];

        if (step === 1) {
            if (!form.address) errors.push("Company Address");
            if (!form.contactNumber) errors.push("Company Contact Number");
            if (!form.businessPermit) errors.push("Business Permit");
        } else if (step === 2) {
            if (!form.representative.name) errors.push("Representative Name");
            if (!form.representative.email) errors.push("Representative Email");
            if (!form.representative.contactNumber) errors.push("Representative Contact Number");
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
        navigate("/company", { replace: true });
    };

    // Submit handler - ALIGNED WITH BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Prepare data for backend
            const files = [];
            if (form.businessPermit) {
                files.push(form.businessPermit);
            }

            // Call the service
            const updatedUser = await updateProfile({
                address: form.address,
                contactNumber: form.contactNumber,
                representative: form.representative,
                files: files,
            });

            // Update auth context
            setUser(updatedUser);

            // Redirect to company dashboard
            navigate("/company", { replace: true });
        } catch (error) {
            setError(
                error.message || "Failed to save profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Early return for invalid users
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
                        Complete Company Profile
                    </h3>
                    <p className="text-gray-600 text-sm">Step {step} of 2</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-center mb-8 space-x-1">
                    {[1, 2].map((stepNum) => (
                        <div
                            key={stepNum}
                            className={`h-2 w-16 rounded-full transition-all duration-300 ${
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

                {/* Form Steps */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Company Information */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="text-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Company Information
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Provide your company details
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Company Address
                                </label>
                                <div className="relative">
                                    <MapPin
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter company complete address"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Company Contact Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={form.contactNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="+63 912 345 6789"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Business Permit
                                </label>
                                <div className="relative">
                                    <Upload
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                {form.businessPermit && (
                                    <p className="text-sm text-green-600 mt-1">
                                        File selected: {form.businessPermit.name}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-sm hover:shadow-md cursor-pointer"
                            >
                                Continue to Representative
                            </button>
                        </div>
                    )}

                    {/* Step 2: Representative Information */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="text-center mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Company Representative
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Provide representative information
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Representative Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.representative.name}
                                        onChange={handleRepresentativeChange}
                                        required
                                        placeholder="Enter representative full name"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Representative Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.representative.email}
                                        onChange={handleRepresentativeChange}
                                        required
                                        placeholder="Enter representative email"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Representative Contact Number
                                </label>
                                <div className="relative">
                                    <Phone
                                        size={20}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={form.representative.contactNumber}
                                        onChange={handleRepresentativeChange}
                                        required
                                        placeholder="+63 987 654 3210"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 transition duration-200 cursor-text"
                                    />
                                </div>
                            </div>

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
        </div>
    );
};

export default CompanyProfileSetup;