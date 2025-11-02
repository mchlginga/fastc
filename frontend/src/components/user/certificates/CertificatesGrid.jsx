import { useState } from "react";
import {
    Calendar,
    Download,
    Clock,
    Award,
    ExternalLink,
    Search,
} from "react-feather";
import CertificateCard from "./CertificateCard";
import EmptyState from "../courses/EmptyState";

function CertificatesGrid({
    certificates,
    searchQuery,
    onDownloadCertificate,
    onViewCertificate,
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

    const handleView = async (certificateId, title) => {
        try {
            setViewingId(certificateId);

            // 🆕 FIXED: Get token from localStorage and pass it in URL
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error(
                    "Authentication token not found. Please log in again."
                );
            }

            // 🆕 FIXED: Use Vite environment variables with token parameter
            const backendUrl =
                import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
            const viewUrl = `${backendUrl}/api/certificate/${certificateId}/view?token=${encodeURIComponent(
                token
            )}`;

            console.log(`🔗 Opening certificate URL: ${viewUrl}`);

            // Open in new tab
            const newWindow = window.open(
                viewUrl,
                "_blank",
                "noopener,noreferrer"
            );

            if (!newWindow) {
                throw new Error(
                    "Popup blocked. Please allow popups for this site."
                );
            }
        } catch (err) {
            console.error(`View error: ${err.message}`);
            alert(`Failed to view certificate: ${err.message}`);
            setViewingId(null);
        }
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    Your Certificates
                </h3>
                <div className="flex items-center gap-4">
                    {searchQuery && (
                        <span className="text-gray-600 text-sm">
                            {certificates.length} result
                            {certificates.length !== 1 ? "s" : ""} found
                        </span>
                    )}
                    <span className="text-gray-500 text-sm">
                        {certificates.length} certificate
                        {certificates.length !== 1 ? "s" : ""} earned
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                    <CertificateCard
                        key={certificate.id}
                        certificate={certificate}
                        downloading={downloadingId === certificate.id}
                        viewing={viewingId === certificate.id}
                        onDownload={handleDownload}
                        onView={handleView}
                    />
                ))}
            </div>
        </section>
    );
}

export default CertificatesGrid;
