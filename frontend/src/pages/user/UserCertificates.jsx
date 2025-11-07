import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
} from "../../components/common";

// Skeleton Component
import CertificatesSkeleton from "../../components/user/certificates/CertificatesSkeleton";

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

function UserCertificates() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [certificates, setCertificates] = useState([]);
    const [completedEnrollmentsCount, setCompletedEnrollmentsCount] =
        useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );

    // Fetch certificates with optimized dependencies
    const fetchCertificates = useCallback(async () => {
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
    }, []);

    // Initial fetch and when filters change
    useEffect(() => {
        if (user) {
            fetchCertificates();
        }
    }, [user, fetchCertificates]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (searchTerm) params.set("search", searchTerm);
        setSearchParams(params);
    }, [statusFilter, searchTerm, setSearchParams]);

    // Filter certificates based on search query and status
    const filterCertificates = useCallback(
        (certificatesList) => {
            let filtered = certificatesList;

            // Apply status filter
            if (statusFilter !== "all") {
                filtered = filtered.filter(
                    (certificate) => certificate.status === statusFilter
                );
            }

            // Apply search filter
            if (debouncedSearchTerm.trim()) {
                const query = debouncedSearchTerm.toLowerCase().trim();
                filtered = filtered.filter(
                    (certificate) =>
                        certificate &&
                        (certificate.title?.toLowerCase().includes(query) ||
                            certificate.course?.title
                                ?.toLowerCase()
                                .includes(query) ||
                            certificate.verificationCode
                                ?.toLowerCase()
                                .includes(query))
                );
            }

            return filtered;
        },
        [statusFilter, debouncedSearchTerm]
    );

    const filteredCertificates = filterCertificates(certificates);

    const handleRetry = () => {
        fetchCertificates();
    };

    if (loading && certificates.length === 0) {
        return <CertificatesSkeleton />;
    }

    if (error && certificates.length === 0) {
        return <ErrorState message={error} onRetry={handleRetry} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
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

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                My Certificates
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                View and manage all your earned certificates
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                {certificates.length > 0 && (
                    <CertificatesStats
                        certificates={certificates}
                        completedEnrollmentsCount={completedEnrollmentsCount}
                        loading={loading && certificates.length > 0}
                    />
                )}

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Header with Search and Filters */}
                    <CertificatesHeader
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        certificatesCount={certificates.length}
                        filteredCount={filteredCertificates.length}
                        certificates={certificates}
                        loading={loading && certificates.length > 0}
                    />

                    {/* Certificates Grid */}
                    <div className="p-6">
                        <CertificatesGrid
                            certificates={filteredCertificates}
                            searchTerm={searchTerm}
                            onDownloadCertificate={downloadCertificate}
                            onViewCertificate={downloadCertificate}
                            loading={loading && certificates.length > 0}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {certificates.length === 0 && !loading && (
                    <div className="mt-6">
                        <CertificatesEmptyState />
                    </div>
                )}

                {/* Information Banner */}
                {certificates.length > 0 && (
                    <div className="mt-6">
                        <CertificatesInfoBanner />
                    </div>
                )}

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
}

export default UserCertificates;
