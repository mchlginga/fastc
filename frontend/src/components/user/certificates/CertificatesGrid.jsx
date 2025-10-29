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
            const blob = await onViewCertificate(certificateId, title);
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank", "noopener,noreferrer");
            setTimeout(() => window.URL.revokeObjectURL(url), 60000);
        } catch (err) {
            console.error(`View error: ${err.message}`);
        } finally {
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
