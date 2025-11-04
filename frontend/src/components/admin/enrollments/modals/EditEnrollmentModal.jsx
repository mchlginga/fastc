import { useState, useRef, useEffect, useCallback } from "react";
import { X, Edit } from "react-feather";
import { adminEnrollmentService } from "../../../../services/userService";

const EditEnrollmentModal = ({
    isOpen,
    onClose,
    enrollment,
    onEnrollmentUpdated,
}) => {
    const [formData, setFormData] = useState({
        status: "active",
        progress: 0,
        accessUntil: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    // Initialize form when enrollment changes
    useEffect(() => {
        if (enrollment) {
            setFormData({
                status: enrollment.status || "active",
                progress: enrollment.progress || 0,
                accessUntil: enrollment.accessUntil
                    ? new Date(enrollment.accessUntil)
                          .toISOString()
                          .split("T")[0]
                    : "",
            });
            setErrors({});
        }
    }, [enrollment]);

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
            status: "active",
            progress: 0,
            accessUntil: "",
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

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (formData.progress < 0 || formData.progress > 100) {
            newErrors.progress = "Progress must be between 0 and 100";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // FIXED: Send empty string if accessUntil is empty
            const submissionData = {
                ...formData,
                accessUntil: formData.accessUntil || "", // Send empty string instead of undefined
            };

            await adminEnrollmentService.updateEnrollment(
                enrollment._id,
                submissionData
            );
            onEnrollmentUpdated();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error updating enrollment:", error);
            setErrors({
                submit:
                    error.message ||
                    "Failed to update enrollment. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !enrollment) return null;

    const getUserDisplayName = (user) => {
        if (!user) return "Unknown User";
        if (user.role === "company") {
            return user.companyName || "Unnamed Company";
        }
        const firstName = user.firstName || "";
        const surname = user.surname || "";
        const fullName = `${firstName} ${surname}`.trim();
        return fullName || user.email || "Unknown User";
    };

    const user = enrollment.user || {};
    const course = enrollment.course || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Enrollment
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {getUserDisplayName(user)} - {course.title}
                        </p>
                    </div>
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
                                    <option value="expired">Expired</option>
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

                        {/* Current Enrollment Info */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-2">
                                Current Enrollment Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">
                                        Enrolled:
                                    </span>
                                    <p className="font-medium">
                                        {enrollment.enrolledAt
                                            ? new Date(
                                                  enrollment.enrolledAt
                                              ).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-600">
                                        Last Updated:
                                    </span>
                                    <p className="font-medium">
                                        {enrollment.updatedAt
                                            ? new Date(
                                                  enrollment.updatedAt
                                              ).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>
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
                        disabled={loading}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            <>
                                <Edit size={16} className="mr-2" />
                                Update Enrollment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEnrollmentModal;
