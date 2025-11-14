import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Book } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminCourseService } from "../../services/userService";

// Components
import {
    CourseStats,
    CourseFilters,
    CourseTable,
} from "../../components/admin/courses";

import {
    AddCourseModal,
    EditCourseModal,
    CourseDetailModal,
} from "../../components/admin/courses/modals";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

// Skeleton Component
import AdminCoursesSkeleton from "../../components/admin/courses/AdminCoursesSkeleton";

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

function AdminCourses() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [categoryFilter, setCategoryFilter] = useState(
        searchParams.get("category") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        coursesPerPage: 10,
    });

    // Selected courses for bulk actions
    const [selectedCourses, setSelectedCourses] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Modals
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch courses with optimized dependencies
    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminCourseService.getCourses({
                search: debouncedSearchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                category: categoryFilter !== "all" ? categoryFilter : "",
                page: pagination.currentPage,
                limit: pagination.coursesPerPage,
            });

            setCourses(response.courses);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.pagination?.currentPage || 1,
                totalPages: response.pagination?.totalPages || 1,
                totalCourses:
                    response.pagination?.totalCourses ||
                    response.courses?.length ||
                    0,
            }));
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError(err.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchTerm,
        statusFilter,
        categoryFilter,
        pagination.currentPage,
        pagination.coursesPerPage,
    ]);

    // Fetch course stats
    const fetchCourseStats = useCallback(async () => {
        try {
            const response = await adminCourseService.getCourseStats();
            return response.stats;
        } catch (err) {
            console.error("Error fetching course stats:", err);
            return {
                total: 0,
                active: 0,
                inactive: 0,
                totalEnrollments: 0,
                totalLessons: 0,
            };
        }
    }, []);

    const handleRefresh = async () => {
        await fetchCourses();
    };

    // Initial fetch and when filters change
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.currentPage !== 1) {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }
    }, [debouncedSearchTerm, statusFilter, categoryFilter]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (categoryFilter !== "all") params.set("category", categoryFilter);
        if (pagination.currentPage > 1)
            params.set("page", pagination.currentPage);
        setSearchParams(params);
    }, [statusFilter, categoryFilter, pagination.currentPage, setSearchParams]);

    const handleStatusUpdate = async (courseId, newStatus) => {
        try {
            await adminCourseService.updateCourseStatus(courseId, newStatus);

            setCourses((prev) =>
                prev.map((course) =>
                    course._id === courseId
                        ? { ...course, isActive: newStatus === "active" }
                        : course
                )
            );

            setToastNotification({
                message: `Course status updated to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update course status",
                type: "error",
            });
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            const courseIds = Array.from(selectedCourses).filter(
                (id) => id && id.length > 0
            );

            if (courseIds.length === 0) {
                setToastNotification({
                    message: "No valid courses selected",
                    type: "error",
                });
                return;
            }

            await adminCourseService.bulkUpdateCourseStatus(
                courseIds,
                newStatus
            );

            setCourses((prev) =>
                prev.map((course) =>
                    selectedCourses.has(course._id)
                        ? { ...course, isActive: newStatus === "active" }
                        : course
                )
            );

            setSelectedCourses(new Set());
            setSelectAll(false);

            setToastNotification({
                message: `Updated ${selectedCourses.size} courses to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            console.error("Bulk status update error:", err);
            setToastNotification({
                message: err.message || "Failed to update courses",
                type: "error",
            });
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await adminCourseService.deleteCourse(courseId);
            setCourses((prev) =>
                prev.filter((course) => course._id !== courseId)
            );
            setToastNotification({
                message: "Course deleted successfully",
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete course",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkDelete = async () => {
        try {
            const courseIds = Array.from(selectedCourses).filter(
                (id) => id && id.length > 0
            );

            if (courseIds.length === 0) {
                setToastNotification({
                    message: "No valid courses selected",
                    type: "error",
                });
                return false;
            }

            const deletePromises = courseIds.map((courseId) =>
                adminCourseService.deleteCourse(courseId)
            );

            await Promise.all(deletePromises);
            setCourses((prev) =>
                prev.filter((course) => !selectedCourses.has(course._id))
            );
            setSelectedCourses(new Set());
            setSelectAll(false);

            setToastNotification({
                message: `Deleted ${selectedCourses.size} courses successfully`,
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete courses",
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
                success = await handleDeleteCourse(courseToDelete._id);
            }

            if (success) {
                setShowDeleteModal(false);
                setCourseToDelete(null);
                setBulkDelete(false);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditCourse = (course) => {
        setSelectedCourse(course);
        setShowEditCourseModal(true);
    };

    const handleCourseUpdated = () => {
        fetchCourses();
        setToastNotification({
            message: "Course updated successfully",
            type: "success",
        });
    };

    const handleCourseAdded = () => {
        fetchCourses();
        setToastNotification({
            message: "Course created successfully",
            type: "success",
        });
    };

    const confirmDeleteCourse = (course) => {
        setCourseToDelete(course);
        setBulkDelete(false);
        setShowDeleteModal(true);
    };

    const confirmBulkDelete = () => {
        if (selectedCourses.size === 0) return;
        setCourseToDelete(null);
        setBulkDelete(true);
        setShowDeleteModal(true);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCourses(new Set());
        } else {
            const allIds = new Set(courses.map((course) => course._id));
            setSelectedCourses(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectCourse = (courseId) => {
        const newSelected = new Set(selectedCourses);
        if (newSelected.has(courseId)) {
            newSelected.delete(courseId);
        } else {
            newSelected.add(courseId);
        }
        setSelectedCourses(newSelected);
        setSelectAll(newSelected.size === courses.length);
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        setSelectedCourses(new Set());
        setSelectAll(false);

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCoursesPerPageChange = (newPerPage) => {
        setPagination((prev) => ({
            ...prev,
            coursesPerPage: newPerPage,
            currentPage: 1,
        }));
        setSelectedCourses(new Set());
        setSelectAll(false);
    };

    const getStats = () => {
        const total = pagination.totalCourses;
        const active = courses.filter((c) => c.isActive).length;
        const inactive = courses.filter((c) => !c.isActive).length;
        const totalEnrollments = courses.reduce(
            (sum, course) => sum + (course.enrollmentCount || 0),
            0
        );
        const totalLessons = courses.reduce(
            (sum, course) => sum + (course.lessons?.length || 0),
            0
        );

        return {
            total,
            active,
            inactive,
            totalEnrollments,
            totalLessons,
        };
    };

    const stats = getStats();

    if (loading && courses.length === 0) {
        return <AdminCoursesSkeleton />;
    }

    if (error && courses.length === 0) {
        return <ErrorState message={error} onRetry={fetchCourses} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Course Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage training courses, content, and
                                availability
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <CourseStats
                        stats={stats}
                        loading={loading && courses.length > 0}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100">
                        <CourseFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            selectedCourses={selectedCourses}
                            onAddCourse={() => setShowAddCourseModal(true)}
                            onBulkStatusUpdate={handleBulkStatusUpdate}
                            onBulkDelete={confirmBulkDelete}
                            stats={stats}
                            onRefresh={handleRefresh}
                            loading={loading && courses.length > 0}
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <CourseTable
                            courses={courses}
                            selectedCourses={selectedCourses}
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                            onSelectCourse={handleSelectCourse}
                            onViewCourse={(course) => {
                                setSelectedCourse(course);
                                setShowCourseModal(true);
                            }}
                            onEditCourse={handleEditCourse}
                            onStatusUpdate={handleStatusUpdate}
                            onDeleteCourse={confirmDeleteCourse}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            stats={stats}
                            loading={loading && courses.length > 0}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onCoursesPerPageChange={
                                    handleCoursesPerPageChange
                                }
                                loading={loading && courses.length > 0}
                            />
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AddCourseModal
                    isOpen={showAddCourseModal}
                    onClose={() => setShowAddCourseModal(false)}
                    onCourseAdded={handleCourseAdded}
                />

                <EditCourseModal
                    isOpen={showEditCourseModal}
                    onClose={() => {
                        setShowEditCourseModal(false);
                        setSelectedCourse(null);
                    }}
                    course={selectedCourse}
                    onCourseUpdated={handleCourseUpdated}
                />

                <CourseDetailModal
                    isOpen={showCourseModal}
                    onClose={() => {
                        setShowCourseModal(false);
                        setSelectedCourse(null);
                    }}
                    course={selectedCourse}
                    onStatusUpdate={handleStatusUpdate}
                    onEdit={handleEditCourse}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        if (!deleteLoading) {
                            setShowDeleteModal(false);
                            setCourseToDelete(null);
                            setBulkDelete(false);
                        }
                    }}
                    onConfirm={handleDeleteConfirm}
                    title={
                        bulkDelete
                            ? `Delete ${selectedCourses.size} Courses?`
                            : "Delete Course?"
                    }
                    message={
                        bulkDelete
                            ? `Are you sure you want to delete ${selectedCourses.size} courses? This action cannot be undone.`
                            : `Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`
                    }
                    confirmText={
                        bulkDelete
                            ? `Delete ${selectedCourses.size} Courses`
                            : "Delete Course"
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
    onCoursesPerPageChange,
    loading = false,
}) => {
    const { currentPage, totalPages, totalCourses, coursesPerPage } =
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
            {/* Courses per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                    value={coursesPerPage}
                    onChange={(e) =>
                        onCoursesPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    disabled={loading}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">courses per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * coursesPerPage + 1} to{" "}
                {Math.min(currentPage * coursesPerPage, totalCourses)} of{" "}
                {totalCourses} courses
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

export default AdminCourses;
