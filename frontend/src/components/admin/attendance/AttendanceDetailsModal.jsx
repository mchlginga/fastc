import { useState, useRef, useEffect } from "react";
import {
    X,
    User,
    Calendar,
    Book,
    CheckCircle,
    Clock,
    AlertTriangle,
    Image,
    Check,
    ExternalLink,
} from "react-feather";

const AttendanceDetailsModal = ({ record, onClose, onManualVerify }) => {
    const modalRef = useRef(null);

    // Handle body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!record) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case "verified":
                return <CheckCircle className="text-green-600" size={20} />;
            case "pending":
                return <Clock className="text-amber-600" size={20} />;
            case "failed":
                return <AlertTriangle className="text-red-600" size={20} />;
            default:
                return <Clock className="text-gray-600" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "verified":
                return {
                    bg: "bg-emerald-50",
                    text: "text-emerald-700",
                    border: "border-emerald-200",
                    label: "Verified",
                };
            case "pending":
                return {
                    bg: "bg-amber-50",
                    text: "text-amber-700",
                    border: "border-amber-200",
                    label: "Pending",
                };
            case "failed":
                return {
                    bg: "bg-red-50",
                    text: "text-red-700",
                    border: "border-red-200",
                    label: "Failed",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    border: "border-gray-200",
                    label: "Unknown",
                };
        }
    };

    const getMethodColor = (method) => {
        switch (method) {
            case "facial_recognition":
                return {
                    bg: "bg-blue-50",
                    text: "text-blue-700",
                    border: "border-blue-200",
                    label: "Facial Recognition",
                };
            case "manual":
                return {
                    bg: "bg-purple-50",
                    text: "text-purple-700",
                    border: "border-purple-200",
                    label: "Manual",
                };
            case "qr_code":
                return {
                    bg: "bg-orange-50",
                    text: "text-orange-700",
                    border: "border-orange-200",
                    label: "QR Code",
                };
            default:
                return {
                    bg: "bg-gray-50",
                    text: "text-gray-700",
                    border: "border-gray-200",
                    label: method || "Unknown",
                };
        }
    };

    const statusConfig = getStatusColor(record.status);
    const methodConfig = getMethodColor(record.verificationMethod);

    const handleManualVerifyClick = () => {
        onManualVerify(record._id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {record.user?.profilePic ? (
                                <img
                                    src={record.user.profilePic}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-300"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        const fallback =
                                            e.target.nextElementSibling;
                                        if (fallback)
                                            fallback.style.display = "flex";
                                    }}
                                />
                            ) : null}
                            <div
                                className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300 ${
                                    record.user?.profilePic ? "hidden" : "flex"
                                }`}
                            >
                                <User size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Attendance Record Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {record.user?.firstName} {record.user?.surname}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Trainee Information */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <User size={18} />
                                    Trainee Information
                                </h3>
                                <div className="space-y-4">
                                    <InfoField
                                        label="Name"
                                        value={`${
                                            record.user?.firstName || ""
                                        } ${record.user?.surname || ""}`.trim()}
                                    />
                                    <InfoField
                                        label="Email"
                                        value={record.user?.email || "N/A"}
                                    />
                                    <InfoField
                                        label="Course"
                                        value={record.course?.title || "N/A"}
                                    />
                                    <InfoField
                                        label="Lesson"
                                        value={`Lesson ${
                                            record.lesson?.order || "N/A"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Attendance Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Calendar size={18} />
                                        Attendance Details
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoField
                                            label="Clock-in Time"
                                            value={new Date(
                                                record.verifiedAt
                                            ).toLocaleString()}
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    <span className="capitalize">
                                                        {statusConfig.label}
                                                    </span>
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Verification Method"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${methodConfig.bg} ${methodConfig.text} ${methodConfig.border}`}
                                                >
                                                    {methodConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Record ID"
                                            value={
                                                <span className="font-mono text-sm">
                                                    {record._id}
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Status Actions */}
                                {record.status === "pending" && (
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            Quick Actions
                                        </h4>
                                        <div className="space-y-2">
                                            <button
                                                onClick={
                                                    handleManualVerifyClick
                                                }
                                                className="w-full text-left p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition-all duration-200 hover:bg-emerald-100 cursor-pointer flex items-center justify-between"
                                            >
                                                <span className="font-medium">
                                                    Manually Verify Attendance
                                                </span>
                                                <Check
                                                    size={16}
                                                    className="text-emerald-600"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Verification Image */}
                        {record.imageData && (
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <Image size={18} />
                                    Verification Image
                                </h3>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <img
                                        src={record.imageData}
                                        alt="Verification capture"
                                        className="max-w-full h-auto max-h-64 rounded-lg mx-auto"
                                    />
                                    <p className="text-sm text-gray-500 text-center mt-2">
                                        Facial recognition verification image
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                    >
                        Close
                    </button>
                    {record.status === "pending" && (
                        <button
                            onClick={handleManualVerifyClick}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer flex items-center"
                        >
                            <Check size={16} className="mr-2" />
                            Verify Attendance
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// InfoField Component
const InfoField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <div className="text-gray-900 text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
            {value}
        </div>
    </div>
);

export default AttendanceDetailsModal;
