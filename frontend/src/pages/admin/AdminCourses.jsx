import { useState, useEffect } from "react";
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

function AdminCourses() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        totalEnrollments: 0,
        totalLessons: 0,
    });

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [categoryFilter, setCategoryFilter] = useState(
        searchParams.get("category") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

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

    // Fetch courses and stats
    useEffect(() => {
        fetchCourses();
        fetchCourseStats();
    }, []);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (categoryFilter !== "all") params.set("category", categoryFilter);
        setSearchParams(params);
    }, [statusFilter, categoryFilter, setSearchParams]);

    // Filter courses when search or filters change
    useEffect(() => {
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(
                (course) =>
                    course.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    course.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    course.category
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    course.tags?.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (course) =>
                    (statusFilter === "active" && course.isActive) ||
                    (statusFilter === "inactive" && !course.isActive)
            );
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter(
                (course) => course.category === categoryFilter
            );
        }

        setFilteredCourses(filtered);
    }, [courses, searchTerm, statusFilter, categoryFilter]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await adminCourseService.getCourses({
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                category: categoryFilter !== "all" ? categoryFilter : "",
                page: 1,
                limit: 50,
            });
            setCourses(response.courses);
        } catch (err) {
            setError(err.message || "Failed to load courses");
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseStats = async () => {
        try {
            const response = await adminCourseService.getCourseStats();
            setStats(response.stats);
        } catch (err) {
            console.error("Error fetching course stats:", err);
        }
    };

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

            // Refresh stats
            fetchCourseStats();

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
            await adminCourseService.bulkUpdateCourseStatus(
                Array.from(selectedCourses),
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

            // Refresh stats
            fetchCourseStats();

            setToastNotification({
                message: `Updated ${selectedCourses.size} courses to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update courses",
                type: "error",
            });
        }
    };

    // UPDATED: Handle delete course with proper modal closing
    const handleDeleteCourse = async (courseId) => {
        try {
            await adminCourseService.deleteCourse(courseId);
            setCourses((prev) =>
                prev.filter((course) => course._id !== courseId)
            );

            // Refresh stats
            fetchCourseStats();

            setToastNotification({
                message: "Course deleted successfully",
                type: "success",
            });
            return true; // Return success
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete course",
                type: "error",
            });
            throw err;
        }
    };

    // UPDATED: Handle bulk delete with proper modal closing
    const handleBulkDelete = async () => {
        try {
            // Gawin kagaya ng users - individual delete calls
            const deletePromises = Array.from(selectedCourses).map((courseId) =>
                adminCourseService.deleteCourse(courseId)
            );

            await Promise.all(deletePromises);

            // Remove deleted courses from state
            setCourses((prev) =>
                prev.filter((course) => !selectedCourses.has(course._id))
            );

            setSelectedCourses(new Set());
            setSelectAll(false);

            // Refresh stats
            fetchCourseStats();

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

    // UPDATED: Handle delete confirmation with loading state
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
                // Close modal only on success
                setShowDeleteModal(false);
                setCourseToDelete(null);
                setBulkDelete(false);
            }
        } catch (error) {
            // Error is already handled in the delete functions, just keep modal open
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
        fetchCourseStats();
        setToastNotification({
            message: "Course updated successfully",
            type: "success",
        });
    };

    // UPDATED: Handle course added with toast notification
    const handleCourseAdded = () => {
        fetchCourses();
        fetchCourseStats();
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
            const allIds = new Set(filteredCourses.map((course) => course._id));
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
        setSelectAll(newSelected.size === filteredCourses.length);
    };

    if (loading) {
        return <AdminCoursesSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchCourses} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <Book size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Course Management
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage training courses, content, and availability
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <CourseStats stats={stats} />
                </div>

                {/* Unified Container for Filters and Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100 bg-white">
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
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <CourseTable
                            courses={filteredCourses}
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
                        />
                    </div>
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

                {/* UPDATED: Use common ConfirmationModal */}
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

export default AdminCourses;
