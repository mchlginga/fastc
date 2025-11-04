import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Download,
    Copy,
} from "react-feather";
import { verifyCertificate } from "../../services/certificateService";

const VerifyCertificate = () => {
    const [searchParams] = useSearchParams();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const verificationCode = searchParams.get("code");

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
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: {
                icon: <CheckCircle size={48} className="text-green-500" />,
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-800",
                label: "Active and Valid",
                description: "This certificate is currently active and valid.",
            },
            expired: {
                icon: <Clock size={48} className="text-yellow-500" />,
                bg: "bg-yellow-50",
                border: "border-yellow-200",
                text: "text-yellow-800",
                label: "Expired",
                description: "This certificate has expired.",
            },
            revoked: {
                icon: <XCircle size={48} className="text-red-500" />,
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying certificate...</p>
                </div>
            </div>
        );
    }

    if (error || !certificate) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || "Certificate not found"}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(certificate.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        FAST-C Certificate Verification
                    </h1>
                    <p className="text-gray-600">
                        Verify the authenticity of FAST-C training certificates
                    </p>
                </div>

                {/* Status Card */}
                <div
                    className={`rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} p-6 mb-6`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {statusConfig.icon}
                            <div>
                                <h2
                                    className={`text-xl font-semibold ${statusConfig.text}`}
                                >
                                    Certificate {statusConfig.label}
                                </h2>
                                <p className="text-gray-600">
                                    {statusConfig.description}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Verified on</p>
                            <p className="font-medium text-gray-900">
                                {new Date(
                                    certificate.verifiedAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Certificate Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Certificate Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                {new Date(
                                    certificate.completionDate
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date
                            </label>
                            <p className="text-gray-900">
                                {new Date(
                                    certificate.expirationDate
                                ).toLocaleDateString()}
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
                            <p className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {certificate.verificationCode}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                {certificate.isExpired && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <AlertTriangle
                                size={20}
                                className="text-yellow-600 mr-2"
                            />
                            <p className="text-yellow-800">
                                This certificate expired on{" "}
                                {new Date(
                                    certificate.expirationDate
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )}

                {certificate.isRevoked && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center">
                            <XCircle size={20} className="text-red-600 mr-2" />
                            <p className="text-red-800">
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
                    <p className="text-blue-800 mb-4">
                        Share this link to allow others to verify this
                        certificate:
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/verify?code=${verificationCode}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
                        />
                        <button
                            onClick={copyVerificationLink}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Copy size={16} className="mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>FAST-C Digital Profiling and Certification System</p>
                    <p>
                        This verification is provided as a service of FAST-C
                        Training Center
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyCertificate;
