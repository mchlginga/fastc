import { useState, useEffect, useRef } from "react";
import { X, Plus, Minus, Upload, Eye, EyeOff } from "react-feather";
import { adminCourseService } from "../../../../services/userService";

const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
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
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [newTag, setNewTag] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newOutcome, setNewOutcome] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null); // 🆕 ADD: Ref for file input

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (course) {
            console.log("📝 Editing course:", course);
            setFormData({
                title: course.title || "",
                description: course.description || "",
                category: course.category || "",
                skillLevel: course.skillLevel || "beginner",
                duration: course.duration || "",
                isActive:
                    course.isActive !== undefined ? course.isActive : true,
                tags: course.tags || [],
                lessons: course.lessons || [],
                requirements: course.requirements || [],
                outcomes: course.outcomes || [],
                enrollmentPeriod: course.enrollmentPeriod || 0,
                endDate: course.endDate
                    ? new Date(course.endDate).toISOString().split("T")[0]
                    : "",
                image: course.image || null,
            });

            // Set image preview if course has an image
            if (course.image) {
                console.log("🖼️ Course image:", course.image);
                // Check if it's already a full URL or a relative path
                if (course.image.startsWith("http")) {
                    setImagePreview(course.image);
                } else {
                    // Handle relative paths - remove leading slash if present
                    const imagePath = course.image.startsWith("/")
                        ? course.image.slice(1)
                        : course.image;
                    const backendUrl =
                        import.meta.env.VITE_BACKEND_URL ||
                        "http://localhost:5000";
                    const imageUrl = `${backendUrl}/${imagePath}`;
                    console.log("🖼️ Constructed image URL:", imageUrl);
                    setImagePreview(imageUrl);
                }
            } else {
                setImagePreview(null);
            }

            // 🆕 RESET: Clear file input when course changes
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [course]);

    const handleClose = () => {
        if (loading) return;
        setErrors({});
        setImagePreview(null);
        // 🆕 RESET: Clear file input on close
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

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
                image: file, // This sets the new file
            }));
        } catch (error) {
            console.error("Image upload error:", error);
            setErrors({ image: "Failed to upload image. Please try again." });
        } finally {
            setImageUploading(false);
        }
    };

    // 🆕 FIXED: Proper image removal
    const handleRemoveImage = () => {
        console.log("🗑️ Removing image...");

        // Clear the form data image
        setFormData((prev) => ({
            ...prev,
            image: null, // This tells the backend to remove the image
        }));

        // Clear the preview
        setImagePreview(null);

        // Clear any image errors
        setErrors((prev) => ({ ...prev, image: "" }));

        // 🆕 IMPORTANT: Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        console.log("✅ Image removed from form data");
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

    const validateForm = () => {
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach((key) => {
                if (key === "image") {
                    if (formData[key] instanceof File) {
                        // Append new image file
                        submitData.append("image", formData[key]);
                        console.log("📤 Appending new image file");
                    } else if (formData[key] === null) {
                        // 🆕 ADD: Explicitly send null to remove image
                        submitData.append("removeImage", "true");
                        console.log("🗑️ Requesting image removal");
                    }
                    // If formData[key] is a string (existing image URL), don't append anything
                    // This keeps the existing image
                } else if (Array.isArray(formData[key])) {
                    // Append arrays as JSON strings
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === "isActive") {
                    // Convert boolean to string for FormData
                    submitData.append(key, formData[key].toString());
                } else {
                    // Append other fields
                    submitData.append(key, formData[key]);
                }
            });

            // ACTUAL API CALL
            console.log("🔄 Updating course:", course._id);
            await adminCourseService.updateCourse(course._id, submitData);

            onCourseUpdated();
            handleClose();
        } catch (error) {
            console.error("❌ Error updating course:", error);
            setErrors({ submit: error.message || "Failed to update course" });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-300">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit Course
                        </h2>
                        <p className="text-sm text-gray-600">
                            Update course information
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Course Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                Course Image
                                {formData.image && (
                                    <span className="text-xs text-gray-500 ml-2">
                                        (Click X to remove)
                                    </span>
                                )}
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
                                                ref={fileInputRef} // 🆕 ADD: Ref to file input
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
                                            onError={(e) => {
                                                console.error(
                                                    "🖼️ Image failed to load:",
                                                    imagePreview
                                                );
                                                e.target.style.display = "none";
                                            }}
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
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.image}
                                </p>
                            )}
                            {imageUploading && (
                                <p className="mt-1 text-xs text-blue-600">
                                    Uploading image...
                                </p>
                            )}
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.title
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="Enter course title"
                                    disabled={loading}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                                        errors.category
                                            ? "border-red-300"
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
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                    errors.description
                                        ? "border-red-300"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter course description"
                                disabled={loading}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Enrollment Period and End Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Enrollment Period (Days)
                                </label>
                                <input
                                    type="number"
                                    name="enrollmentPeriod"
                                    value={formData.enrollmentPeriod}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.enrollmentPeriod
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="0 for self-paced"
                                    disabled={loading}
                                />
                                {errors.enrollmentPeriod && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.enrollmentPeriod}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.enrollmentPeriod === 0
                                        ? "Self-paced course (no time limit)"
                                        : `${formData.enrollmentPeriod} days access`}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Course End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.endDate
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    disabled={loading}
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.endDate}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Last day students can enroll
                                </p>
                            </div>
                        </div>

                        {/* Level and Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Skill Level
                                </label>
                                <select
                                    name="skillLevel"
                                    value={formData.skillLevel}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                    Duration *
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                        errors.duration
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="e.g., 6 weeks, Self-paced"
                                    disabled={loading}
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddTag)
                                    }
                                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                    placeholder="Add a tag"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors text-sm"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Requirements
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newRequirement}
                                    onChange={(e) =>
                                        setNewRequirement(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddRequirement)
                                    }
                                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                    placeholder="Add a requirement"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRequirement}
                                    className="px-3 py-2 text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer transition-colors text-sm"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {formData.requirements.map(
                                    (requirement, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
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
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                                Learning Outcomes
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newOutcome}
                                    onChange={(e) =>
                                        setNewOutcome(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        handleKeyPress(e, handleAddOutcome)
                                    }
                                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                    placeholder="Add a learning outcome"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddOutcome}
                                    className="px-3 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 cursor-pointer transition-colors text-sm"
                                    disabled={loading}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {formData.outcomes.map((outcome, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                        <span className="text-sm text-gray-700">
                                            {outcome}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveOutcome(outcome)
                                            }
                                            className="text-red-600 hover:text-red-800 cursor-pointer"
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
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 cursor-pointer">
                                    Lessons
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddLesson}
                                    className="flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer transition-colors"
                                    disabled={loading}
                                >
                                    <Plus size={14} className="mr-1" />
                                    Add Lesson
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.lessons.map((lesson, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-800">
                                                Lesson {index + 1}
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveLesson(index)
                                                }
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                disabled={loading}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">
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
                                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                                        errors[
                                                            `lesson_${index}_title`
                                                        ]
                                                            ? "border-red-300"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Lesson title"
                                                    disabled={loading}
                                                />
                                                {errors[
                                                    `lesson_${index}_title`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {
                                                            errors[
                                                                `lesson_${index}_title`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">
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
                                                    className={`w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text ${
                                                        errors[
                                                            `lesson_${index}_duration`
                                                        ]
                                                            ? "border-red-300"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Duration (e.g., 30 mins)"
                                                    disabled={loading}
                                                />
                                                {errors[
                                                    `lesson_${index}_duration`
                                                ] && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {
                                                            errors[
                                                                `lesson_${index}_duration`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-xs text-gray-600 mb-1">
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
                                                className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                                placeholder="https://youtube.com/embed/..."
                                                disabled={loading}
                                            />
                                        </div>
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
                                            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-text"
                                            placeholder="Lesson content/description"
                                            disabled={loading}
                                        />
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
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                disabled={loading}
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                Active Course
                            </label>
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
                        disabled={loading}
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
                            "Update Course"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourseModal;
