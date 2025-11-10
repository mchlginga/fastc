import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Award } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminCertificateService } from "../../services/userService";

// Components
import {
    CertificateStats,
    CertificateFilters,
    CertificateTable,
} from "../../components/admin/certificates";

import {
    CertificateDetailModal,
    RevokeCertificateModal,
    RegenerateCertificateModal,
    AddCertificateModal,
    BulkRegenerateCertificateModal,
    BulkExpireCertificateModal,
} from "../../components/admin/certificates/modals";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

// Skeleton Component
import AdminCertificatesSkeleton from "../../components/admin/certificates/AdminCertificatesSkeleton";

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

function AdminCertificates() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [certificates, setCertificates] = useState([]);
    const [filteredCertificates, setFilteredCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        expired: 0,
        revoked: 0,
        recentCertificates: 0,
        expiringSoon: 0,
    });

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get("course") || "all"
    );
    const [userFilter, setUserFilter] = useState(
        searchParams.get("user") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCertificates: 0,
        certificatesPerPage: 10,
    });

    // Selected certificates for bulk actions
    const [selectedCertificates, setSelectedCertificates] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Modals
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [showRevokeModal, setShowRevokeModal] = useState(false);
    const [showRegenerateModal, setShowRegenerateModal] = useState(false);
    const [showBulkRegenerateModal, setShowBulkRegenerateModal] =
        useState(false);
    const [showBulkExpireModal, setShowBulkExpireModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certificateToDelete, setCertificateToDelete] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Add refresh trigger for modal updates
    const [refreshModal, setRefreshModal] = useState(false);

    // Fetch certificates and stats with optimized dependencies
    const fetchCertificates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminCertificateService.getCertificates({
                search: debouncedSearchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                user: userFilter !== "all" ? userFilter : "",
                page: pagination.currentPage,
                limit: pagination.certificatesPerPage,
            });
            setCertificates(response.certificates);
            setFilteredCertificates(response.certificates);

            // Update pagination if available
            if (response.pagination) {
                setPagination((prev) => ({
                    ...prev,
                    currentPage: response.pagination.currentPage,
                    totalPages: response.pagination.totalPages,
                    totalCertificates: response.pagination.totalCertificates,
                }));
            }
        } catch (err) {
            setError(err.message || "Failed to load certificates");
            console.error("Error fetching certificates:", err);
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchTerm,
        statusFilter,
        courseFilter,
        userFilter,
        pagination.currentPage,
        pagination.certificatesPerPage,
    ]);

    const fetchCertificateStats = async () => {
        try {
            const response =
                await adminCertificateService.getCertificateStats();
            setStats(response.stats);
        } catch (err) {
            console.error("Error fetching certificate stats:", err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchCertificates();
        fetchCertificateStats();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.currentPage !== 1) {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }
    }, [debouncedSearchTerm, statusFilter, courseFilter, userFilter]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (courseFilter !== "all") params.set("course", courseFilter);
        if (userFilter !== "all") params.set("user", userFilter);
        if (pagination.currentPage > 1)
            params.set("page", pagination.currentPage);
        setSearchParams(params);
    }, [
        statusFilter,
        courseFilter,
        userFilter,
        pagination.currentPage,
        setSearchParams,
    ]);

    const handleAddCertificate = () => {
        setShowAddModal(true);
    };

    const handleCertificateAdded = () => {
        fetchCertificates();
        fetchCertificateStats();
        setToastNotification({
            message: "Certificate created successfully",
            type: "success",
        });
    };

    const handleStatusUpdate = async (certificateId, newStatus) => {
        try {
            await adminCertificateService.updateCertificateStatus(
                certificateId,
                newStatus
            );

            setCertificates((prev) =>
                prev.map((certificate) =>
                    certificate._id === certificateId
                        ? { ...certificate, status: newStatus }
                        : certificate
                )
            );

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: `Certificate status updated to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update certificate status",
                type: "error",
            });
        }
    };

    const handleActivateCertificate = async (certificateId) => {
        try {
            await adminCertificateService.updateCertificateStatus(
                certificateId,
                "active"
            );

            // Refresh the certificates list
            await fetchCertificates();

            // If the certificate detail modal is open, update the selected certificate
            if (
                selectedCertificate &&
                selectedCertificate._id === certificateId
            ) {
                // Find the updated certificate from the current list
                const updatedCert = certificates.find(
                    (c) => c._id === certificateId
                );
                if (updatedCert) {
                    setSelectedCertificate(updatedCert);
                }
            }

            setToastNotification({
                message: "Certificate activated successfully",
                type: "success",
            });

            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to activate certificate",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            // Validate certificate IDs before making the request
            const certificateIds = Array.from(selectedCertificates);

            // Filter out any invalid IDs
            const validCertificateIds = certificateIds.filter((id) => {
                // Check if it's a valid 24-character hex string (MongoDB ObjectId)
                return (
                    id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
                );
            });

            if (validCertificateIds.length === 0) {
                setToastNotification({
                    message: "No valid certificates selected",
                    type: "error",
                });
                return;
            }

            await adminCertificateService.bulkUpdateCertificateStatus(
                validCertificateIds,
                newStatus
            );

            setCertificates((prev) =>
                prev.map((certificate) =>
                    selectedCertificates.has(certificate._id)
                        ? {
                              ...certificate,
                              status: newStatus,
                              effectiveStatus:
                                  newStatus === "expired"
                                      ? "expired"
                                      : newStatus,
                              isExpired: newStatus === "expired",
                          }
                        : certificate
                )
            );

            setFilteredCertificates((prev) =>
                prev.map((certificate) =>
                    selectedCertificates.has(certificate._id)
                        ? {
                              ...certificate,
                              status: newStatus,
                              effectiveStatus:
                                  newStatus === "expired"
                                      ? "expired"
                                      : newStatus,
                              isExpired: newStatus === "expired",
                          }
                        : certificate
                )
            );

            setSelectedCertificates(new Set());
            setSelectAll(false);

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: `Updated ${validCertificateIds.length} certificates to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            console.error("Bulk status update error:", err);
            setToastNotification({
                message: err.message || "Failed to update certificates",
                type: "error",
            });
        }
    };

    const handleRevokeCertificate = async (certificateId) => {
        try {
            await adminCertificateService.revokeCertificate(certificateId);

            // Refresh the certificates list
            await fetchCertificates();

            // Update selected certificate if modal is open
            if (
                selectedCertificate &&
                selectedCertificate._id === certificateId
            ) {
                const updatedCert = certificates.find(
                    (c) => c._id === certificateId
                );
                if (updatedCert) {
                    setSelectedCertificate(updatedCert);
                }
            }

            setToastNotification({
                message: "Certificate revoked successfully",
                type: "success",
            });

            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to revoke certificate",
                type: "error",
            });
            throw err;
        }
    };

    const handleRegenerateCertificate = async (certificateId) => {
        try {
            const response =
                await adminCertificateService.regenerateCertificate(
                    certificateId
                );

            setCertificates((prev) =>
                prev.map((certificate) =>
                    certificate._id === certificateId
                        ? {
                              ...response.certificate,
                              status: "active",
                              effectiveStatus: "active",
                              isExpired: false,
                          }
                        : certificate
                )
            );

            setFilteredCertificates((prev) =>
                prev.map((certificate) =>
                    certificate._id === certificateId
                        ? {
                              ...response.certificate,
                              status: "active",
                              effectiveStatus: "active",
                              isExpired: false,
                          }
                        : certificate
                )
            );

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: "Certificate regenerated successfully",
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to regenerate certificate",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkRegenerateCertificates = async (certificateIds) => {
        try {
            const regeneratePromises = certificateIds.map((certificateId) =>
                adminCertificateService.regenerateCertificate(certificateId)
            );

            const results = await Promise.allSettled(regeneratePromises);

            // Count successful and failed operations
            const successful = results.filter(
                (result) => result.status === "fulfilled"
            ).length;
            const failed = results.filter(
                (result) => result.status === "rejected"
            ).length;

            const updatedCertificates = [...certificates];
            const updatedFilteredCertificates = [...filteredCertificates];

            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const certificateId = certificateIds[index];
                    const certificateIndex = updatedCertificates.findIndex(
                        (c) => c._id === certificateId
                    );
                    const filteredIndex = updatedFilteredCertificates.findIndex(
                        (c) => c._id === certificateId
                    );

                    if (certificateIndex !== -1) {
                        updatedCertificates[certificateIndex] = {
                            ...result.value.certificate,
                            status: "active", // 🆕 Ensure status is set to active
                            effectiveStatus: "active",
                            isExpired: false,
                        };
                    }

                    if (filteredIndex !== -1) {
                        updatedFilteredCertificates[filteredIndex] = {
                            ...result.value.certificate,
                            status: "active",
                            effectiveStatus: "active",
                            isExpired: false,
                        };
                    }
                }
            });

            setCertificates(updatedCertificates);
            setFilteredCertificates(updatedFilteredCertificates);

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            // Clear selection
            setSelectedCertificates(new Set());
            setSelectAll(false);

            // Show appropriate notification
            if (failed === 0) {
                setToastNotification({
                    message: `Successfully regenerated ${successful} certificates`,
                    type: "success",
                });
            } else {
                setToastNotification({
                    message: `Regenerated ${successful} certificates, ${failed} failed`,
                    type: "warning",
                });
            }

            return { successful, failed };
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to regenerate certificates",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkExpire = async () => {
        try {
            await adminCertificateService.bulkExpireCertificates(
                Array.from(selectedCertificates)
            );

            setCertificates((prev) =>
                prev.map((certificate) =>
                    selectedCertificates.has(certificate._id)
                        ? {
                              ...certificate,
                              status: "expired",
                              expirationDate: new Date().toISOString(),
                          }
                        : certificate
                )
            );

            setFilteredCertificates((prev) =>
                prev.map((certificate) =>
                    selectedCertificates.has(certificate._id)
                        ? {
                              ...certificate,
                              status: "expired",
                              expirationDate: new Date().toISOString(),
                          }
                        : certificate
                )
            );

            setSelectedCertificates(new Set());
            setSelectAll(false);

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: `Expired ${selectedCertificates.size} certificates`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to expire certificates",
                type: "error",
            });
        }
    };

    const handleDeleteCertificate = async (certificateId) => {
        try {
            await adminCertificateService.deleteCertificate(certificateId);

            setCertificates((prev) =>
                prev.filter((certificate) => certificate._id !== certificateId)
            );

            setFilteredCertificates((prev) =>
                prev.filter((certificate) => certificate._id !== certificateId)
            );

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: "Certificate deleted successfully",
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete certificate",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkDelete = async () => {
        try {
            const deletePromises = Array.from(selectedCertificates).map(
                (certificateId) =>
                    adminCertificateService.deleteCertificate(certificateId)
            );

            await Promise.all(deletePromises);

            setCertificates((prev) =>
                prev.filter(
                    (certificate) => !selectedCertificates.has(certificate._id)
                )
            );

            setFilteredCertificates((prev) =>
                prev.filter(
                    (certificate) => !selectedCertificates.has(certificate._id)
                )
            );

            setSelectedCertificates(new Set());
            setSelectAll(false);

            // Trigger modal refresh
            setRefreshModal((prev) => !prev);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: `Deleted ${selectedCertificates.size} certificates successfully`,
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete certificates",
                type: "error",
            });
            throw err;
        }
    };

    const handleDownloadCertificate = async (certificateId) => {
        try {
            await adminCertificateService.downloadCertificate(certificateId);
            setToastNotification({
                message: "Certificate download started",
                type: "success",
            });
        } catch (err) {
            console.error("Download error:", err);
            setToastNotification({
                message: err.message || "Failed to download certificate",
                type: "error",
            });
        }
    };

    const confirmRevokeCertificate = (certificate) => {
        console.log("Revoke certificate:", certificate);
        setSelectedCertificate(certificate);
        setShowRevokeModal(true);
    };

    const confirmRegenerateCertificate = (certificate) => {
        console.log("Regenerate certificate:", certificate);
        setSelectedCertificate(certificate);
        setShowRegenerateModal(true);
    };

    const confirmBulkRegenerate = () => {
        if (selectedCertificates.size === 0) return;
        setShowBulkRegenerateModal(true);
    };

    const confirmBulkExpire = () => {
        if (selectedCertificates.size === 0) return;
        setShowBulkExpireModal(true);
    };

    const confirmDeleteCertificate = (certificate) => {
        setCertificateToDelete(certificate);
        setBulkDelete(false);
        setShowDeleteModal(true);
    };

    const confirmBulkDelete = () => {
        if (selectedCertificates.size === 0) return;
        setCertificateToDelete(null);
        setBulkDelete(true);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            let success;
            if (bulkDelete) {
                success = await handleBulkDelete();
            } else {
                success = await handleDeleteCertificate(
                    certificateToDelete._id
                );
            }

            if (success) {
                setShowDeleteModal(false);
                setCertificateToDelete(null);
                setBulkDelete(false);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCertificates(new Set());
        } else {
            const allIds = new Set(
                filteredCertificates.map((certificate) => certificate._id)
            );
            setSelectedCertificates(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectCertificate = (certificateId) => {
        const newSelected = new Set(selectedCertificates);
        if (newSelected.has(certificateId)) {
            newSelected.delete(certificateId);
        } else {
            newSelected.add(certificateId);
        }
        setSelectedCertificates(newSelected);
        setSelectAll(newSelected.size === filteredCertificates.length);
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        setSelectedCertificates(new Set());
        setSelectAll(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCertificatesPerPageChange = (newPerPage) => {
        setPagination((prev) => ({
            ...prev,
            certificatesPerPage: newPerPage,
            currentPage: 1,
        }));
        setSelectedCertificates(new Set());
        setSelectAll(false);
    };

    if (loading && certificates.length === 0) {
        return <AdminCertificatesSkeleton />;
    }

    if (error && certificates.length === 0) {
        return <ErrorState message={error} onRetry={fetchCertificates} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Certificate Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage certificates, verify authenticity, and
                                handle certificate operations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <CertificateStats
                        stats={stats}
                        loading={loading && certificates.length > 0}
                    />
                </div>

                {/* Unified Container for Filters and Table */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100">
                        <CertificateFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            courseFilter={courseFilter}
                            setCourseFilter={setCourseFilter}
                            userFilter={userFilter}
                            setUserFilter={setUserFilter}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            selectedCertificates={selectedCertificates}
                            onAddCertificate={handleAddCertificate}
                            onBulkStatusUpdate={handleBulkStatusUpdate}
                            onBulkRegenerate={confirmBulkRegenerate}
                            onBulkExpire={handleBulkExpire}
                            onBulkDelete={confirmBulkDelete}
                            stats={stats}
                            loading={loading && certificates.length > 0}
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <CertificateTable
                            certificates={filteredCertificates}
                            selectedCertificates={selectedCertificates}
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                            onSelectCertificate={handleSelectCertificate}
                            onViewCertificate={(certificate) => {
                                setSelectedCertificate(certificate);
                                setShowRevokeModal(false);
                                setShowRegenerateModal(false);
                                setShowCertificateModal(true);
                            }}
                            onRevokeCertificate={confirmRevokeCertificate}
                            onRegenerateCertificate={
                                confirmRegenerateCertificate
                            }
                            onDeleteCertificate={confirmDeleteCertificate}
                            onDownloadCertificate={handleDownloadCertificate}
                            onActivate={handleActivateCertificate}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            stats={stats}
                            loading={loading && certificates.length > 0}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onCertificatesPerPageChange={
                                    handleCertificatesPerPageChange
                                }
                                loading={loading && certificates.length > 0}
                            />
                        </div>
                    )}
                </div>

                {/* Modals */}
                <CertificateDetailModal
                    isOpen={showCertificateModal}
                    onClose={() => {
                        setShowCertificateModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={
                        selectedCertificate
                            ? certificates.find(
                                  (c) => c._id === selectedCertificate._id
                              ) || selectedCertificate
                            : null
                    }
                    onRevoke={() => {
                        setShowRevokeModal(true);
                        setShowCertificateModal(false);
                    }}
                    onRegenerate={() => {
                        setShowRegenerateModal(true);
                        setShowCertificateModal(false);
                    }}
                    onDownload={handleDownloadCertificate}
                    refreshTrigger={refreshModal}
                />

                <RevokeCertificateModal
                    isOpen={showRevokeModal}
                    onClose={() => {
                        setShowRevokeModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={selectedCertificate}
                    onRevoke={async () => {
                        try {
                            await handleRevokeCertificate(
                                selectedCertificate._id
                            );
                            setShowRevokeModal(false);
                            setSelectedCertificate(null);
                        } catch (error) {
                            // Error is already handled in handleRevokeCertificate
                        }
                    }}
                />

                <RegenerateCertificateModal
                    isOpen={showRegenerateModal}
                    onClose={() => {
                        setShowRegenerateModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={selectedCertificate}
                    onRegenerate={async () => {
                        try {
                            await handleRegenerateCertificate(
                                selectedCertificate._id
                            );
                            setShowRegenerateModal(false);
                            setSelectedCertificate(null);
                        } catch (error) {
                            // Error is already handled in handleRegenerateCertificate
                        }
                    }}
                />

                <BulkRegenerateCertificateModal
                    isOpen={showBulkRegenerateModal}
                    onClose={() => setShowBulkRegenerateModal(false)}
                    selectedCount={selectedCertificates.size}
                    onBulkRegenerate={() =>
                        handleBulkRegenerateCertificates(
                            Array.from(selectedCertificates)
                        )
                    }
                />

                <BulkExpireCertificateModal
                    isOpen={showBulkExpireModal}
                    onClose={() => setShowBulkExpireModal(false)}
                    selectedCount={selectedCertificates.size}
                    onBulkExpire={handleBulkExpire}
                />

                <AddCertificateModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onCertificateAdded={handleCertificateAdded}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        if (!deleteLoading) {
                            setShowDeleteModal(false);
                            setCertificateToDelete(null);
                            setBulkDelete(false);
                        }
                    }}
                    onConfirm={handleDeleteConfirm}
                    title={
                        bulkDelete
                            ? `Delete ${selectedCertificates.size} Certificates?`
                            : "Delete Certificate?"
                    }
                    message={
                        bulkDelete
                            ? `Are you sure you want to delete ${selectedCertificates.size} certificates? This action cannot be undone.`
                            : `Are you sure you want to delete the certificate for ${
                                  certificateToDelete?.user?.role === "company"
                                      ? certificateToDelete?.user?.companyName
                                      : `${certificateToDelete?.user?.firstName} ${certificateToDelete?.user?.surname}`
                              } - ${
                                  certificateToDelete?.course?.title
                              }? This action cannot be undone.`
                    }
                    confirmText={
                        bulkDelete
                            ? `Delete ${selectedCertificates.size} Certificates`
                            : "Delete Certificate"
                    }
                    type="danger"
                    isLoading={deleteLoading}
                />

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

// Pagination Component
const Pagination = ({
    pagination,
    onPageChange,
    onCertificatesPerPageChange,
    loading = false,
}) => {
    const { currentPage, totalPages, totalCertificates, certificatesPerPage } =
        pagination;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Certificates per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                    value={certificatesPerPage}
                    onChange={(e) =>
                        onCertificatesPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    disabled={loading}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">
                    certificates per page
                </span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * certificatesPerPage + 1} to{" "}
                {Math.min(currentPage * certificatesPerPage, totalCertificates)}{" "}
                of {totalCertificates} certificates
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    «
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ‹
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                        className={`px-3 py-1 text-sm font-medium border rounded transition-colors cursor-pointer ${
                            currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ›
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default AdminCertificates;
