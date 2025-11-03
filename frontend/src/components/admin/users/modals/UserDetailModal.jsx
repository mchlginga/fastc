import { useState, useRef, useEffect } from "react";
import {
    X,
    User,
    Book,
    Award,
    Eye,
    Edit,
    Check,
    ExternalLink,
    Briefcase,
    FileText,
    Mail,
    Phone,
} from "react-feather";
import InfoField from "./InfoField";

const UserDetailModal = ({ isOpen, onClose, user, onStatusUpdate, onEdit }) => {
    const [activeTab, setActiveTab] = useState("profile");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const modalRef = useRef(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    const profilePicUrl = user?.profilePic || null;

    const handleViewFile = (filePath, fileName) => {
        if (filePath) {
            window.open(filePath, "_blank", "noopener,noreferrer");
        } else {
            alert("File not found or unavailable.");
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            await onStatusUpdate(user._id, newStatus);
            onClose();
        } catch (error) {
            console.error("Status update error:", error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleEditClick = () => {
        onClose();
        setTimeout(() => {
            onEdit(user);
        }, 100);
    };

    const getStatusConfig = (status) => {
        const configs = {
            approved: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Approved",
            },
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending Review",
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const getRoleConfig = (role) => {
        const configs = {
            superAdmin: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
                label: "Super Admin",
            },
            admin: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                label: "Admin",
            },
            company: {
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
                label: "Company",
            },
            user: {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
                label: "Trainee",
            },
        };
        return configs[role] || configs.user;
    };

    const statusConfig = getStatusConfig(user.profileStatus);
    const roleConfig = getRoleConfig(user.role);

    // Determine available tabs based on user role
    const getAvailableTabs = () => {
        const baseTabs = [{ id: "profile", label: "Profile", icon: User }];

        if (user.role === "company") {
            baseTabs.push(
                { id: "company", label: "Company Details", icon: Briefcase },
                { id: "documents", label: "Documents", icon: FileText }
            );
        } else {
            // For trainees/admins
            baseTabs.push(
                { id: "education", label: "Education", icon: Book },
                { id: "certificates", label: "Certificates", icon: Award }
            );
        }

        return baseTabs;
    };

    const availableTabs = getAvailableTabs();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
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
                                    profilePicUrl ? "hidden" : "flex"
                                }`}
                            >
                                <User size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                User Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {user.role === "company"
                                    ? user.companyName
                                    : `${user.firstName} ${user.surname}`}
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

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex px-6">
                        {availableTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoField
                                            label="Name"
                                            value={
                                                user.role === "company"
                                                    ? user.companyName
                                                    : `${user.firstName} ${user.surname}`
                                            }
                                        />
                                        <InfoField
                                            label="Email"
                                            value={user.email}
                                        />
                                        <InfoField
                                            label="Role"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}
                                                >
                                                    {roleConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            }
                                        />
                                        {user.contactNumber && (
                                            <InfoField
                                                label="Phone"
                                                value={user.contactNumber}
                                            />
                                        )}
                                        {user.address && (
                                            <InfoField
                                                label="Address"
                                                value={user.address}
                                            />
                                        )}
                                        {user.birthdate && (
                                            <InfoField
                                                label="Birthdate"
                                                value={new Date(
                                                    user.birthdate
                                                ).toLocaleDateString()}
                                            />
                                        )}
                                        {user.gender && (
                                            <InfoField
                                                label="Gender"
                                                value={user.gender}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-4">
                                            Profile Status
                                        </h3>
                                        <div className="space-y-2">
                                            {[
                                                "pending",
                                                "approved",
                                                "rejected",
                                            ].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            status
                                                        )
                                                    }
                                                    disabled={
                                                        updatingStatus ||
                                                        user.profileStatus ===
                                                            status
                                                    }
                                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                        user.profileStatus ===
                                                        status
                                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    } ${
                                                        updatingStatus
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "cursor-pointer"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium capitalize">
                                                            {status}
                                                        </span>
                                                        {user.profileStatus ===
                                                            status && (
                                                            <Check
                                                                size={16}
                                                                className="text-blue-600"
                                                            />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Professional Info Section - Only for trainees */}
                                    {user.role === "user" && (
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">
                                                Professional Info
                                            </h4>
                                            {user.availability &&
                                                user.availability !== "N/A" && (
                                                    <InfoField
                                                        label="Availability"
                                                        value={
                                                            user.availability
                                                        }
                                                    />
                                                )}
                                            {user.skills?.length > 0 && (
                                                <div className="mt-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Skills
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.skills.map(
                                                            (skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {(!user.availability ||
                                                user.availability === "N/A") &&
                                                !user.skills?.length && (
                                                    <p className="text-gray-500 text-sm">
                                                        No professional
                                                        information available.
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company Details Tab */}
                    {activeTab === "company" && user.role === "company" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Company Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <InfoField
                                        label="Company Name"
                                        value={
                                            user.companyName || "Not provided"
                                        }
                                    />
                                    <InfoField
                                        label="Email"
                                        value={user.email}
                                    />
                                    <InfoField
                                        label="Contact Number"
                                        value={
                                            user.contactNumber || "Not provided"
                                        }
                                    />
                                    <InfoField
                                        label="Address"
                                        value={user.address || "Not provided"}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">
                                            Company Representative
                                        </h4>
                                        {user.representative ? (
                                            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <InfoField
                                                    label="Name"
                                                    value={
                                                        user.representative
                                                            .name ||
                                                        "Not provided"
                                                    }
                                                />
                                                <InfoField
                                                    label="Email"
                                                    value={
                                                        user.representative
                                                            .email ||
                                                        "Not provided"
                                                    }
                                                />
                                                <InfoField
                                                    label="Contact Number"
                                                    value={
                                                        user.representative
                                                            .contactNumber ||
                                                        "Not provided"
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                No representative information
                                                provided.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Documents Tab for Companies */}
                    {activeTab === "documents" && user.role === "company" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Company Documents
                            </h3>
                            {user.businessPermit ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-800">
                                                Business Permit
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    handleViewFile(
                                                        user.businessPermit,
                                                        "Business Permit"
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer"
                                                title="Open in new tab"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                View Document
                                            </button>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Company business permit document
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText
                                        size={48}
                                        className="text-gray-300 mx-auto mb-3"
                                    />
                                    <p className="text-gray-500">
                                        No company documents uploaded.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Education Tab - Only for non-company users */}
                    {activeTab === "education" && user.role !== "company" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Education Background
                            </h3>
                            {user.education?.length > 0 ? (
                                <div className="space-y-4">
                                    {user.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-800">
                                                    {edu.educationLevel}
                                                </h4>
                                                {edu.proof && (
                                                    <button
                                                        onClick={() =>
                                                            handleViewFile(
                                                                edu.proof,
                                                                `Education Proof - ${edu.educationLevel}`
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer"
                                                        title="Open in new tab"
                                                    >
                                                        <ExternalLink
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        View Proof
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {edu.schoolName}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Graduated: {edu.yearGraduated}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Book
                                        size={48}
                                        className="text-gray-300 mx-auto mb-3"
                                    />
                                    <p className="text-gray-500">
                                        No education information provided.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Certificates Tab - Only for non-company users */}
                    {activeTab === "certificates" &&
                        user.role !== "company" && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Certificates & Training
                                </h3>
                                {user.certificates?.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.certificates.map(
                                            (cert, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-300"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-medium text-gray-800">
                                                            {cert.name}
                                                        </h4>
                                                        {cert.proof && (
                                                            <button
                                                                onClick={() =>
                                                                    handleViewFile(
                                                                        cert.proof,
                                                                        `Certificate - ${cert.name}`
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer"
                                                                title="Open in new tab"
                                                            >
                                                                <ExternalLink
                                                                    size={14}
                                                                    className="mr-1"
                                                                />
                                                                View Certificate
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        Issued by: {cert.issuer}
                                                    </p>
                                                    <div className="flex justify-between text-gray-500 text-xs">
                                                        <span>
                                                            Date:{" "}
                                                            {cert.date
                                                                ? new Date(
                                                                      cert.date
                                                                  ).toLocaleDateString()
                                                                : "N/A"}
                                                        </span>
                                                        {cert.expiration && (
                                                            <span>
                                                                Expires:{" "}
                                                                {new Date(
                                                                    cert.expiration
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Award
                                            size={48}
                                            className="text-gray-300 mx-auto mb-3"
                                        />
                                        <p className="text-gray-500">
                                            No certificates provided.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer flex items-center"
                    >
                        <Edit size={16} className="mr-2" />
                        Edit User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
