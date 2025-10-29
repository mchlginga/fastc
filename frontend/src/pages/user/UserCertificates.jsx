import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getUserCertificates,
    downloadCertificate,
} from "../../services/certificateService";
import { getUserEnrollments } from "../../services/enrollmentService";

// Components
import {
    CertificatesHeader,
    CertificatesStats,
    CertificatesGrid,
    CertificatesEmptyState,
    CertificatesInfoBanner,
} from "../../components/user/certificates";

import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import CertificatesSkeleton from "../../components/user/certificates/CertificatesSkeleton";

function UserCertificates() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [completedEnrollmentsCount, setCompletedEnrollmentsCount] =
        useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both certificates and enrollments
            const [certificatesResponse, enrollmentsResponse] =
                await Promise.all([
                    getUserCertificates(),
                    getUserEnrollments(),
                ]);

            if (certificatesResponse.success) {
                setCertificates(certificatesResponse.certificates || []);
            } else {
                throw new Error(
                    certificatesResponse.message ||
                        "Failed to load certificates"
                );
            }

            // Calculate completed enrollments count
            if (enrollmentsResponse.success) {
                const completedCount = enrollmentsResponse.enrollments.filter(
                    (enrollment) => enrollment.status === "completed"
                ).length;
                setCompletedEnrollmentsCount(completedCount);
            }
        } catch (err) {
            console.error("Error fetching certificates:", err);
            setError(err.message || "Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user]);

    // Filter certificates based on search query
    const filterCertificatesBySearch = (certificatesList) => {
        if (!searchQuery.trim()) return certificatesList;

        const query = searchQuery.toLowerCase().trim();
        return certificatesList.filter(
            (certificate) =>
                certificate &&
                (certificate.title?.toLowerCase().includes(query) ||
                    certificate.course?.title?.toLowerCase().includes(query) ||
                    certificate.verificationCode?.toLowerCase().includes(query))
        );
    };

    const filteredCertificates = filterCertificatesBySearch(certificates);

    if (loading) {
        return <CertificatesSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Alert */}
                {user?.profileStatus === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                        <p className="text-sm">
                            Your profile is under review. You cannot enroll in
                            courses until approved.
                        </p>
                    </div>
                )}

                {/* Header Section */}
                <CertificatesHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Stats Summary */}
                {certificates.length > 0 && (
                    <CertificatesStats
                        certificates={certificates}
                        completedEnrollmentsCount={completedEnrollmentsCount}
                    />
                )}

                {/* Certificates Grid */}
                <CertificatesGrid
                    certificates={filteredCertificates}
                    searchQuery={searchQuery}
                    onDownloadCertificate={downloadCertificate}
                    onViewCertificate={downloadCertificate}
                />

                {/* Empty State */}
                {certificates.length === 0 && <CertificatesEmptyState />}

                {/* Information Banner */}
                {certificates.length > 0 && <CertificatesInfoBanner />}
            </div>
        </div>
    );
}

export default UserCertificates;
