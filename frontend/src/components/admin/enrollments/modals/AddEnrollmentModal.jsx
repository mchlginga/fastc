import { useState, useCallback, useRef, useEffect } from "react";
import { X } from "react-feather";
import { adminEnrollmentService } from "../../../../services/userService";
import { adminUserService } from "../../../../services/userService";
import { adminCourseService } from "../../../../services/userService";

const AddEnrollmentModal = ({ isOpen, onClose, onEnrollmentAdded }) => {
    const [formData, setFormData] = useState({
        userId: "",
        courseId: "",
        status: "active",
        accessUntil: "",
        progress: 0,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const modalRef = useRef(null);

    // Fetch users and courses when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchUsersAndCourses();
        }
    }, [isOpen]);

    const fetchUsersAndCourses = async () => {
        try {
            setLoadingData(true);
            const [usersResponse, coursesResponse] = await Promise.all([
                adminUserService.getUsers({ limit: 1000 }),
                adminCourseService.getCourses({ limit: 1000 }),
            ]);

            setUsers(usersResponse.users || []);
            setCourses(coursesResponse.courses || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setErrors({ fetch: "Failed to load users and courses" });
        } finally {
            setLoadingData(false);
        }
    };

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const resetForm = useCallback(() => {
        setFormData({
            userId: "",
            courseId: "",
            status: "active",
            accessUntil: "",
            progress: 0,
        });
        setErrors({});
    }, []);

    const handleClose = () => {
        if (loading) return;
        resetForm();
        onClose();
    };

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: name === "progress" ? parseInt(value) || 0 : value,
            }));
            setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
            if (errors.submit) {
                setErrors((prev) => ({ ...prev, submit: "" }));
            }
        },
        [errors]
    );

    //  REMOVED: Auto-set access until date. Let it be empty by default.

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.userId) {
            newErrors.userId = "User is required";
        }

        if (!formData.courseId) {
            newErrors.courseId = "Course is required";
        }

        if (formData.progress < 0 || formData.progress > 100) {
            newErrors.progress = "Progress must be between 0 and 100";
        }

        //  FIXED: Remove accessUntil validation to allow empty values

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            //  FIXED: Send empty string if accessUntil is empty
            const submissionData = {
                ...formData,
                accessUntil: formData.accessUntil || "", // Send empty string instead of undefined
            };

            await adminEnrollmentService.createEnrollment(submissionData);
            onEnrollmentAdded();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating enrollment:", error);
            setErrors({
                submit:
                    error.message ||
                    "Failed to create enrollment. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add New Enrollment
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Fetch Error */}
                        {errors.fetch && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                                <p className="text-sm text-red-600 mb-3">
                                    {errors.fetch}
                                </p>
                                <button
                                    type="button"
                                    onClick={fetchUsersAndCourses}
                                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* User Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                User *
                            </label>
                            {loadingData ? (
                                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                            ) : (
                                <select
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 ${
                                        errors.userId
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                >
                                    <option value="">Select User</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.role === "company"
                                                ? `${user.companyName} (Company)`
                                                : `${user.firstName} ${user.surname} (${user.email})`}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.userId && (
                                <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                    {errors.userId}
                                </p>
                            )}
                        </div>

                        {/* Course Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Course *
                            </label>
                            {loadingData ? (
                                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                </div>
                            ) : (
                                <select
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 ${
                                        errors.courseId
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.title} ({course.category})
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.courseId && (
                                <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                    {errors.courseId}
                                </p>
                            )}
                        </div>

                        {/* Status and Progress */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Progress (%)
                                </label>
                                <input
                                    type="number"
                                    name="progress"
                                    value={formData.progress}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text disabled:opacity-50 ${
                                        errors.progress
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.progress && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.progress}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Access Until */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Access Until
                            </label>
                            <input
                                type="date"
                                name="accessUntil"
                                value={formData.accessUntil}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text disabled:opacity-50"
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>Optional:</strong> Date when enrollment
                                access expires. Leave empty for self-paced
                                courses with no expiration.
                            </p>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                                <p className="text-sm text-red-600">
                                    {errors.submit}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || loadingData}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            "Create Enrollment"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEnrollmentModal;
