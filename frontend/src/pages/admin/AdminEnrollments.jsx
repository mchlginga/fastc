import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Users } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminEnrollmentService } from "../../services/userService";

// Components
import {
    EnrollmentStats,
    EnrollmentFilters,
    EnrollmentTable,
} from "../../components/admin/enrollments";

import {
    AddEnrollmentModal,
    EditEnrollmentModal,
    EnrollmentDetailModal,
} from "../../components/admin/enrollments/modals";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

// Skeleton Component
import AdminEnrollmentsSkeleton from "../../components/admin/enrollments/AdminEnrollmentsSkeleton";

function AdminEnrollments() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [enrollments, setEnrollments] = useState([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        active: 0,
        completed: 0,
        cancelled: 0,
        expired: 0,
        averageProgress: 0,
        recentEnrollments: 0,
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

    // Selected enrollments for bulk actions
    const [selectedEnrollments, setSelectedEnrollments] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Modals
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddEnrollmentModal, setShowAddEnrollmentModal] = useState(false);
    const [showEditEnrollmentModal, setShowEditEnrollmentModal] =
        useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch enrollments and stats
    useEffect(() => {
        fetchEnrollments();
        fetchEnrollmentStats();
    }, []);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (courseFilter !== "all") params.set("course", courseFilter);
        if (userFilter !== "all") params.set("user", userFilter);
        setSearchParams(params);
    }, [statusFilter, courseFilter, userFilter, setSearchParams]);

    // Filter enrollments when search or filters change
    useEffect(() => {
        let filtered = enrollments;

        if (searchTerm) {
            filtered = filtered.filter(
                (enrollment) =>
                    enrollment.user?.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.user?.surname
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.user?.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.user?.companyName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.course?.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (enrollment) => enrollment.status === statusFilter
            );
        }

        if (courseFilter !== "all") {
            filtered = filtered.filter(
                (enrollment) => enrollment.course?._id === courseFilter
            );
        }

        if (userFilter !== "all") {
            filtered = filtered.filter(
                (enrollment) => enrollment.user?._id === userFilter
            );
        }

        setFilteredEnrollments(filtered);
    }, [enrollments, searchTerm, statusFilter, courseFilter, userFilter]);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const response = await adminEnrollmentService.getEnrollments({
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                user: userFilter !== "all" ? userFilter : "",
                page: 1,
                limit: 50,
            });
            setEnrollments(response.enrollments);
        } catch (err) {
            setError(err.message || "Failed to load enrollments");
            console.error("Error fetching enrollments:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollmentStats = async () => {
        try {
            const response = await adminEnrollmentService.getEnrollmentStats();
            setStats(response.stats);
        } catch (err) {
            console.error("Error fetching enrollment stats:", err);
        }
    };

    const handleStatusUpdate = async (enrollmentId, newStatus) => {
        try {
            await adminEnrollmentService.updateEnrollmentStatus(
                enrollmentId,
                newStatus
            );

            setEnrollments((prev) =>
                prev.map((enrollment) =>
                    enrollment._id === enrollmentId
                        ? { ...enrollment, status: newStatus }
                        : enrollment
                )
            );

            // Refresh stats
            fetchEnrollmentStats();

            setToastNotification({
                message: `Enrollment status updated to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update enrollment status",
                type: "error",
            });
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            await adminEnrollmentService.bulkUpdateEnrollmentStatus(
                Array.from(selectedEnrollments),
                newStatus
            );

            setEnrollments((prev) =>
                prev.map((enrollment) =>
                    selectedEnrollments.has(enrollment._id)
                        ? { ...enrollment, status: newStatus }
                        : enrollment
                )
            );

            setSelectedEnrollments(new Set());
            setSelectAll(false);

            // Refresh stats
            fetchEnrollmentStats();

            setToastNotification({
                message: `Updated ${selectedEnrollments.size} enrollments to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update enrollments",
                type: "error",
            });
        }
    };

    const handleDeleteEnrollment = async (enrollmentId) => {
        try {
            await adminEnrollmentService.deleteEnrollment(enrollmentId);
            setEnrollments((prev) =>
                prev.filter((enrollment) => enrollment._id !== enrollmentId)
            );

            // Refresh stats
            fetchEnrollmentStats();

            setToastNotification({
                message: "Enrollment deleted successfully",
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete enrollment",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkDelete = async () => {
        try {
            const deletePromises = Array.from(selectedEnrollments).map(
                (enrollmentId) =>
                    adminEnrollmentService.deleteEnrollment(enrollmentId)
            );

            await Promise.all(deletePromises);

            setEnrollments((prev) =>
                prev.filter(
                    (enrollment) => !selectedEnrollments.has(enrollment._id)
                )
            );
            setSelectedEnrollments(new Set());
            setSelectAll(false);

            // Refresh stats
            fetchEnrollmentStats();

            setToastNotification({
                message: `Deleted ${selectedEnrollments.size} enrollments successfully`,
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete enrollments",
                type: "error",
            });
            throw err;
        }
    };

    const handleEditEnrollment = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowEditEnrollmentModal(true);
    };

    const handleEnrollmentUpdated = () => {
        fetchEnrollments();
        fetchEnrollmentStats();
        setToastNotification({
            message: "Enrollment updated successfully",
            type: "success",
        });
    };

    const handleEnrollmentAdded = () => {
        fetchEnrollments();
        fetchEnrollmentStats();
        setToastNotification({
            message: "Enrollment created successfully",
            type: "success",
        });
    };

    const confirmDeleteEnrollment = (enrollment) => {
        setEnrollmentToDelete(enrollment);
        setBulkDelete(false);
        setShowDeleteModal(true);
    };

    const confirmBulkDelete = () => {
        if (selectedEnrollments.size === 0) return;
        setEnrollmentToDelete(null);
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
                success = await handleDeleteEnrollment(enrollmentToDelete._id);
            }

            if (success) {
                setShowDeleteModal(false);
                setEnrollmentToDelete(null);
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
            setSelectedEnrollments(new Set());
        } else {
            const allIds = new Set(
                filteredEnrollments.map((enrollment) => enrollment._id)
            );
            setSelectedEnrollments(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectEnrollment = (enrollmentId) => {
        const newSelected = new Set(selectedEnrollments);
        if (newSelected.has(enrollmentId)) {
            newSelected.delete(enrollmentId);
        } else {
            newSelected.add(enrollmentId);
        }
        setSelectedEnrollments(newSelected);
        setSelectAll(newSelected.size === filteredEnrollments.length);
    };

    if (loading) {
        return <AdminEnrollmentsSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchEnrollments} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <Users size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Enrollment Management
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage course enrollments, track progress, and handle
                        approvals
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <EnrollmentStats stats={stats} />
                </div>

                {/* Unified Container for Filters and Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <EnrollmentFilters
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
                            selectedEnrollments={selectedEnrollments}
                            onAddEnrollment={() =>
                                setShowAddEnrollmentModal(true)
                            }
                            onBulkStatusUpdate={handleBulkStatusUpdate}
                            onBulkDelete={confirmBulkDelete}
                            stats={stats}
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <EnrollmentTable
                            enrollments={filteredEnrollments}
                            selectedEnrollments={selectedEnrollments}
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                            onSelectEnrollment={handleSelectEnrollment}
                            onViewEnrollment={(enrollment) => {
                                setSelectedEnrollment(enrollment);
                                setShowUserModal(true);
                            }}
                            onEditEnrollment={handleEditEnrollment}
                            onStatusUpdate={handleStatusUpdate}
                            onDeleteEnrollment={confirmDeleteEnrollment}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            stats={stats}
                        />
                    </div>
                </div>

                {/* Modals */}
                <AddEnrollmentModal
                    isOpen={showAddEnrollmentModal}
                    onClose={() => setShowAddEnrollmentModal(false)}
                    onEnrollmentAdded={handleEnrollmentAdded}
                />

                <EditEnrollmentModal
                    isOpen={showEditEnrollmentModal}
                    onClose={() => {
                        setShowEditEnrollmentModal(false);
                        setSelectedEnrollment(null);
                    }}
                    enrollment={selectedEnrollment}
                    onEnrollmentUpdated={handleEnrollmentUpdated}
                />

                <EnrollmentDetailModal
                    isOpen={showUserModal}
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedEnrollment(null);
                    }}
                    enrollment={selectedEnrollment}
                    onStatusUpdate={handleStatusUpdate}
                    onEdit={handleEditEnrollment}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        if (!deleteLoading) {
                            setShowDeleteModal(false);
                            setEnrollmentToDelete(null);
                            setBulkDelete(false);
                        }
                    }}
                    onConfirm={handleDeleteConfirm}
                    title={
                        bulkDelete
                            ? `Delete ${selectedEnrollments.size} Enrollments?`
                            : "Delete Enrollment?"
                    }
                    message={
                        bulkDelete
                            ? `Are you sure you want to delete ${selectedEnrollments.size} enrollments? This action cannot be undone.`
                            : `Are you sure you want to delete the enrollment for ${
                                  enrollmentToDelete?.user?.role === "company"
                                      ? enrollmentToDelete?.user?.companyName
                                      : `${enrollmentToDelete?.user?.firstName} ${enrollmentToDelete?.user?.surname}`
                              } - ${
                                  enrollmentToDelete?.course?.title
                              }? This action cannot be undone.`
                    }
                    confirmText={
                        bulkDelete
                            ? `Delete ${selectedEnrollments.size} Enrollments`
                            : "Delete Enrollment"
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

export default AdminEnrollments;
