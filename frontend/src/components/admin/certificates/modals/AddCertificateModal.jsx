import { useState, useCallback, useRef, useEffect } from "react";
import { X } from "react-feather";
import { adminCertificateService } from "../../../../services/userService";
import { adminUserService } from "../../../../services/userService";
import { adminCourseService } from "../../../../services/userService";
import { adminEnrollmentService } from "../../../../services/userService";

const AddCertificateModal = ({ isOpen, onClose, onCertificateAdded }) => {
    const [formData, setFormData] = useState({
        userId: "",
        courseId: "",
        enrollmentId: "",
        completionDate: new Date().toISOString().split("T")[0],
        expirationDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const modalRef = useRef(null);

    // Fetch users and courses when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchUsersAndCourses();
        }
    }, [isOpen]);

    // Fetch enrollments when user and course are selected
    useEffect(() => {
        if (formData.userId && formData.courseId) {
            fetchEnrollments();
        } else {
            setEnrollments([]);
        }
    }, [formData.userId, formData.courseId]);

    // Calculate default expiration date (1 year from completion)
    useEffect(() => {
        if (formData.completionDate && !formData.expirationDate) {
            const completionDate = new Date(formData.completionDate);
            const expirationDate = new Date(completionDate);
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            setFormData((prev) => ({
                ...prev,
                expirationDate: expirationDate.toISOString().split("T")[0],
            }));
        }
    }, [formData.completionDate, formData.expirationDate]);

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

    const fetchEnrollments = async () => {
        try {
            const response = await adminEnrollmentService.getEnrollments({
                user: formData.userId,
                course: formData.courseId,
                limit: 50,
            });
            setEnrollments(response.enrollments || []);
        } catch (err) {
            console.error("Error fetching enrollments:", err);
            setEnrollments([]);
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
            enrollmentId: "",
            completionDate: new Date().toISOString().split("T")[0],
            expirationDate: "",
        });
        setErrors({});
        setEnrollments([]);
    }, []);

    const handleClose = () => {
        if (loading) return;
        resetForm();
        onClose();
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.userId) {
            newErrors.userId = "User is required";
        }

        if (!formData.courseId) {
            newErrors.courseId = "Course is required";
        }

        if (!formData.completionDate) {
            newErrors.completionDate = "Completion date is required";
        }

        if (!formData.expirationDate) {
            newErrors.expirationDate = "Expiration date is required";
        }

        if (formData.completionDate && formData.expirationDate) {
            const completion = new Date(formData.completionDate);
            const expiration = new Date(formData.expirationDate);
            if (expiration <= completion) {
                newErrors.expirationDate =
                    "Expiration date must be after completion date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const certificateData = {
                userId: formData.userId,
                courseId: formData.courseId,
                enrollmentId: formData.enrollmentId || undefined,
                completionDate: formData.completionDate,
                expirationDate: formData.expirationDate,
            };

            await adminCertificateService.createCertificate(certificateData);
            onCertificateAdded();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating certificate:", error);
            setErrors({
                submit:
                    error.message ||
                    "Failed to create certificate. Please try again.",
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
                        Create New Certificate
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
                                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors cursor-pointer"
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

                        {/* Enrollment Selection (Optional) */}
                        {formData.userId && formData.courseId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Enrollment (Optional)
                                </label>
                                <select
                                    name="enrollmentId"
                                    value={formData.enrollmentId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <option value="">
                                        Select Enrollment (Optional)
                                    </option>
                                    {enrollments.map((enrollment) => (
                                        <option
                                            key={enrollment._id}
                                            value={enrollment._id}
                                        >
                                            Enrollment - {enrollment.status}{" "}
                                            (Progress: {enrollment.progress}%)
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-2 text-xs text-gray-500">
                                    Linking to an enrollment helps track
                                    certificate origins
                                </p>
                            </div>
                        )}

                        {/* Date Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Completion Date *
                                </label>
                                <input
                                    type="date"
                                    name="completionDate"
                                    value={formData.completionDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.completionDate
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.completionDate && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.completionDate}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Expiration Date *
                                </label>
                                <input
                                    type="date"
                                    name="expirationDate"
                                    value={formData.expirationDate}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.expirationDate
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.expirationDate && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.expirationDate}
                                    </p>
                                )}
                            </div>
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
                            "Create Certificate"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCertificateModal;
