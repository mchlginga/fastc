import { useState } from "react";
import { Save, Plus, X, Award, Upload, Eye } from "react-feather";
import { updateCertificates } from "../../../services/userService";

const CertificatesSection = ({
    certificates,
    loading,
    onCertificatesChange,
    onToastNotification,
    onUserUpdate,
    onViewFile,
    isFiltered = false,
}) => {
    const [saving, setSaving] = useState(false);

    const handleCertificateChange = (id, field, value) => {
        onCertificatesChange((prev) =>
            prev.map((cert) =>
                cert.id === id ? { ...cert, [field]: value } : cert
            )
        );
    };

    const handleAddCertificate = () => {
        onCertificatesChange((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: "",
                issuer: "",
                date: "",
                expiration: "",
                proof: null,
                existingProof: null,
            },
        ]);
    };

    const handleRemoveCertificate = (id) => {
        if (certificates.length > 1) {
            onCertificatesChange((prev) =>
                prev.filter((cert) => cert.id !== id)
            );
        }
    };

    const handleCertificateFileChange = (id, file) => {
        onCertificatesChange((prev) =>
            prev.map((cert) =>
                cert.id === id
                    ? { ...cert, proof: file, existingProof: null }
                    : cert
            )
        );
    };

    const handleRemoveCertificateFile = (id) => {
        onCertificatesChange((prev) =>
            prev.map((cert) =>
                cert.id === id
                    ? { ...cert, proof: null, existingProof: null }
                    : cert
            )
        );
    };

    const handleSaveCertificates = async () => {
        setSaving(true);
        try {
            const certificateData = certificates.map((cert) => {
                const certificateItem = {
                    name: cert.name,
                    issuer: cert.issuer,
                    date: cert.date,
                    expiration: cert.expiration || null,
                    existingProof: cert.existingProof || null,
                };

                if (cert.proof) {
                    certificateItem.proof = "new";
                } else if (cert.existingProof && !cert.proof) {
                    certificateItem.proof = "existing";
                } else {
                    certificateItem.proof = "remove";
                }

                return certificateItem;
            });

            const files = certificates
                .filter((cert) => cert.proof)
                .map((cert) => cert.proof);

            const response = await updateCertificates({
                certificates: certificateData,
                files: files,
            });

            // FIX: Handle response properly
            if (response.success) {
                const updatedUser = response.user || response;
                onUserUpdate(updatedUser);
                onToastNotification({
                    message: "Certificates saved successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            onToastNotification({
                message: error.message || "Failed to save certificates.",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (isFiltered && certificates.length === 0) {
        return (
            <section>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Certificates
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Add your professional certifications and training
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                        <Award size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        No certificates found
                    </h3>
                    <p className="text-gray-600 text-sm">
                        No certificates match your search criteria. Try
                        adjusting your search terms.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Certificates
                </h3>
                <p className="text-gray-600 text-sm">
                    Add your professional certifications and training
                </p>
            </div>

            <div className="space-y-6">
                {certificates.map((cert, index) => (
                    <div
                        key={cert.id}
                        className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-800">
                                Certificate {index + 1}
                            </h4>
                            {certificates.length > 1 && (
                                <button
                                    onClick={() =>
                                        handleRemoveCertificate(cert.id)
                                    }
                                    className="text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Certificate Name *
                                </label>
                                <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) =>
                                        handleCertificateChange(
                                            cert.id,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    placeholder="Certificate name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Issuer/Organization *
                                </label>
                                <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(e) =>
                                        handleCertificateChange(
                                            cert.id,
                                            "issuer",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    placeholder="Issuing organization"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Date Issued *
                                </label>
                                <input
                                    type="date"
                                    value={cert.date}
                                    onChange={(e) =>
                                        handleCertificateChange(
                                            cert.id,
                                            "date",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Expiration Date
                                </label>
                                <input
                                    type="date"
                                    value={cert.expiration}
                                    onChange={(e) =>
                                        handleCertificateChange(
                                            cert.id,
                                            "expiration",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Certificate File
                                </label>
                                <div className="space-y-2">
                                    {cert.existingProof && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center">
                                                <Award
                                                    size={16}
                                                    className="text-green-600 mr-2"
                                                />
                                                <span className="text-sm text-green-800">
                                                    Certificate file uploaded
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        onViewFile(
                                                            cert.existingProof,
                                                            cert.name ||
                                                                `Certificate ${
                                                                    index + 1
                                                                }`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                                    title="View certificate"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveCertificateFile(
                                                            cert.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                                    title="Remove file"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {!cert.existingProof && (
                                        <div className="flex items-center">
                                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex-1 truncate">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) =>
                                                        handleCertificateFileChange(
                                                            cert.id,
                                                            e.target.files[0]
                                                        )
                                                    }
                                                />
                                                <div className="flex items-center">
                                                    <Upload
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    <span className="truncate">
                                                        {cert.proof
                                                            ? cert.proof.name
                                                            : "Upload Certificate File"}
                                                    </span>
                                                </div>
                                            </label>
                                            {cert.proof && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveCertificateFile(
                                                            cert.id
                                                        )
                                                    }
                                                    className="ml-2 text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs mt-2">
                                    Upload PDF, JPG, JPEG, or PNG files (Max
                                    5MB)
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddCertificate}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition duration-200 cursor-pointer mt-6"
            >
                + Add Another Certificate
            </button>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSaveCertificates}
                    disabled={saving}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center cursor-pointer ${
                        saving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving Certificates...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Save Certificates
                        </>
                    )}
                </button>
            </div>
        </section>
    );
};

export default CertificatesSection;
