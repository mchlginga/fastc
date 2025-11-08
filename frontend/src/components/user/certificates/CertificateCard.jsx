import {
    Calendar,
    Download,
    Clock,
    ExternalLink,
    AlertTriangle,
} from "react-feather";

function CertificateCard({
    certificate,
    downloading,
    viewing,
    onDownload,
    viewUrl,
}) {
    const getStatusBadge = (status) => {
        const statusConfig = {
            active: {
                bgColor: "bg-emerald-100",
                textColor: "text-emerald-800",
                borderColor: "border-emerald-200",
                label: "Active",
            },
            expired: {
                bgColor: "bg-amber-100",
                textColor: "text-amber-800",
                borderColor: "border-amber-200",
                label: "Expired",
            },
            revoked: {
                bgColor: "bg-red-100",
                textColor: "text-red-800",
                borderColor: "border-red-200",
                label: "Revoked",
            },
        };

        const config = statusConfig[status] || statusConfig.active;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${config.bgColor} ${config.textColor} ${config.borderColor}`}
            >
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
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

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 hover:shadow-sm transition-all duration-200 flex flex-col group">
            {/* Certificate Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white rounded-t-xl">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg leading-tight text-white">
                        {certificate.title}
                    </h3>
                    {getStatusBadge(certificate.status)}
                </div>
                {certificate.course && (
                    <p className="text-blue-100 text-sm">
                        {certificate.course.title}
                    </p>
                )}
            </div>

            {/* Certificate Body */}
            <div className="p-6 flex-1 flex flex-col">
                {/* Course Info */}
                {certificate.course?.description && (
                    <div className="mb-4">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {certificate.course.description}
                        </p>
                    </div>
                )}

                {/* Dates */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                        <Calendar
                            size={16}
                            className="text-gray-400 mr-3 shrink-0"
                        />
                        <div>
                            <p className="text-gray-600 text-xs">Completed</p>
                            <p className="text-gray-800 font-medium">
                                {formatDate(certificate.completionDate)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock
                            size={16}
                            className="text-gray-400 mr-3 shrink-0"
                        />
                        <div>
                            <p className="text-gray-600 text-xs">Expires</p>
                            <p
                                className={`font-medium ${
                                    certificate.status === "expired"
                                        ? "text-red-600"
                                        : isExpiringSoon
                                        ? "text-amber-600"
                                        : "text-gray-800"
                                }`}
                            >
                                {formatDate(certificate.expirationDate)}
                                {isExpiringSoon &&
                                    certificate.status === "active" && (
                                        <span className="text-amber-600 text-xs ml-1">
                                            ({daysUntilExpiry} days)
                                        </span>
                                    )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Verification */}
                {certificate.verificationCode && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 text-xs mb-1 font-medium">
                            Verification Code
                        </p>
                        <p className="font-mono text-sm text-gray-800 font-medium">
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
                        className={`flex-1 min-h-11 py-2.5 rounded-lg text-sm font-medium transition text-center flex items-center justify-center ${
                            certificate.status === "active" && !downloading
                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs hover:shadow-sm"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
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

                    {/* 🆕 UPDATED: Use direct link instead of button */}
                    {viewUrl && certificate.status === "active" ? (
                        <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`min-h-11 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer`}
                            title="View Certificate"
                        >
                            <ExternalLink size={16} />
                        </a>
                    ) : (
                        <button
                            disabled
                            className="min-h-11 px-4 rounded-lg text-sm font-medium border border-gray-300 text-gray-400 cursor-not-allowed flex items-center justify-center"
                            title="View Certificate"
                        >
                            <ExternalLink size={16} />
                        </button>
                    )}
                </div>

                {/* Expiring Soon Warning */}
                {isExpiringSoon && certificate.status === "active" && (
                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-amber-800 text-xs text-center flex items-center justify-center">
                            <AlertTriangle size={12} className="mr-1" />
                            Expires in {daysUntilExpiry} days
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CertificateCard;
