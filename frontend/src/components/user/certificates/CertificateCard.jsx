import {
    Calendar,
    Download,
    Clock,
    ExternalLink,
    Check,
    X,
} from "react-feather";

function CertificateCard({
    certificate,
    downloading,
    viewing,
    onDownload,
    onView,
}) {
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {
                bgColor: "bg-green-100",
                textColor: "text-green-800",
                borderColor: "border-green-200",
                icon: Check,
                label: "Active",
            },
            expired: {
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
                borderColor: "border-yellow-200",
                icon: Clock,
                label: "Expired",
            },
            revoked: {
                bgColor: "bg-red-100",
                textColor: "text-red-800",
                borderColor: "border-red-200",
                icon: X,
                label: "Revoked",
            },
        };

        const config = statusConfig[status] || statusConfig.active;
        const IconComponent = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`}
            >
                <IconComponent size={12} className="mr-1" />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getDaysUntilExpiry = (expirationDate) => {
        const today = new Date();
        const expiry = new Date(expirationDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysUntilExpiry = getDaysUntilExpiry(certificate.expirationDate);
    const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

    // 🆕 ADD: Handle direct view click
    const handleViewClick = () => {
        if (certificate.status === "active" && !viewing) {
            onView(certificate.id, certificate.title);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white rounded-t-2xl">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight">
                        {certificate.title}
                    </h3>
                    {getStatusBadge(certificate.status)}
                </div>
            </div>

            {/* Certificate Body */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Course Info */}
                {certificate.course && (
                    <div className="mb-4">
                        {certificate.course.description && (
                            <p className="text-gray-600 text-xs">
                                {certificate.course.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Dates */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                        <Calendar size={16} className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-gray-600 text-xs">Completed</p>
                            <p className="text-gray-800 font-medium">
                                {formatDate(certificate.completionDate)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock size={16} className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-gray-600 text-xs">Expires</p>
                            <p
                                className={`font-medium ${
                                    certificate.status === "expired"
                                        ? "text-red-600"
                                        : isExpiringSoon
                                        ? "text-yellow-600"
                                        : "text-gray-800"
                                }`}
                            >
                                {formatDate(certificate.expirationDate)}
                                {isExpiringSoon &&
                                    certificate.status === "active" && (
                                        <span className="text-yellow-600 text-xs ml-1">
                                            ({daysUntilExpiry} days)
                                        </span>
                                    )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Verification */}
                {certificate.verificationCode && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-xs mb-1">
                            Verification Code
                        </p>
                        <p className="font-mono text-sm text-gray-800">
                            {certificate.verificationCode}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-auto">
                    <button
                        onClick={() =>
                            onDownload(certificate.id, certificate.title)
                        }
                        disabled={
                            certificate.status !== "active" || downloading
                        }
                        className={`flex-1 min-h-[44px] py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center ${
                            certificate.status === "active" && !downloading
                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {downloading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Downloading...
                            </div>
                        ) : (
                            <>
                                <Download size={16} className="mr-2" />
                                Download
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleViewClick}
                        disabled={certificate.status !== "active" || viewing}
                        className={`min-h-[44px] px-4 rounded-lg text-sm font-medium transition flex items-center justify-center ${
                            certificate.status === "active" && !viewing
                                ? "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer"
                                : "border border-gray-300 text-gray-400 cursor-not-allowed"
                        }`}
                        title="View Certificate"
                    >
                        {viewing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        ) : (
                            <ExternalLink size={16} />
                        )}
                    </button>
                </div>

                {/* Expiring Soon Warning */}
                {isExpiringSoon && certificate.status === "active" && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-xs text-center">
                            ⚠️ Expires in {daysUntilExpiry} days
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CertificateCard;
