import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Search } from "react-feather";
import CertificateCard from "./CertificateCard";

function CertificatesGrid({
    certificates,
    searchTerm,
    onDownloadCertificate,
    onViewCertificate,
    loading = false,
}) {
    const [downloadingId, setDownloadingId] = useState(null);
    const [viewingId, setViewingId] = useState(null);

    const handleDownload = async (certificateId, title) => {
        try {
            setDownloadingId(certificateId);
            const blob = await onDownloadCertificate(certificateId, title);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `FAST-C_Certificate_${title.replace(/\s+/g, "_")}.pdf`
            );

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the object URL
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(`Download error: ${err.message}`);
            alert(`Download failed: ${err.message}`);
        } finally {
            setDownloadingId(null);
        }
    };

    const getCertificateViewUrl = (certificateId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Authentication token not found");
            return null;
        }

        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        return `${backendUrl}/api/certificate/${certificateId}/view?token=${encodeURIComponent(
            token
        )}`;
    };

    if (loading) {
        return (
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col"
                        >
                            {/* Header Skeleton */}
                            <div className="bg-gray-300 p-6 rounded-t-2xl animate-pulse">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="h-6 bg-gray-400 rounded w-32 animate-pulse"></div>
                                    <div className="h-6 bg-gray-400 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-400 rounded w-24 animate-pulse"></div>
                            </div>

                            {/* Body Skeleton */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <div className="h-5 bg-gray-300 rounded w-40 mb-2 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-3/4 mt-1 animate-pulse"></div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {[...Array(2)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center"
                                        >
                                            <div className="w-4 h-4 bg-gray-300 rounded mr-3 animate-pulse"></div>
                                            <div className="space-y-1 flex-1">
                                                <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                                                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="h-3 bg-gray-300 rounded w-20 mb-1 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                </div>

                                <div className="flex space-x-2 mt-auto">
                                    <div className="flex-1 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                                    <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section>
            {certificates.length === 0 ? (
                <div className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <Award size={48} className="text-gray-300 mb-3" />
                        <p className="text-sm mb-2">
                            {searchTerm
                                ? "No certificates found"
                                : "No certificates yet"}
                        </p>
                        <Link
                            to="/user/courses"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                        >
                            Browse Courses
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                        <CertificateCard
                            key={certificate.id}
                            certificate={certificate}
                            downloading={downloadingId === certificate.id}
                            viewing={viewingId === certificate.id}
                            onDownload={handleDownload}
                            viewUrl={getCertificateViewUrl(certificate.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default CertificatesGrid;
