import { useState, useEffect } from "react";
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

    // Fetch certificates and stats
    useEffect(() => {
        fetchCertificates();
        fetchCertificateStats();
    }, []);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (courseFilter !== "all") params.set("course", courseFilter);
        if (userFilter !== "all") params.set("user", userFilter);
        setSearchParams(params);
    }, [statusFilter, courseFilter, userFilter, setSearchParams]);

    // Filter certificates when search or filters change
    useEffect(() => {
        let filtered = certificates;

        if (searchTerm) {
            filtered = filtered.filter(
                (certificate) =>
                    certificate.user?.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    certificate.user?.surname
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    certificate.user?.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    certificate.user?.companyName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    certificate.course?.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    certificate.verificationCode
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (certificate) => certificate.status === statusFilter
            );
        }

        if (courseFilter !== "all") {
            filtered = filtered.filter(
                (certificate) => certificate.course?._id === courseFilter
            );
        }

        if (userFilter !== "all") {
            filtered = filtered.filter(
                (certificate) => certificate.user?._id === userFilter
            );
        }

        setFilteredCertificates(filtered);
    }, [certificates, searchTerm, statusFilter, courseFilter, userFilter]);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            const response = await adminCertificateService.getCertificates({
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                user: userFilter !== "all" ? userFilter : "",
                page: 1,
                limit: 50,
            });
            setCertificates(response.certificates);
        } catch (err) {
            setError(err.message || "Failed to load certificates");
            console.error("Error fetching certificates:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificateStats = async () => {
        try {
            const response =
                await adminCertificateService.getCertificateStats();
            setStats(response.stats);
        } catch (err) {
            console.error("Error fetching certificate stats:", err);
        }
    };

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

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            await adminCertificateService.bulkUpdateCertificateStatus(
                Array.from(selectedCertificates),
                newStatus
            );

            setCertificates((prev) =>
                prev.map((certificate) =>
                    selectedCertificates.has(certificate._id)
                        ? { ...certificate, status: newStatus }
                        : certificate
                )
            );

            setSelectedCertificates(new Set());
            setSelectAll(false);

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: `Updated ${selectedCertificates.size} certificates to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update certificates",
                type: "error",
            });
        }
    };

    const handleRevokeCertificate = async (certificateId) => {
        try {
            await adminCertificateService.revokeCertificate(certificateId);

            setCertificates((prev) =>
                prev.map((certificate) =>
                    certificate._id === certificateId
                        ? { ...certificate, status: "revoked" }
                        : certificate
                )
            );

            // Refresh stats
            fetchCertificateStats();

            setToastNotification({
                message: "Certificate revoked successfully",
                type: "success",
            });
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

            // Update the specific certificate in state with the new data
            setCertificates((prev) =>
                prev.map((certificate) =>
                    certificate._id === certificateId
                        ? {
                              ...response.certificate, // Use the updated certificate from response
                              effectiveStatus: "active", // Force active status
                              isExpired: false, // Reset expired flag
                          }
                        : certificate
                )
            );

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

    // NEW: Bulk regenerate certificates
    const handleBulkRegenerateCertificates = async (certificateIds) => {
        try {
            // Use Promise.all to regenerate all certificates in parallel
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

            // Update certificates state with regenerated ones
            const updatedCertificates = [...certificates];
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    const certificateId = certificateIds[index];
                    const certificateIndex = updatedCertificates.findIndex(
                        (c) => c._id === certificateId
                    );
                    if (certificateIndex !== -1) {
                        updatedCertificates[certificateIndex] = {
                            ...result.value.certificate,
                            effectiveStatus: "active",
                            isExpired: false,
                        };
                    }
                }
            });

            setCertificates(updatedCertificates);

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
                              expirationDate: new Date().toISOString(), // Set to current date
                          }
                        : certificate
                )
            );

            setSelectedCertificates(new Set());
            setSelectAll(false);

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
            setSelectedCertificates(new Set());
            setSelectAll(false);

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

    const confirmRevokeCertificate = (certificate) => {
        setSelectedCertificate(certificate);
        setShowRevokeModal(true);
    };

    const confirmRegenerateCertificate = (certificate) => {
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

    if (loading) {
        return <AdminCertificatesSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchCertificates} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 rounded-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <Award size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Certificate Management
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage certificates, verify authenticity, and handle
                        certificate operations
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <CertificateStats stats={stats} />
                </div>

                {/* Unified Container for Filters and Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100 bg-white">
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
                                setShowCertificateModal(true);
                            }}
                            onRevokeCertificate={confirmRevokeCertificate}
                            onRegenerateCertificate={
                                confirmRegenerateCertificate
                            }
                            onDeleteCertificate={confirmDeleteCertificate}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            stats={stats}
                        />
                    </div>
                </div>

                {/* Modals */}
                <CertificateDetailModal
                    isOpen={showCertificateModal}
                    onClose={() => {
                        setShowCertificateModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={selectedCertificate}
                    onRevoke={confirmRevokeCertificate}
                    onRegenerate={confirmRegenerateCertificate}
                    onBulkExpire={confirmBulkExpire}
                />

                <RevokeCertificateModal
                    isOpen={showRevokeModal}
                    onClose={() => {
                        setShowRevokeModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={selectedCertificate}
                    onRevoke={handleRevokeCertificate}
                />

                <RegenerateCertificateModal
                    isOpen={showRegenerateModal}
                    onClose={() => {
                        setShowRegenerateModal(false);
                        setSelectedCertificate(null);
                    }}
                    certificate={selectedCertificate}
                    onRegenerate={handleRegenerateCertificate}
                />

                {/* NEW: Bulk Regenerate Modal */}
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

export default AdminCertificates;
