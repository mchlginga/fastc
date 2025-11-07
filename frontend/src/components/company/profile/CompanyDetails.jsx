import { useState } from "react";
import {
    Edit3,
    Save,
    X,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    User,
} from "react-feather";

const CompanyDetails = ({ user, onProfileUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        companyName: user?.companyName || "",
        email: user?.email || "",
        contactNumber: user?.contactNumber || "",
        address: user?.address || "",
        representative: {
            name: user?.representative?.name || "",
            email: user?.representative?.email || "",
            contactNumber: user?.representative?.contactNumber || "",
        },
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => {
            if (field.includes(".")) {
                const [parent, child] = field.split(".");
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value,
                    },
                };
            } else {
                return {
                    ...prev,
                    [field]: value,
                };
            }
        });

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (
            formData.contactNumber &&
            !/^\+?[\d\s-()]+$/.test(formData.contactNumber)
        ) {
            newErrors.contactNumber = "Please enter a valid phone number";
        }

        if (formData.representative.name && !formData.representative.email) {
            newErrors["representative.email"] =
                "Representative email is required when name is provided";
        }

        if (
            formData.representative.email &&
            !/\S+@\S+\.\S+/.test(formData.representative.email)
        ) {
            newErrors["representative.email"] =
                "Please enter a valid representative email";
        }

        if (
            formData.representative.contactNumber &&
            !/^\+?[\d\s-()]+$/.test(formData.representative.contactNumber)
        ) {
            newErrors["representative.contactNumber"] =
                "Please enter a valid representative phone number";
        }

        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSaving(true);
        try {
            // Prepare the data for API call
            const profileData = {
                companyName: formData.companyName.trim(),
                email: formData.email.trim(),
                contactNumber: formData.contactNumber || "",
                address: formData.address || "",
                representative: {
                    name: formData.representative.name || "",
                    email: formData.representative.email || "",
                    contactNumber: formData.representative.contactNumber || "",
                },
            };

            await onProfileUpdate(profileData);
            setIsEditing(false);
            setErrors({});
        } catch (error) {
            console.error("Failed to update profile:", error);
            // Error handling is done in the parent component via toast notifications
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            companyName: user?.companyName || "",
            email: user?.email || "",
            contactNumber: user?.contactNumber || "",
            address: user?.address || "",
            representative: {
                name: user?.representative?.name || "",
                email: user?.representative?.email || "",
                contactNumber: user?.representative?.contactNumber || "",
            },
        });
        setErrors({});
        setIsEditing(false);
    };

    // Helper function to render a field
    const renderField = (
        label,
        field,
        icon,
        type = "text",
        required = false,
        readOnly = false
    ) => {
        const value = field.includes(".")
            ? formData[field.split(".")[0]]?.[field.split(".")[1]] || ""
            : formData[field] || "";

        const error = errors[field];

        return (
            <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                <div className="text-gray-400 mt-1">{icon}</div>
                <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                    {isEditing ? (
                        <div>
                            <input
                                type={type}
                                value={value}
                                onChange={(e) =>
                                    handleInputChange(field, e.target.value)
                                }
                                readOnly={readOnly}
                                className={`w-full mt-1 px-3 py-2 border ${
                                    error ? "border-red-300" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    readOnly
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : ""
                                }`}
                            />
                            {error && (
                                <p className="text-red-600 text-xs mt-1">
                                    {error}
                                </p>
                            )}
                            {readOnly && (
                                <p className="text-gray-500 text-xs mt-1">
                                    Contact support to change your email.
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-900 mt-1">
                            {value || "Not provided"}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Company Details
                </h3>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center cursor-pointer ${
                                    saving
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} className="mr-2" />
                                        Save
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center cursor-pointer"
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center cursor-pointer"
                        >
                            <Edit3 size={16} className="mr-2" />
                            Edit Details
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <Briefcase size={16} className="mr-2" />
                        Company Information
                    </h4>
                    {renderField(
                        "Company Name",
                        "companyName",
                        <Briefcase size={16} />,
                        "text",
                        true
                    )}
                    {renderField(
                        "Email",
                        "email",
                        <Mail size={16} />,
                        "email",
                        true,
                        true // Make email read-only
                    )}
                    {renderField("Phone", "contactNumber", <Phone size={16} />)}
                    {renderField("Address", "address", <MapPin size={16} />)}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <User size={16} className="mr-2" />
                        Representative Information
                    </h4>
                    {renderField(
                        "Representative Name",
                        "representative.name",
                        <User size={16} />
                    )}
                    {renderField(
                        "Representative Email",
                        "representative.email",
                        <Mail size={16} />,
                        "email"
                    )}
                    {renderField(
                        "Representative Phone",
                        "representative.contactNumber",
                        <Phone size={16} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
