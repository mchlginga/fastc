import { Award } from "react-feather";
import CertificateTableRow from "./CertificateTableRow";

const CertificateTable = ({
    certificates,
    selectedCertificates,
    selectAll,
    onSelectAll,
    onSelectCertificate,
    onViewCertificate,
    onRevokeCertificate,
    onRegenerateCertificate,
    onDeleteCertificate,
    onDownloadCertificate, // NEW: Add download handler prop
    statusFilter,
    setStatusFilter,
    stats,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-full">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    {[...Array(7)].map((_, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left"
                                        >
                                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b border-gray-100"
                                    >
                                        {[...Array(7)].map((_, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="px-4 py-3"
                                            >
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Table Container */}
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                {/* Checkbox */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={onSelectAll}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                                    />
                                </th>

                                {/* User Info */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[180px]">
                                    User
                                </th>

                                {/* Course Info */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[200px]">
                                    Course
                                </th>

                                {/* Regular Columns */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Completion Date
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Expiration Date
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[150px]">
                                    Verification Code
                                </th>

                                {/* Actions */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {certificates.map((certificate, index) => (
                                <CertificateTableRow
                                    key={certificate._id}
                                    certificate={certificate}
                                    isSelected={selectedCertificates.has(
                                        certificate._id
                                    )}
                                    onSelect={() =>
                                        onSelectCertificate(certificate._id)
                                    }
                                    onView={() =>
                                        onViewCertificate(certificate)
                                    }
                                    onRevoke={() =>
                                        onRevokeCertificate(certificate)
                                    }
                                    onRegenerate={() =>
                                        onRegenerateCertificate(certificate)
                                    }
                                    onDelete={() =>
                                        onDeleteCertificate(certificate)
                                    }
                                    onDownload={
                                        () =>
                                            onDownloadCertificate(
                                                certificate._id
                                            ) // NEW: Pass download handler
                                    }
                                    rowIndex={index}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {certificates.length === 0 && (
                        <div className="py-12 text-center border-t border-gray-100">
                            <Award
                                size={48}
                                className="mx-auto mb-4 text-gray-400"
                            />
                            <p className="text-gray-500 mb-2">
                                No certificates found
                            </p>
                            <p className="text-sm text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificateTable;
