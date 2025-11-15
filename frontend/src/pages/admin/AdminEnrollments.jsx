import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Users } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminEnrollmentService } from "../../services/userService";

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

import {
    LoadingState,
    ErrorState,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

import AdminEnrollmentsSkeleton from "../../components/admin/enrollments/AdminEnrollmentsSkeleton";

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

function AdminEnrollments() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(activeSearchTerm, 500);
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

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalEnrollments: 0,
        enrollmentsPerPage: 10,
    });

    const [selectedEnrollments, setSelectedEnrollments] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddEnrollmentModal, setShowAddEnrollmentModal] = useState(false);
    const [showEditEnrollmentModal, setShowEditEnrollmentModal] =
        useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    const fetchEnrollments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminEnrollmentService.getEnrollments({
                search: debouncedSearchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                user: userFilter !== "all" ? userFilter : "",
                page: pagination.currentPage,
                limit: pagination.enrollmentsPerPage,
            });

            setEnrollments(response.enrollments);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.pagination?.currentPage || 1,
                totalPages: response.pagination?.totalPages || 1,
                totalEnrollments:
                    response.pagination?.totalEnrollments ||
                    response.enrollments?.length ||
                    0,
            }));
        } catch (err) {
            console.error("Error fetching enrollments:", err);
            setError(err.message || "Failed to load enrollments");
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchTerm,
        statusFilter,
        courseFilter,
        userFilter,
        pagination.currentPage,
        pagination.enrollmentsPerPage,
    ]);

    const fetchEnrollmentStats = async () => {
        try {
            const response = await adminEnrollmentService.getEnrollmentStats();
            setStats(
                response.stats || {
                    total: 0,
                    pending: 0,
                    active: 0,
                    completed: 0,
                    cancelled: 0,
                    expired: 0,
                    averageProgress: 0,
                    recentEnrollments: 0,
                }
            );
        } catch (err) {
            console.error("Error fetching enrollment stats:", err);
        }
    };

    const handleSearch = useCallback(() => {
        setActiveSearchTerm(searchTerm);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        setSelectedEnrollments(new Set());
        setSelectAll(false);
    }, [searchTerm]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");
        setActiveSearchTerm("");
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        setSelectedEnrollments(new Set());
        setSelectAll(false);
    }, []);

    useEffect(() => {
        fetchEnrollments();
        fetchEnrollmentStats();
    }, [fetchEnrollments]);

    useEffect(() => {
        if (pagination.currentPage !== 1) {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }
    }, [debouncedSearchTerm, statusFilter, courseFilter, userFilter]);

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
            const enrollmentIds = Array.from(selectedEnrollments).filter(
                (id) => id && id.length > 0
            );

            if (enrollmentIds.length === 0) {
                setToastNotification({
                    message: "No valid enrollments selected",
                    type: "error",
                });
                return;
            }

            await adminEnrollmentService.bulkUpdateEnrollmentStatus(
                enrollmentIds,
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

            fetchEnrollmentStats();

            setToastNotification({
                message: `Updated ${selectedEnrollments.size} enrollments to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            console.error("Bulk status update error:", err);
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
            const enrollmentIds = Array.from(selectedEnrollments).filter(
                (id) => id && id.length > 0
            );

            if (enrollmentIds.length === 0) {
                setToastNotification({
                    message: "No valid enrollments selected",
                    type: "error",
                });
                return false;
            }

            const deletePromises = enrollmentIds.map((enrollmentId) =>
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

    const handleApproveEnrollment = async (enrollmentId) => {
        try {
            await adminEnrollmentService.approveEnrollment(enrollmentId);

            setEnrollments((prev) =>
                prev.map((enrollment) =>
                    enrollment._id === enrollmentId
                        ? {
                              ...enrollment,
                              status: "active",
                              enrolledAt: new Date().toISOString(),
                          }
                        : enrollment
                )
            );

            fetchEnrollmentStats();

            setToastNotification({
                message: "Enrollment approved successfully",
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to approve enrollment",
                type: "error",
            });
        }
    };

    const handleBulkApproveEnrollments = async () => {
        try {
            const enrollmentIds = Array.from(selectedEnrollments).filter(
                (id) => id && id.length > 0
            );

            if (enrollmentIds.length === 0) {
                setToastNotification({
                    message: "No valid enrollments selected",
                    type: "error",
                });
                return;
            }

            const pendingEnrollments = enrollments.filter(
                (enrollment) =>
                    selectedEnrollments.has(enrollment._id) &&
                    enrollment.status === "pending"
            );

            if (pendingEnrollments.length === 0) {
                setToastNotification({
                    message:
                        "No pending enrollments selected. Only pending enrollments can be approved.",
                    type: "warning",
                });
                return;
            }

            console.log(
                `Approving ${pendingEnrollments.length} pending enrollments...`
            );

            await adminEnrollmentService.bulkApproveEnrollments(enrollmentIds);

            setEnrollments((prev) =>
                prev.map((enrollment) =>
                    selectedEnrollments.has(enrollment._id) &&
                    enrollment.status === "pending"
                        ? {
                              ...enrollment,
                              status: "active",
                              enrolledAt: new Date().toISOString(),
                          }
                        : enrollment
                )
            );

            setSelectedEnrollments(new Set());
            setSelectAll(false);

            fetchEnrollmentStats();

            setToastNotification({
                message: `Approved ${pendingEnrollments.length} pending enrollments successfully`,
                type: "success",
            });
        } catch (err) {
            console.error("Bulk approval error:", err);
            setToastNotification({
                message: err.message || "Failed to approve enrollments",
                type: "error",
            });
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

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEnrollments(new Set());
        } else {
            const allIds = new Set(
                enrollments.map((enrollment) => enrollment._id)
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
        setSelectAll(newSelected.size === enrollments.length);
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        setSelectedEnrollments(new Set());
        setSelectAll(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEnrollmentsPerPageChange = (newPerPage) => {
        setPagination((prev) => ({
            ...prev,
            enrollmentsPerPage: newPerPage,
            currentPage: 1,
        }));
        setSelectedEnrollments(new Set());
        setSelectAll(false);
    };

    if (loading && enrollments.length === 0) {
        return <AdminEnrollmentsSkeleton />;
    }

    if (error && enrollments.length === 0) {
        return <ErrorState message={error} onRetry={fetchEnrollments} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Enrollment Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage course enrollments, track progress, and
                                handle approvals
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <EnrollmentStats
                        stats={stats}
                        loading={loading && enrollments.length > 0}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <EnrollmentFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onSearch={handleSearch}
                            onClearSearch={handleClearSearch}
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
                            onBulkApproveEnrollments={
                                handleBulkApproveEnrollments
                            }
                            onBulkDelete={confirmBulkDelete}
                            stats={stats}
                            loading={loading && enrollments.length > 0}
                            onRefresh={fetchEnrollments}
                        />
                    </div>

                    <div>
                        <EnrollmentTable
                            enrollments={enrollments}
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
                            onApproveEnrollment={handleApproveEnrollment}
                            onDeleteEnrollment={confirmDeleteEnrollment}
                            statusFilter={statusFilter}
                            courseFilter={courseFilter}
                            userFilter={userFilter}
                            searchTerm={searchTerm}
                            stats={stats}
                            loading={loading && enrollments.length > 0}
                        />
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onEnrollmentsPerPageChange={
                                    handleEnrollmentsPerPageChange
                                }
                                loading={loading && enrollments.length > 0}
                            />
                        </div>
                    )}
                </div>

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

const Pagination = ({
    pagination,
    onPageChange,
    onEnrollmentsPerPageChange,
    loading = false,
}) => {
    const { currentPage, totalPages, totalEnrollments, enrollmentsPerPage } =
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
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                    value={enrollmentsPerPage}
                    onChange={(e) =>
                        onEnrollmentsPerPageChange(Number(e.target.value))
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
                    enrollments per page
                </span>
            </div>

            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * enrollmentsPerPage + 1} to{" "}
                {Math.min(currentPage * enrollmentsPerPage, totalEnrollments)}{" "}
                of {totalEnrollments} enrollments
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    «
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ‹
                </button>

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

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ›
                </button>

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

export default AdminEnrollments;
