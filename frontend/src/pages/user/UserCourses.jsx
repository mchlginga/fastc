import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourses } from "../../services/courseService";
import {
    getUserEnrollments,
    enrollInCourse,
    cancelEnrollment,
} from "../../services/enrollmentService";
import { getUserCertificates } from "../../services/certificateService";

// Components
import {
    CoursesHeader,
    StatusTabs,
    AvailableCoursesSection,
    ActiveCoursesSection,
    PendingCoursesSection,
    CompletedCoursesSection,
} from "../../components/user/courses";

import {
    LoadingState,
    ErrorState,
    ProfileAlerts,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

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

function UserCourses() {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const statusFilter = searchParams.get("status");

    const [enrollments, setEnrollments] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(null);
    const [enrollmentStatus, setEnrollmentStatus] = useState({});
    const [cancellingEnrollment, setCancellingEnrollment] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Toast notification state
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Modal state
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        enrollmentId: null,
        courseTitle: "",
        isLoading: false,
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setLoadingError(null);

            const [enrollmentsResponse, coursesData, certificatesResponse] =
                await Promise.all([
                    getUserEnrollments(),
                    getCourses(),
                    getUserCertificates(),
                ]);

            setEnrollments(enrollmentsResponse.enrollments || []);
            setAvailableCourses(coursesData || []);
            setCertificates(certificatesResponse.certificates || []);
        } catch (err) {
            console.error("Fetch data error:", err);
            setLoadingError(err.message || "Failed to load courses");
            showToast("Failed to load courses. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

    // Toast notification helper
    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    const hideToast = () => {
        setToast({
            show: false,
            message: "",
            type: "success",
        });
    };

    // Modal handlers
    const showConfirmationModal = (enrollmentId, courseTitle) => {
        setConfirmationModal({
            isOpen: true,
            enrollmentId,
            courseTitle,
            isLoading: false,
        });
    };

    const hideConfirmationModal = () => {
        setConfirmationModal({
            isOpen: false,
            enrollmentId: null,
            courseTitle: "",
            isLoading: false,
        });
    };

    // Handle course card click
    const handleCourseClick = (courseId) => {
        navigate(`/user/courses/${courseId}/overview`);
    };

    // Filter courses based on search query
    const filterCoursesBySearch = (courses) => {
        if (!debouncedSearchQuery.trim()) return courses;

        const query = debouncedSearchQuery.toLowerCase().trim();
        return courses.filter(
            (course) =>
                course &&
                (course.title?.toLowerCase().includes(query) ||
                    course.description?.toLowerCase().includes(query) ||
                    course.category?.toLowerCase().includes(query) ||
                    course.skillLevel?.toLowerCase().includes(query))
        );
    };

    // Filter enrollments based on search query
    const filterEnrollmentsBySearch = (enrollmentsList) => {
        if (!debouncedSearchQuery.trim()) return enrollmentsList;

        const query = debouncedSearchQuery.toLowerCase().trim();
        return enrollmentsList.filter(
            (enrollment) =>
                enrollment &&
                enrollment.course &&
                (enrollment.course.title?.toLowerCase().includes(query) ||
                    enrollment.course.description
                        ?.toLowerCase()
                        .includes(query) ||
                    enrollment.course.category?.toLowerCase().includes(query))
        );
    };

    const handleEnroll = async (courseId, courseTitle) => {
        try {
            setEnrollmentStatus((prev) => ({
                ...prev,
                [courseId]: "enrolling",
            }));

            await enrollInCourse(courseId);

            // Refresh enrollments list
            const enrollmentsResponse = await getUserEnrollments();
            setEnrollments(enrollmentsResponse.enrollments || []);

            setEnrollmentStatus((prev) => ({
                ...prev,
                [courseId]: "success",
            }));

            showToast(`Enrollment request submitted!`, "success");

            setTimeout(() => {
                setEnrollmentStatus((prev) => ({
                    ...prev,
                    [courseId]: null,
                }));
            }, 2000);
        } catch (err) {
            console.error("Enrollment error:", err);
            setEnrollmentStatus((prev) => ({
                ...prev,
                [courseId]: "error",
            }));

            showToast(
                err.message ||
                    `Failed to enroll in "${courseTitle}". Please try again.`,
                "error"
            );

            setTimeout(() => {
                setEnrollmentStatus((prev) => ({
                    ...prev,
                    [courseId]: null,
                }));
            }, 3000);
        }
    };

    const handleCancelEnrollment = async (enrollmentId, courseTitle) => {
        showConfirmationModal(enrollmentId, courseTitle);
    };

    const confirmCancelEnrollment = async () => {
        const { enrollmentId, courseTitle } = confirmationModal;

        if (!enrollmentId) return;

        try {
            setConfirmationModal((prev) => ({ ...prev, isLoading: true }));
            setCancellingEnrollment(enrollmentId);

            await cancelEnrollment(enrollmentId);

            // Refresh enrollments list
            const enrollmentsResponse = await getUserEnrollments();
            setEnrollments(enrollmentsResponse.enrollments || []);

            showToast(
                `Enrollment in "${courseTitle}" has been cancelled.`,
                "success"
            );

            hideConfirmationModal();
        } catch (err) {
            console.error("Cancel enrollment error:", err);
            showToast(
                err.message ||
                    `Failed to cancel enrollment in "${courseTitle}". Please try again.`,
                "error"
            );
            hideConfirmationModal();
        } finally {
            setCancellingEnrollment(null);
        }
    };

    // Check if user is enrolled in a course
    const isUserEnrolled = (courseId) => {
        if (!courseId) return false;
        return enrollments.some(
            (enrollment) =>
                enrollment.course &&
                enrollment.course.id === courseId &&
                ["pending", "active", "completed"].includes(enrollment.status)
        );
    };

    // Get enrollment status for a course
    const getEnrollmentStatus = (courseId) => {
        if (!courseId) return null;
        const enrollment = enrollments.find(
            (e) => e.course && e.course.id === courseId
        );
        return enrollment ? enrollment.status : null;
    };

    if (loading) {
        return <LoadingState type="courses-skeleton" />;
    }

    if (loadingError) {
        return (
            <ErrorState
                message={loadingError}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Filter enrollments by status
    const currentEnrollments = enrollments.filter(
        (enrollment) => enrollment && enrollment.status === "active"
    );

    const pendingEnrollments = enrollments.filter(
        (enrollment) => enrollment && enrollment.status === "pending"
    );

    const completedEnrollments = enrollments.filter(
        (enrollment) => enrollment && enrollment.status === "completed"
    );

    // Filter available courses - only show courses user is NOT actively enrolled in
    const availableCoursesToShow = availableCourses.filter(
        (course) => course && course._id && !isUserEnrolled(course._id)
    );

    // Apply search filtering
    const filteredAvailableCourses = filterCoursesBySearch(
        availableCoursesToShow
    );
    const filteredCurrentEnrollments =
        filterEnrollmentsBySearch(currentEnrollments);
    const filteredPendingEnrollments =
        filterEnrollmentsBySearch(pendingEnrollments);
    const filteredCompletedEnrollments =
        filterEnrollmentsBySearch(completedEnrollments);

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Toast Notification */}
                {toast.show && (
                    <ToastNotification
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    onClose={hideConfirmationModal}
                    onConfirm={confirmCancelEnrollment}
                    title="Cancel Enrollment"
                    message={`Are you sure you want to cancel your enrollment in "${confirmationModal.courseTitle}"?`}
                    confirmText="Yes, Cancel Enrollment"
                    cancelText="Keep Enrollment"
                    type="warning"
                    isLoading={confirmationModal.isLoading}
                />

                {/* Profile Status Alerts */}
                <ProfileAlerts user={user} />

                {/* Header Section */}
                <CoursesHeader
                    statusFilter={statusFilter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Status Tabs */}
                <StatusTabs
                    statusFilter={statusFilter}
                    currentEnrollments={filteredCurrentEnrollments}
                    pendingEnrollments={filteredPendingEnrollments}
                    completedEnrollments={filteredCompletedEnrollments}
                />

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Available Courses */}
                    {!statusFilter && (
                        <AvailableCoursesSection
                            courses={filteredAvailableCourses}
                            user={user}
                            enrollmentStatus={enrollmentStatus}
                            onEnroll={handleEnroll}
                            onCourseClick={handleCourseClick}
                            isUserEnrolled={isUserEnrolled}
                            getEnrollmentStatus={getEnrollmentStatus}
                            searchQuery={debouncedSearchQuery}
                        />
                    )}

                    {/* Active Courses */}
                    {statusFilter === "active" && (
                        <ActiveCoursesSection
                            enrollments={filteredCurrentEnrollments}
                            cancellingEnrollment={cancellingEnrollment}
                            onCancelEnrollment={handleCancelEnrollment}
                            searchQuery={debouncedSearchQuery}
                        />
                    )}

                    {/* Pending Courses */}
                    {statusFilter === "pending" && (
                        <PendingCoursesSection
                            enrollments={filteredPendingEnrollments}
                            cancellingEnrollment={cancellingEnrollment}
                            onCancelEnrollment={handleCancelEnrollment}
                            searchQuery={debouncedSearchQuery}
                        />
                    )}

                    {/* Completed Courses */}
                    {statusFilter === "completed" && (
                        <CompletedCoursesSection
                            enrollments={filteredCompletedEnrollments}
                            certificates={certificates}
                            searchQuery={debouncedSearchQuery}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserCourses;
