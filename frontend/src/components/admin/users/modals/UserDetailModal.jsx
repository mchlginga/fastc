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

    // ✅ DIRECT CLOUDINARY URL
    const profilePicUrl = user?.profilePic || null;

    // NEW: Open file in new tab instead of modal
    const handleViewFile = (filePath, fileName) => {
        console.log("Opening file in new tab:", {
            filePath,
            fileName,
        });

        if (filePath) {
            // Open in new tab - filePath is already Cloudinary URL
            window.open(filePath, "_blank", "noopener,noreferrer");
        } else {
            console.error("No file URL available for:", filePath);
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
        // Close the detail modal first, then open edit modal
        onClose();
        // Small timeout to ensure modal closes before opening edit
        setTimeout(() => {
            onEdit(user);
        }, 100);
    };

    const getStatusConfig = (status) => {
        const configs = {
            approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                border: "border-green-200",
                label: "Approved",
            },
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                border: "border-yellow-200",
                label: "Pending Review",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                border: "border-red-200",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const getRoleConfig = (role) => {
        const configs = {
            superAdmin: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                label: "Super Admin",
            },
            admin: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Admin",
            },
            company: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Company",
            },
            user: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                label: "Trainee",
            },
        };
        return configs[role] || configs.user;
    };

    const statusConfig = getStatusConfig(user.profileStatus);
    const roleConfig = getRoleConfig(user.role);

    console.log("Profile Pic Debug:", {
        hasProfilePic: !!user?.profilePic,
        profilePic: user?.profilePic,
        constructedUrl: profilePicUrl,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl} // ✅ DIRECT CLOUDINARY URL
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                    onError={(e) => {
                                        console.error(
                                            "Profile image failed to load:",
                                            profilePicUrl
                                        );
                                        e.target.style.display = "none";
                                        // Show fallback when image fails
                                        const fallback =
                                            e.target.nextElementSibling;
                                        if (fallback)
                                            fallback.style.display = "flex";
                                    }}
                                    onLoad={() =>
                                        console.log(
                                            "Profile image loaded successfully:",
                                            profilePicUrl
                                        )
                                    }
                                />
                            ) : null}
                            {/* Fallback - show if no profilePicUrl OR if image fails to load */}
                            <div
                                className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 ${
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
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-300">
                    <div className="flex px-4">
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            {
                                id: "education",
                                label: "Education",
                                icon: Book,
                            },
                            {
                                id: "certificates",
                                label: "Certificates",
                                icon: Award,
                            },
                        ].map((tab) => (
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
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
                    {activeTab === "profile" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-3">
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
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}
                                                >
                                                    {roleConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
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

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-3">
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
                                                    className={`w-full text-left p-3 rounded border transition-colors ${
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
                                                                size={14}
                                                                className="text-blue-600"
                                                            />
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Professional Info Section */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">
                                            Professional Info
                                        </h4>
                                        {user.availability &&
                                            user.availability !== "N/A" && (
                                                <InfoField
                                                    label="Availability"
                                                    value={user.availability}
                                                />
                                            )}
                                        {user.skills?.length > 0 && (
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Skills
                                                </label>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
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
                                                    No professional information
                                                    available.
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "education" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Education Background
                            </h3>
                            {user.education?.length > 0 ? (
                                <div className="space-y-3">
                                    {user.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded border border-gray-300"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    {edu.educationLevel}
                                                </h4>
                                                {edu.proof && (
                                                    <button
                                                        onClick={() =>
                                                            handleViewFile(
                                                                edu.proof, // ✅ DIRECT CLOUDINARY URL
                                                                `Education Proof - ${edu.educationLevel}`
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer"
                                                        title="Open in new tab"
                                                    >
                                                        <ExternalLink
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        View Proof
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                {edu.schoolName}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Graduated: {edu.yearGraduated}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">
                                    No education information provided.
                                </p>
                            )}
                        </div>
                    )}

                    {activeTab === "certificates" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Certificates & Training
                            </h3>
                            {user.certificates?.length > 0 ? (
                                <div className="space-y-3">
                                    {user.certificates.map((cert, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded border border-gray-300"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-800">
                                                    {cert.name}
                                                </h4>
                                                {cert.proof && (
                                                    <button
                                                        onClick={() =>
                                                            handleViewFile(
                                                                cert.proof, // ✅ DIRECT CLOUDINARY URL
                                                                `Certificate - ${cert.name}`
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer"
                                                        title="Open in new tab"
                                                    >
                                                        <ExternalLink
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                        View Certificate
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-1">
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
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">
                                    No certificates provided.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-gray-300 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center"
                    >
                        <Edit size={14} className="mr-1" />
                        Edit User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
