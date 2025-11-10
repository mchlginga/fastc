import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    Check,
    XCircle,
    Clock,
    AlertTriangle,
    Download,
    Copy,
} from "react-feather";
import { verifyCertificate } from "../../services/certificateService";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
} from "../../components/common";

const VerifyCertificate = () => {
    const [searchParams] = useSearchParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [copied, setCopied] = useState(false);

    const verificationCode = searchParams.get("code");

    // Function to format date as "June 12, 2022"
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    useEffect(() => {
        const verifyCert = async () => {
            if (!verificationCode) {
                setError("No verification code provided");
                setLoading(false);
                return;
            }

            try {
                console.log(
                    "Verifying certificate with code:",
                    verificationCode
                );
                const response = await verifyCertificate(verificationCode);
                console.log("Verification response:", response);
                setCertificate(response.certificate);
            } catch (err) {
                console.error("Verification error:", err);
                setError(err.message || "Failed to verify certificate");
            } finally {
                setLoading(false);
            }
        };

        verifyCert();
    }, [verificationCode]);

    const copyVerificationLink = () => {
        const link = `${window.location.origin}/verify?code=${verificationCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setToastNotification({
            message: "Verification link copied to clipboard",
            type: "success",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: {
                icon: <Check size={48} className="text-emerald-600" />,
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-800",
                label: "Active and Valid",
                description: "This certificate is currently active and valid.",
            },
            expired: {
                icon: <Clock size={48} className="text-amber-600" />,
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-800",
                label: "Expired",
                description: "This certificate has expired.",
            },
            revoked: {
                icon: <XCircle size={48} className="text-red-600" />,
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-800",
                label: "Revoked",
                description:
                    "This certificate has been revoked and is no longer valid.",
            },
        };
        return configs[status] || configs.active;
    };

    if (loading) {
        return <LoadingState message="Verifying certificate..." />;
    }

    if (error || !certificate) {
        return (
            <ErrorState
                message={error || "Certificate not found"}
                onRetry={() => window.location.reload()}
                title="Verification Failed"
            />
        );
    }

    const statusConfig = getStatusConfig(certificate.status);

    return (
        <div className="min-h-screen bg-gray-50/60 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        FAST-C Certificate Verification
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Verify the authenticity of FAST-C training certificates
                    </p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-6">
                    <div
                        className={`p-6 border-l-4 ${statusConfig.border} ${statusConfig.bg}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {statusConfig.icon}
                                <div>
                                    <h2
                                        className={`text-lg font-semibold ${statusConfig.text}`}
                                    >
                                        Certificate {statusConfig.label}
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        {statusConfig.description}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Verified on
                                </p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(certificate.verifiedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate Details */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Certificate Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Recipient
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {certificate.recipient.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {certificate.recipient.email}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {certificate.course.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {certificate.course.category}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Completion Date
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(certificate.completionDate)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiration Date
                                </label>
                                <p className="text-gray-900">
                                    {formatDate(certificate.expirationDate)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Issued By
                                </label>
                                <p className="text-gray-900">
                                    {certificate.issuedBy}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Verification Code
                                </label>
                                <p className="font-mono text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    {certificate.verificationCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                {certificate.isExpired && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <AlertTriangle
                                size={20}
                                className="text-amber-600 mr-2"
                            />
                            <p className="text-amber-800 text-sm">
                                This certificate expired on{" "}
                                {formatDate(certificate.expirationDate)}
                            </p>
                        </div>
                    </div>
                )}

                {certificate.isRevoked && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <XCircle size={20} className="text-red-600 mr-2" />
                            <p className="text-red-800 text-sm">
                                This certificate has been revoked and is no
                                longer valid.
                            </p>
                        </div>
                    </div>
                )}

                {/* Share Verification */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Share Verification
                    </h3>
                    <p className="text-blue-800 text-sm mb-4">
                        Share this link to allow others to verify this
                        certificate:
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/verify?code=${verificationCode}`}
                            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={copyVerificationLink}
                            className="flex items-center px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                        >
                            <Copy size={16} className="mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-xs">
                    <p>FAST-C Digital Profiling and Certification System</p>
                    <p>
                        This verification is provided as a service of FAST-C
                        Training Center
                    </p>
                </div>

                {/* Toast Notifications */}
                {toastNotification && (
                    <ToastNotification
                        message={toastNotification.message}
                        type={toastNotification.type}
                        onClose={() => setToastNotification(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default VerifyCertificate;
