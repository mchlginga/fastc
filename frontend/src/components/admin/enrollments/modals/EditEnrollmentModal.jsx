import { useState, useEffect } from "react";
import { X } from "react-feather";
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
        }
    }, [enrollment]);

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "progress" ? parseInt(value) || 0 : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (formData.progress < 0 || formData.progress > 100) {
            newErrors.progress = "Progress must be between 0 and 100";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await adminEnrollmentService.updateEnrollment(
                enrollment._id,
                formData
            );
            onEnrollmentUpdated();
            handleClose();
        } catch (error) {
            console.error("Error updating enrollment:", error);
            setErrors({
                submit: error.message || "Failed to update enrollment",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !enrollment) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Enrollment
                        </h2>
                        <p className="text-sm text-gray-600">
                            {enrollment.user?.role === "company"
                                ? enrollment.user.companyName
                                : `${enrollment.user?.firstName} ${enrollment.user?.surname}`}{" "}
                            - {enrollment.course?.title}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Progress */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Progress (%)
                            </label>
                            <input
                                type="number"
                                name="progress"
                                value={formData.progress}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                                    errors.progress
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.progress && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.progress}
                                </p>
                            )}
                        </div>

                        {/* Access Until */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Access Until
                            </label>
                            <input
                                type="date"
                                name="accessUntil"
                                value={formData.accessUntil}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Date when enrollment access expires
                            </p>
                        </div>

                        {/* Current Enrollment Info */}
                        <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-medium text-gray-800 mb-2">
                                Current Enrollment
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>User:</span>
                                    <span className="font-medium">
                                        {enrollment.user?.role === "company"
                                            ? enrollment.user.companyName
                                            : `${enrollment.user?.firstName} ${enrollment.user?.surname}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Course:</span>
                                    <span className="font-medium">
                                        {enrollment.course?.title}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Enrolled:</span>
                                    <span className="font-medium">
                                        {new Date(
                                            enrollment.enrolledAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className="p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-xs text-red-600">
                                    {errors.submit}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update Enrollment"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEnrollmentModal;
