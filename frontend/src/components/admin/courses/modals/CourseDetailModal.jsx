import { useState, useRef, useEffect, useCallback } from "react";
import {
    X,
    Book,
    Play,
    Users,
    Clock,
    Check,
    Edit,
    Award,
    BarChart2,
    Tag,
} from "react-feather";
import InfoField from "./InfoField";

const CourseDetailModal = ({
    isOpen,
    onClose,
    course,
    onStatusUpdate,
    onEdit,
}) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const modalRef = useRef(null);

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

    const handleStatusUpdate = useCallback(
        async (newStatus) => {
            try {
                setUpdatingStatus(true);
                await onStatusUpdate(course._id, newStatus);
                onClose();
            } catch (error) {
                console.error("Status update error:", error);
            } finally {
                setUpdatingStatus(false);
            }
        },
        [course, onStatusUpdate, onClose]
    );

    const handleEditClick = useCallback(() => {
        onClose();
        setTimeout(() => {
            onEdit(course);
        }, 100);
    }, [onClose, onEdit, course]);

    const getStatusConfig = useCallback((isActive) => {
        const configs = {
            true: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Active",
                icon: <Check size={14} className="mr-1" />,
            },
            false: {
                bg: "bg-gray-100",
                text: "text-gray-800",
                border: "border-gray-200",
                label: "Inactive",
                icon: <X size={14} className="mr-1" />,
            },
        };
        return configs[isActive] || configs.false;
    }, []);

    const getLevelConfig = useCallback((level) => {
        const configs = {
            beginner: {
                bg: "bg-blue-50",
                text: "text-blue-800",
                label: "Beginner",
            },
            intermediate: {
                bg: "bg-yellow-50",
                text: "text-yellow-800",
                label: "Intermediate",
            },
            advanced: {
                bg: "bg-red-50",
                text: "text-red-800",
                label: "Advanced",
            },
        };
        return configs[level] || configs.beginner;
    }, []);

    const getSkillLevelConfig = useCallback((level) => {
        const configs = {
            beginner: {
                bg: "bg-blue-50",
                text: "text-blue-800",
                border: "border-blue-200",
                label: "Beginner",
            },
            intermediate: {
                bg: "bg-amber-50",
                text: "text-amber-800",
                border: "border-amber-200",
                label: "Intermediate",
            },
            advanced: {
                bg: "bg-emerald-50",
                text: "text-emerald-800",
                border: "border-emerald-200",
                label: "Advanced",
            },
        };
        return configs[level] || configs.beginner;
    }, []);

    // Get image URL - handle both full URLs and relative paths
    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return null;

        // If it's already a full URL (Cloudinary, etc.)
        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        // Handle relative paths - construct full URL
        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        // Remove leading slash if present
        const cleanPath = imagePath.startsWith("/")
            ? imagePath.slice(1)
            : imagePath;

        return `${backendUrl}/${cleanPath}`;
    }, []);

    // Helper function to check if skill is populated
    const isSkillPopulated = useCallback((skill) => {
        return skill && typeof skill === 'object' && skill.name;
    }, []);

    // Helper function to get skill name
    const getSkillName = useCallback((skill) => {
        if (!skill) return "Unknown Skill";
        if (typeof skill === 'object' && skill.name) return skill.name;
        if (typeof skill === 'string') return "Skill (ObjectId)";
        return "Unknown Skill";
    }, []);

    // Helper function to get skill data
    const getSkillData = useCallback((skill) => {
        if (!skill) return null;
        if (typeof skill === 'object' && skill.name) return skill;
        return null;
    }, []);

    // Early return for performance
    if (!isOpen || !course) return null;

    const statusConfig = getStatusConfig(course.isActive);
    const levelConfig = getLevelConfig(course.skillLevel);
    const courseImageUrl = getImageUrl(course.image);

    // Get primary skill data
    const primarySkillData = getSkillData(course.primarySkill);
    const isPrimarySkillPopulated = isSkillPopulated(course.primarySkill);

    // Get skills taught data
    const skillsTaughtData = course.skillsTaught?.map(st => ({
        ...st,
        skillData: getSkillData(st.skill),
        isPopulated: isSkillPopulated(st.skill)
    })) || [];

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
                            {courseImageUrl ? (
                                <img
                                    src={courseImageUrl}
                                    alt={course.title}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-300"
                                    onError={(e) => {
                                        console.error(
                                            "Course image failed to load:",
                                            courseImageUrl
                                        );
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
                                    courseImageUrl ? "hidden" : "flex"
                                }`}
                            >
                                <Book size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Course Details
                            </h2>
                            <p className="text-sm text-gray-600">
                                {course.title}
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
                        {[
                            { id: "overview", label: "Overview", icon: Book },
                            { id: "lessons", label: "Lessons", icon: Play },
                            { id: "details", label: "Details", icon: Award },
                            { id: "skills", label: "Skills", icon: Tag },
                        ].map((tab) => (
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
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoField
                                            label="Title"
                                            value={course.title}
                                        />
                                        <InfoField
                                            label="Description"
                                            value={
                                                course.description ||
                                                "No description"
                                            }
                                        />
                                        <InfoField
                                            label="Category"
                                            value={course.category || "—"}
                                        />
                                        <InfoField
                                            label="Skill Level"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${levelConfig.bg} ${levelConfig.text} ${levelConfig.border}`}
                                                >
                                                    {levelConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Status"
                                            value={
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                            }
                                        />
                                        <InfoField
                                            label="Duration"
                                            value={course.duration || "—"}
                                        />
                                        {course.tags &&
                                            course.tags.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Tags
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.tags.map(
                                                            (tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-4">
                                            Course Status
                                        </h3>
                                        <div className="space-y-2">
                                            {["active", "inactive"].map(
                                                (status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                status
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus ||
                                                            (status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive)
                                                        }
                                                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                            (status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive)
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
                                                            {(status ===
                                                                "active" &&
                                                                course.isActive) ||
                                                            (status ===
                                                                "inactive" &&
                                                                !course.isActive) ? (
                                                                <Check
                                                                    size={16}
                                                                    className="text-blue-600"
                                                                />
                                                            ) : null}
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">
                                            Course Statistics
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-600 flex items-center">
                                                    <Users
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Enrollments:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {course.enrollmentCount ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-600 flex items-center">
                                                    <Play
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Lessons:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {course.lessons?.length ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-gray-600 flex items-center">
                                                    <Clock
                                                        size={14}
                                                        className="mr-2"
                                                    />
                                                    Created:
                                                </span>
                                                <span className="font-medium text-gray-800">
                                                    {new Date(
                                                        course.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "lessons" && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-4">
                                Course Lessons
                            </h3>
                            {course.lessons?.length > 0 ? (
                                <div className="space-y-3">
                                    {course.lessons
                                        .sort((a, b) => a.order - b.order)
                                        .map((lesson, index) => (
                                            <div
                                                key={lesson._id || index}
                                                className="p-4 bg-gray-50 rounded-lg border border-gray-300 transition-colors duration-200 hover:bg-gray-100"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-medium text-gray-800">
                                                        {lesson.title ||
                                                            `Lesson ${
                                                                index + 1
                                                            }`}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        {lesson.duration && (
                                                            <span className="flex items-center">
                                                                <Clock
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                                {
                                                                    lesson.duration
                                                                }
                                                            </span>
                                                        )}
                                                        {lesson.isRequired && (
                                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {lesson.content && (
                                                    <p className="text-gray-600 text-sm">
                                                        {lesson.content}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Play
                                        size={48}
                                        className="text-gray-300 mx-auto mb-3"
                                    />
                                    <p className="text-gray-500">
                                        No lessons added to this course yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "details" && (
                        <div className="space-y-6">
                            {/* Requirements */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Requirements
                                </h3>
                                {course.requirements?.length > 0 ? (
                                    <div className="space-y-2">
                                        {course.requirements.map(
                                            (requirement, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <p className="text-gray-700 text-sm">
                                                        {requirement}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No requirements specified.
                                    </p>
                                )}
                            </div>

                            {/* Learning Outcomes */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Learning Outcomes
                                </h3>
                                {course.outcomes?.length > 0 ? (
                                    <div className="space-y-2">
                                        {course.outcomes.map(
                                            (outcome, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <p className="text-gray-700 text-sm">
                                                        {outcome}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No learning outcomes specified.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "skills" && (
                        <div className="space-y-6">
                            {/* Primary Skill */}
                            {course.primarySkill && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-4">
                                        Primary Skill
                                    </h3>
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-blue-800">
                                                    {getSkillName(course.primarySkill)}
                                                </h4>
                                                {isPrimarySkillPopulated && primarySkillData.category && (
                                                    <p className="text-blue-600 text-sm mt-1">
                                                        Category: {primarySkillData.category}
                                                    </p>
                                                )}
                                                {isPrimarySkillPopulated && primarySkillData.description && (
                                                    <p className="text-blue-700 text-sm mt-2">
                                                        {primarySkillData.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <Tag size={20} className="text-blue-600 mr-2" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    Primary Focus
                                                </span>
                                            </div>
                                        </div>
                                        {!isPrimarySkillPopulated && (
                                            <p className="text-orange-600 text-sm mt-2">
                                                Skill data needs to be populated. This might be just an ObjectId.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Skills Taught */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Skills Taught in this Course
                                </h3>
                                {skillsTaughtData.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {skillsTaughtData.map((skillTaught, index) => {
                                            const skillLevelConfig = getSkillLevelConfig(skillTaught.level);
                                            const skillData = skillTaught.skillData;
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-sm"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-medium text-gray-800">
                                                            {skillTaught.isPopulated 
                                                                ? skillData.name || "Unnamed Skill"
                                                                : "Skill (Not Populated)"}
                                                        </h4>
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${skillLevelConfig.bg} ${skillLevelConfig.text} ${skillLevelConfig.border}`}
                                                        >
                                                            {skillLevelConfig.label}
                                                        </span>
                                                    </div>

                                                    {skillTaught.isPopulated ? (
                                                        <>
                                                            {skillData.category && (
                                                                <p className="text-gray-600 text-sm mb-2">
                                                                    Category: {skillData.category}
                                                                </p>
                                                            )}
                                                            {skillData.description && (
                                                                <p className="text-gray-700 text-sm">
                                                                    {skillData.description}
                                                                </p>
                                                            )}
                                                            {skillData.aliases && skillData.aliases.length > 0 && (
                                                                <div className="mt-3">
                                                                    <p className="text-xs text-gray-500 mb-1">
                                                                        Also known as:
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {skillData.aliases.map((alias, aliasIndex) => (
                                                                            <span
                                                                                key={aliasIndex}
                                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200"
                                                                            >
                                                                                {alias}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-orange-600 text-sm">
                                                            Skill data needs to be populated. This might be just an ObjectId.
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Tag size={48} className="text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">
                                            No skills defined for this course.
                                        </p>
                                        <p className="text-sm text-gray-400 mt-2">
                                            Skills help students understand what they will learn and enable better job matching.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Debug Information - Remove this section in production */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-700 mb-2">
                                    Debug Information
                                </h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Skills Taught Array Length: {course.skillsTaught?.length || 0}</p>
                                    <p>Primary Skill Type: {typeof course.primarySkill}</p>
                                    <p>Primary Skill Value: {JSON.stringify(course.primarySkill)}</p>
                                    <p>Skills Taught: {JSON.stringify(course.skillsTaught)}</p>
                                </div>
                            </div>

                            {/* Skills Information Note */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <Award
                                        size={18}
                                        className="text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                                    />
                                    <div>
                                        <h4 className="font-medium text-blue-800 mb-1">
                                            Skills & Job Matching
                                        </h4>
                                        <p className="text-blue-700 text-sm">
                                            The skills defined in this course are used to match trainees with relevant job opportunities.
                                            Companies can search for candidates based on these verified skills.
                                        </p>
                                    </div>
                                </div>
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
                        Edit Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailModal;