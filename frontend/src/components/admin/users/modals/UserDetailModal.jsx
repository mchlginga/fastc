import { useState, useRef, useEffect, useCallback } from "react";
import {
    X,
    User,
    Book,
    Award,
    Eye,
    Edit,
    Check,
    ExternalLink,
    Tag,
    Briefcase,
} from "react-feather";
import InfoField from "./InfoField";
import { adminUserService } from "../../../../services/userService";
import { useAuth } from "../../../../context/AuthContext";

const UserDetailModal = ({ isOpen, onClose, user, onStatusUpdate, onEdit }) => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [userSkills, setUserSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const modalRef = useRef(null);

    const isSuperAdmin = currentUser?.role === "superAdmin";

    // Reset to profile tab when modal opens or user changes
    useEffect(() => {
        if (isOpen && user) {
            setActiveTab("profile");
        }
    }, [isOpen, user]);

    // Handle body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

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

    // Fetch user skills for trainees (role === 'user') OR for any user if superadmin
    useEffect(() => {
        const fetchUserSkills = async () => {
            if (
                isOpen &&
                user &&
                user._id &&
                (user.role === "user" || isSuperAdmin)
            ) {
                setSkillsLoading(true);
                try {
                    const response = await adminUserService.getUserSkills(
                        user._id
                    );
                    setUserSkills(response.skills || []);
                } catch (error) {
                    console.error("Error fetching user skills:", error);
                    setUserSkills([]);
                } finally {
                    setSkillsLoading(false);
                }
            } else {
                // Clear skills for non-trainee users when not superadmin
                setUserSkills([]);
                setSkillsLoading(false);
            }
        };

        fetchUserSkills();
    }, [isOpen, user, isSuperAdmin]);

    const handleViewFile = useCallback((filePath, fileName) => {
        if (filePath) {
            window.open(filePath, "_blank", "noopener,noreferrer");
        } else {
            alert("File not found or unavailable.");
        }
    }, []);

    const handleStatusUpdate = useCallback(
        async (newStatus) => {
            try {
                setUpdatingStatus(true);
                await onStatusUpdate(user._id, newStatus);
                onClose();
            } catch (error) {
                console.error("Status update error:", error);
            } finally {
                setUpdatingStatus(false);
            }
        },
        [user, onStatusUpdate, onClose]
    );

    const handleEditClick = useCallback(() => {
        onClose();
        setTimeout(() => {
            onEdit(user);
        }, 100);
    }, [onClose, onEdit, user]);

    const getStatusConfig = useCallback((status) => {
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
    }, []);

    const getRoleConfig = useCallback((role) => {
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
    }, []);

    const getSkillLevelConfig = useCallback((level) => {
        const configs = {
            beginner: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
            },
            intermediate: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
            },
            advanced: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
            },
        };
        return configs[level] || configs.beginner;
    }, []);

    // Determine which tabs to show based on user role AND current user role
    const getAvailableTabs = useCallback(() => {
        const baseTabs = [{ id: "profile", label: "Profile", icon: User }];

        // SuperAdmin sees ALL tabs for ALL user types
        if (isSuperAdmin) {
            return [
                ...baseTabs,
                { id: "education", label: "Education", icon: Book },
                { id: "certificates", label: "Certificates", icon: Award },
                { id: "skills", label: "Skills", icon: Tag },
                { id: "company", label: "Company Info", icon: Briefcase },
            ];
        }

        // Regular admin view - role-based tabs
        if (user?.role === "user") {
            // Trainee tabs - show all except company info
            return [
                ...baseTabs,
                { id: "education", label: "Education", icon: Book },
                { id: "certificates", label: "Certificates", icon: Award },
                { id: "skills", label: "Skills", icon: Tag },
            ];
        } else if (user?.role === "company") {
            // Company tabs - only profile and company info
            return [
                ...baseTabs,
                { id: "company", label: "Company Info", icon: Briefcase },
            ];
        } else {
            // Admin/SuperAdmin tabs - only profile
            return baseTabs;
        }
    }, [user, isSuperAdmin]);

    // Early return for performance
    if (!isOpen || !user) return null;

    const statusConfig = getStatusConfig(user.profileStatus);
    const roleConfig = getRoleConfig(user.role);
    const availableTabs = getAvailableTabs();

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
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
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
                                    user.profilePic ? "hidden" : "flex"
                                }`}
                            >
                                {user.role === "company" ? (
                                    <Briefcase
                                        size={20}
                                        className="text-gray-400"
                                    />
                                ) : (
                                    <User size={20} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {user.role === "company"
                                    ? "Company Details"
                                    : "User Details"}
                                {isSuperAdmin && (
                                    <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        SuperAdmin View
                                    </span>
                                )}
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
                                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 cursor-pointer ${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <tab.icon size={16} className="mr-2" />
                                {tab.label}
                                {isSuperAdmin &&
                                    user.role === "company" &&
                                    [
                                        "education",
                                        "certificates",
                                        "skills",
                                    ].includes(tab.id) && (
                                        <span className="ml-1 text-xs text-purple-600">
                                            *
                                        </span>
                                    )}
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
                                            label={
                                                user.role === "company"
                                                    ? "Company Name"
                                                    : "Name"
                                            }
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
                                        {user.birthdate &&
                                            (user.role === "user" ||
                                                isSuperAdmin) && (
                                                <InfoField
                                                    label="Birthdate"
                                                    value={new Date(
                                                        user.birthdate
                                                    ).toLocaleDateString()}
                                                />
                                            )}
                                        {user.gender &&
                                            (user.role === "user" ||
                                                isSuperAdmin) && (
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
                                                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
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

                                    {/* Professional Info Section - For trainees OR superadmin viewing any user */}
                                    {(user.role === "user" || isSuperAdmin) && (
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
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Skills Overview
                                                </label>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <p className="text-sm text-blue-700">
                                                        Skills are automatically
                                                        managed through
                                                        certificates. View the
                                                        Skills tab to see all
                                                        verified skills from
                                                        completed certificates.
                                                        {isSuperAdmin &&
                                                            user.role !==
                                                                "user" && (
                                                                <span className="block mt-1 text-purple-700 font-medium">
                                                                    SuperAdmin
                                                                    View:
                                                                    Showing
                                                                    skills for{" "}
                                                                    {user.role}{" "}
                                                                    account
                                                                </span>
                                                            )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Company Representative Section - For companies OR superadmin viewing any user */}
                                    {(user.role === "company" ||
                                        isSuperAdmin) &&
                                        user.representative && (
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">
                                                    Company Representative
                                                    {isSuperAdmin &&
                                                        user.role !==
                                                            "company" && (
                                                            <span className="ml-2 text-xs text-purple-600">
                                                                (SuperAdmin
                                                                View)
                                                            </span>
                                                        )}
                                                </h4>
                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                                                    {user.representative
                                                        .name && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Name:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {user.representative
                                                        .email && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Email:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {user.representative
                                                        .contactNumber && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Phone:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .contactNumber
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Education Tab - Show for trainees OR superadmin viewing any user */}
                    {activeTab === "education" &&
                        (user.role === "user" || isSuperAdmin) && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Education Background
                                    {isSuperAdmin && user.role !== "user" && (
                                        <span className="ml-2 text-sm text-purple-600">
                                            (SuperAdmin View)
                                        </span>
                                    )}
                                </h3>
                                {user.education?.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.education.map((edu, index) => (
                                            <div
                                                key={index}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-100"
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
                                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer transition-colors duration-200"
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
                                                    Graduated:{" "}
                                                    {edu.yearGraduated}
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
                                            {isSuperAdmin &&
                                                user.role !== "user" && (
                                                    <span className="block text-purple-600 text-sm mt-1">
                                                        (Expected for{" "}
                                                        {user.role} account)
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Certificates Tab - Show for trainees OR superadmin viewing any user */}
                    {activeTab === "certificates" &&
                        (user.role === "user" || isSuperAdmin) && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Certificates & Training
                                    {isSuperAdmin && user.role !== "user" && (
                                        <span className="ml-2 text-sm text-purple-600">
                                            (SuperAdmin View)
                                        </span>
                                    )}
                                </h3>
                                {user.certificates?.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.certificates.map(
                                            (cert, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-gray-50 rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-100"
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
                                                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm cursor-pointer transition-colors duration-200"
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
                                            {isSuperAdmin &&
                                                user.role !== "user" && (
                                                    <span className="block text-purple-600 text-sm mt-1">
                                                        (Expected for{" "}
                                                        {user.role} account)
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Skills Tab - Show for trainees OR superadmin viewing any user */}
                    {activeTab === "skills" &&
                        (user.role === "user" || isSuperAdmin) && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Verified Skills
                                    {isSuperAdmin && user.role !== "user" && (
                                        <span className="ml-2 text-sm text-purple-600">
                                            (SuperAdmin View)
                                        </span>
                                    )}
                                </h3>
                                {skillsLoading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                        <p className="text-gray-500">
                                            Loading skills...
                                        </p>
                                    </div>
                                ) : userSkills.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                            <p className="text-sm text-blue-700">
                                                These skills are automatically
                                                verified and managed through
                                                completed certificates. Skills
                                                are updated when new
                                                certificates are issued.
                                                {isSuperAdmin &&
                                                    user.role !== "user" && (
                                                        <span className="block mt-1 text-purple-700 font-medium">
                                                            SuperAdmin View:
                                                            Showing skills for{" "}
                                                            {user.role} account
                                                        </span>
                                                    )}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {userSkills.map((skill, index) => {
                                                const levelConfig =
                                                    getSkillLevelConfig(
                                                        skill.level
                                                    );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="p-4 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium text-gray-800">
                                                                {skill.skill
                                                                    ?.name ||
                                                                    skill.name}
                                                            </h4>
                                                            <span
                                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${levelConfig.bg} ${levelConfig.text} ${levelConfig.border}`}
                                                            >
                                                                {skill.level}
                                                            </span>
                                                        </div>
                                                        {skill.skill
                                                            ?.category && (
                                                            <p className="text-gray-600 text-sm mb-2">
                                                                Category:{" "}
                                                                {
                                                                    skill.skill
                                                                        .category
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="flex justify-between text-gray-500 text-xs">
                                                            <span>
                                                                Verified:{" "}
                                                                {skill.verifiedAt
                                                                    ? new Date(
                                                                          skill.verifiedAt
                                                                      ).toLocaleDateString()
                                                                    : "N/A"}
                                                            </span>
                                                            <span>
                                                                Certificates:{" "}
                                                                {skill.certificateCount ||
                                                                    1}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Tag
                                            size={48}
                                            className="text-gray-300 mx-auto mb-3"
                                        />
                                        <p className="text-gray-500 mb-2">
                                            No verified skills found.
                                            {isSuperAdmin &&
                                                user.role !== "user" && (
                                                    <span className="block text-purple-600 text-sm">
                                                        (Expected for{" "}
                                                        {user.role} account)
                                                    </span>
                                                )}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Skills are automatically added when
                                            users complete courses and earn
                                            certificates.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    {/* Company Info Tab - Show for companies OR superadmin viewing any user */}
                    {activeTab === "company" &&
                        (user.role === "company" || isSuperAdmin) && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Company Information
                                    {isSuperAdmin &&
                                        user.role !== "company" && (
                                            <span className="ml-2 text-sm text-purple-600">
                                                (SuperAdmin View)
                                            </span>
                                        )}
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <InfoField
                                                label="Company Name"
                                                value={
                                                    user.companyName ||
                                                    "Not provided"
                                                }
                                            />
                                            <InfoField
                                                label="Email"
                                                value={user.email}
                                            />
                                            <InfoField
                                                label="Contact Number"
                                                value={
                                                    user.contactNumber ||
                                                    "Not provided"
                                                }
                                            />
                                            <InfoField
                                                label="Address"
                                                value={
                                                    user.address ||
                                                    "Not provided"
                                                }
                                            />
                                        </div>

                                        {user.representative && (
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <h4 className="font-semibold text-gray-800 mb-3">
                                                    Company Representative
                                                </h4>
                                                <div className="space-y-3">
                                                    {user.representative
                                                        .name && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Name:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {user.representative
                                                        .email && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Email:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {user.representative
                                                        .contactNumber && (
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Phone:
                                                            </span>
                                                            <span className="text-sm text-gray-900">
                                                                {
                                                                    user
                                                                        .representative
                                                                        .contactNumber
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {user.businessPermit && (
                                        <div className="border-t border-gray-200 pt-6">
                                            <h4 className="font-semibold text-gray-800 mb-3">
                                                Business Documents
                                            </h4>
                                            <button
                                                onClick={() =>
                                                    handleViewFile(
                                                        user.businessPermit,
                                                        "Business Permit"
                                                    )
                                                }
                                                className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                                            >
                                                <ExternalLink
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                View Business Permit
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                        Edit {user.role === "company" ? "Company" : "User"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
