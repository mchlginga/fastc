import { useState, useCallback, useRef, useEffect } from "react";
import { X, Plus, Upload, Tag, Award } from "react-feather";
import { adminCourseService } from "../../../../services/userService";

const AddCourseModal = ({ isOpen, onClose, onCourseAdded }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skillLevel: "beginner",
        duration: "",
        isActive: true,
        tags: [],
        lessons: [],
        requirements: [],
        outcomes: [],
        enrollmentPeriod: 0,
        endDate: "",
        image: null,
        primarySkill: "",
        skillsTaught: [],
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);
    const [newTag, setNewTag] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newOutcome, setNewOutcome] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Skills state
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [newSkillTaught, setNewSkillTaught] = useState({
        skill: "",
        level: "beginner",
    });

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

    // Fetch available skills
    useEffect(() => {
        if (isOpen) {
            fetchAvailableSkills();
        }
    }, [isOpen]);

    const fetchAvailableSkills = async () => {
        try {
            setSkillsLoading(true);
            // You'll need to implement this service method
            const response = await adminCourseService.getAvailableSkills();
            setAvailableSkills(response.skills || []);
        } catch (error) {
            console.error("Error fetching skills:", error);
            setAvailableSkills([]);
        } finally {
            setSkillsLoading(false);
        }
    };

    const resetForm = useCallback(() => {
        setFormData({
            title: "",
            description: "",
            category: "",
            skillLevel: "beginner",
            duration: "",
            isActive: true,
            tags: [],
            lessons: [],
            requirements: [],
            outcomes: [],
            enrollmentPeriod: 0,
            endDate: "",
            image: null,
            primarySkill: "",
            skillsTaught: [],
        });
        setErrors({});
        setNewTag("");
        setNewRequirement("");
        setNewOutcome("");
        setImagePreview(null);
        setNewSkillTaught({
            skill: "",
            level: "beginner",
        });
    }, []);

    const handleClose = () => {
        if (loading) return;
        resetForm();
        onClose();
    };

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
            setErrors({
                image: "Please select a valid image file (JPEG, PNG, WebP)",
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({ image: "Image size must be less than 5MB" });
            return;
        }

        try {
            setImageUploading(true);
            setErrors((prev) => ({ ...prev, image: "" }));

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            setFormData((prev) => ({
                ...prev,
                image: file,
            }));
        } catch (error) {
            console.error("Image upload error:", error);
            setErrors({ image: "Failed to upload image. Please try again." });
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: "" }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }));
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleAddRequirement = () => {
        if (
            newRequirement.trim() &&
            !formData.requirements.includes(newRequirement.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()],
            }));
            setNewRequirement("");
        }
    };

    const handleRemoveRequirement = (reqToRemove) => {
        setFormData((prev) => ({
            ...prev,
            requirements: prev.requirements.filter(
                (req) => req !== reqToRemove
            ),
        }));
    };

    const handleAddOutcome = () => {
        if (
            newOutcome.trim() &&
            !formData.outcomes.includes(newOutcome.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                outcomes: [...prev.outcomes, newOutcome.trim()],
            }));
            setNewOutcome("");
        }
    };

    const handleRemoveOutcome = (outcomeToRemove) => {
        setFormData((prev) => ({
            ...prev,
            outcomes: prev.outcomes.filter(
                (outcome) => outcome !== outcomeToRemove
            ),
        }));
    };

    // Skills Functions
    const handleAddSkillTaught = () => {
        if (
            newSkillTaught.skill &&
            !formData.skillsTaught.some(
                (st) => st.skill === newSkillTaught.skill
            )
        ) {
            setFormData((prev) => ({
                ...prev,
                skillsTaught: [...prev.skillsTaught, { ...newSkillTaught }],
            }));
            setNewSkillTaught({
                skill: "",
                level: "beginner",
            });
        }
    };

    const handleRemoveSkillTaught = (skillIdToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skillsTaught: prev.skillsTaught.filter(
                (st) => st.skill !== skillIdToRemove
            ),
        }));
    };

    const handleSkillTaughtChange = (field, value) => {
        setNewSkillTaught((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddLesson = () => {
        setFormData((prev) => ({
            ...prev,
            lessons: [
                ...prev.lessons,
                {
                    title: "",
                    duration: "",
                    order: prev.lessons.length + 1,
                    content: "",
                    isRequired: true,
                    videoUrl: "",
                },
            ],
        }));
    };

    const handleRemoveLesson = (index) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.filter((_, i) => i !== index),
        }));
    };

    const handleLessonChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson, i) =>
                i === index ? { ...lesson, [field]: value } : lesson
            ),
        }));
    };

    const handleKeyPress = (e, callback) => {
        if (e.key === "Enter") {
            e.preventDefault();
            callback();
        }
    };

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.title?.trim()) {
            newErrors.title = "Course title is required";
        }

        if (!formData.description?.trim()) {
            newErrors.description = "Course description is required";
        }

        if (!formData.category?.trim()) {
            newErrors.category = "Category is required";
        }

        if (!formData.duration?.trim()) {
            newErrors.duration = "Duration is required";
        }

        if (formData.enrollmentPeriod < 0) {
            newErrors.enrollmentPeriod = "Enrollment period cannot be negative";
        }

        if (formData.endDate) {
            const endDate = new Date(formData.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (endDate <= today) {
                newErrors.endDate = "End date must be in the future";
            }
        }

        if (formData.lessons.length > 0) {
            formData.lessons.forEach((lesson, index) => {
                if (!lesson.title?.trim()) {
                    newErrors[`lesson_${index}_title`] = `Lesson ${
                        index + 1
                    } title is required`;
                }
                if (!lesson.duration?.trim()) {
                    newErrors[`lesson_${index}_duration`] = `Lesson ${
                        index + 1
                    } duration is required`;
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "image" && formData[key]) {
                    submitData.append("image", formData[key]);
                } else if (Array.isArray(formData[key])) {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === "isActive") {
                    submitData.append(key, formData[key].toString());
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            // 🆕 ADD: Debug log to see what's being sent
            console.log("📤 Submitting course data:", {
                title: formData.title,
                primarySkill: formData.primarySkill,
                skillsTaught: formData.skillsTaught,
            });

            await adminCourseService.createCourse(submitData);

            onCourseAdded();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating course:", error);
            setErrors({
                submit:
                    error.message ||
                    "Failed to create course. Please try again.",
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
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Add New Course
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Course Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Course Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                <p className="mb-1 text-sm text-gray-500">
                                                    <span className="font-semibold">
                                                        Click to upload
                                                    </span>{" "}
                                                    or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, WEBP (MAX. 5MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                disabled={
                                                    loading || imageUploading
                                                }
                                            />
                                        </label>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Course preview"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                                            disabled={loading}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {errors.image && (
                                <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                    {errors.image}
                                </p>
                            )}
                            {imageUploading && (
                                <p className="mt-2 text-sm text-blue-600">
                                    Uploading image...
                                </p>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.title
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter course title"
                                    disabled={loading}
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50 ${
                                        errors.category
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Programming">
                                        Programming
                                    </option>
                                    <option value="Data Science">
                                        Data Science
                                    </option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Welding">Welding</option>
                                    <option value="Beauty Care">
                                        Beauty Care
                                    </option>
                                    <option value="Massage Therapy">
                                        Massage Therapy
                                    </option>
                                    <option value="Housekeeping">
                                        Housekeeping
                                    </option>
                                    <option value="Carpentry">Carpentry</option>
                                    <option value="Masonry">Masonry</option>
                                    <option value="Food Services">
                                        Food Services
                                    </option>
                                </select>
                                {errors.category && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                    errors.description
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter course description"
                                disabled={loading}
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Enrollment Period and End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Enrollment Period (Days)
                                </label>
                                <input
                                    type="number"
                                    name="enrollmentPeriod"
                                    value={formData.enrollmentPeriod}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.enrollmentPeriod
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="0 for self-paced"
                                    disabled={loading}
                                />
                                {errors.enrollmentPeriod && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.enrollmentPeriod}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    {formData.enrollmentPeriod === 0
                                        ? "Self-paced course (no time limit)"
                                        : `${formData.enrollmentPeriod} days access`}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Course End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.endDate
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.endDate && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.endDate}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Last day students can enroll
                                </p>
                            </div>
                        </div>

                        {/* Level and Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Skill Level
                                </label>
                                <select
                                    name="skillLevel"
                                    value={formData.skillLevel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">
                                        Intermediate
                                    </option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Duration *
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                        errors.duration
                                            ? "border-red-300 bg-red-50"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="e.g., 6 weeks, Self-paced"
                                    disabled={loading}
                                />
                                {errors.duration && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Skills
                                </h3>
                                <Award size={20} className="text-purple-600" />
                            </div>

                            {/* Primary Skill */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Primary Skill
                                </label>
                                <select
                                    name="primarySkill"
                                    value={formData.primarySkill}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={loading || skillsLoading}
                                >
                                    <option value="">
                                        Select Primary Skill
                                    </option>
                                    {availableSkills.map((skill) => (
                                        <option
                                            key={skill._id}
                                            value={skill._id}
                                        >
                                            {skill.name}{" "}
                                            {skill.category
                                                ? `(${skill.category})`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    The main skill this course focuses on
                                </p>
                            </div>

                            {/* Skills Taught */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Skills Taught in this Course
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-2">
                                            Skill
                                        </label>
                                        <select
                                            value={newSkillTaught.skill}
                                            onChange={(e) =>
                                                handleSkillTaughtChange(
                                                    "skill",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                            disabled={loading || skillsLoading}
                                        >
                                            <option value="">
                                                Select Skill
                                            </option>
                                            {availableSkills.map((skill) => (
                                                <option
                                                    key={skill._id}
                                                    value={skill._id}
                                                >
                                                    {skill.name}{" "}
                                                    {skill.category
                                                        ? `(${skill.category})`
                                                        : ""}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-2">
                                            Proficiency Level
                                        </label>
                                        <select
                                            value={newSkillTaught.level}
                                            onChange={(e) =>
                                                handleSkillTaughtChange(
                                                    "level",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            <option value="beginner">
                                                Beginner
                                            </option>
                                            <option value="intermediate">
                                                Intermediate
                                            </option>
                                            <option value="advanced">
                                                Advanced
                                            </option>
                                            <option value="expert">
                                                Expert
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSkillTaught}
                                    disabled={!newSkillTaught.skill || loading}
                                    className="flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                                >
                                    <Plus size={14} className="mr-2" />
                                    Add Skill
                                </button>

                                {/* Skills Taught List */}
                                {formData.skillsTaught.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700">
                                            Added Skills:
                                        </h4>
                                        {formData.skillsTaught.map(
                                            (skillTaught, index) => {
                                                const skill =
                                                    availableSkills.find(
                                                        (s) =>
                                                            s._id ===
                                                            skillTaught.skill
                                                    );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                                                    >
                                                        <div>
                                                            <span className="text-sm font-medium text-purple-800">
                                                                {skill
                                                                    ? skill.name
                                                                    : "Loading..."}
                                                            </span>
                                                            <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full capitalize">
                                                                {
                                                                    skillTaught.level
                                                                }
                                                            </span>
                                                            {skill &&
                                                                skill.category && (
                                                                    <span className="ml-2 text-xs text-gray-500">
                                                                        (
                                                                        {
                                                                            skill.category
                                                                        }
                                                                        )
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveSkillTaught(
                                                                    skillTaught.skill
                                                                )
                                                            }
                                                            className="text-purple-600 hover:text-purple-800 cursor-pointer disabled:opacity-50"
                                                            disabled={loading}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddTag)
                                    }
                                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                    placeholder="Add a tag"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Requirements
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newRequirement}
                                    onChange={(e) =>
                                        setNewRequirement(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddRequirement)
                                    }
                                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                    placeholder="Add a requirement"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="px-4 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.requirements.map(
                                    (requirement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <span className="text-sm text-gray-700">
                                                {requirement}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveRequirement(
                                                        requirement
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Learning Outcomes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Learning Outcomes
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newOutcome}
                                    onChange={(e) =>
                                        setNewOutcome(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddOutcome)
                                    }
                                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                    placeholder="Add a learning outcome"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddOutcome}
                                    className="px-4 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.outcomes.map((outcome, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <span className="text-sm text-gray-700">
                                            {outcome}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveOutcome(outcome)
                                            }
                                            className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lessons */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                                    Lessons
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddLesson}
                                    className="flex items-center px-4 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    <Plus size={14} className="mr-2" />
                                    Add Lesson
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.lessons.map((lesson, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border border-gray-200 rounded-lg bg-gray-50/50"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-800">
                                                Lesson {index + 1}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveLesson(index)
                                                }
                                                className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-2">
                                                    Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lesson.title}
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            index,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                                        errors[
                                                            `lesson_${index}_title`
                                                        ]
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Lesson title"
                                                    disabled={loading}
                                                />
                                                {errors[
                                                    `lesson_${index}_title`
                                                ] && (
                                                    <p className="mt-2 text-xs text-red-600 animate-fadeIn">
                                                        {
                                                            errors[
                                                                `lesson_${index}_title`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-2">
                                                    Duration *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lesson.duration}
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            index,
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                                        errors[
                                                            `lesson_${index}_duration`
                                                        ]
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Duration (e.g., 30 mins)"
                                                    disabled={loading}
                                                />
                                                {errors[
                                                    `lesson_${index}_duration`
                                                ] && (
                                                    <p className="mt-2 text-xs text-red-600 animate-fadeIn">
                                                        {
                                                            errors[
                                                                `lesson_${index}_duration`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="block text-xs text-gray-600 mb-2">
                                                Video URL (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                value={lesson.videoUrl || ""}
                                                onChange={(e) =>
                                                    handleLessonChange(
                                                        index,
                                                        "videoUrl",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                placeholder="https://youtube.com/embed/..."
                                                disabled={loading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-2">
                                                Content/Description
                                            </label>
                                            <textarea
                                                value={lesson.content}
                                                onChange={(e) =>
                                                    handleLessonChange(
                                                        index,
                                                        "content",
                                                        e.target.value
                                                    )
                                                }
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                placeholder="Lesson content/description"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                                disabled={loading}
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                Active Course
                            </label>
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
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            "Create Course"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCourseModal;
