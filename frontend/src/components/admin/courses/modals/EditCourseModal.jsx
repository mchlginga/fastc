import { useState, useEffect, useRef, useCallback } from "react";
import { X, Plus, Upload, Tag, Award, Save, Book, Eye } from "react-feather";
import { adminCourseService } from "../../../../services/userService";

const EditCourseModal = ({ isOpen, onClose, course, onCourseUpdated }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        skillLevel: "beginner",
        isActive: true,
        tags: [],
        lessons: [],
        requirements: [],
        outcomes: [],
        enrollmentPeriod: 0,
        endDate: "",
        image: null,
        skillsTaught: [],
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [newTag, setNewTag] = useState("");
    const [newRequirement, setNewRequirement] = useState("");
    const [newOutcome, setNewOutcome] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);

    // Skills state
    const [availableSkills, setAvailableSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [newSkillTaught, setNewSkillTaught] = useState({
        skill: "",
        level: "beginner",
    });

    // Handle body scroll and click outside
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
            const response = await adminCourseService.getAvailableSkills();
            setAvailableSkills(response.skills || []);
        } catch (error) {
            console.error("Error fetching skills:", error);
            setAvailableSkills([]);
        } finally {
            setSkillsLoading(false);
        }
    };

    useEffect(() => {
        if (course) {
            console.log("📝 Editing course:", course);

            const skillsTaught =
                course.skillsTaught?.map((st) => ({
                    skill: st.skill?._id || st.skill,
                    level: st.level || "beginner",
                })) || [];

            // 🆕 FIXED: Ensure each lesson has proper independent data
            const lessons =
                course.lessons?.map((lesson, index) => ({
                    id: lesson._id || `lesson-${Date.now()}-${index}`,
                    title: lesson.title || "",
                    duration: lesson.duration || "",
                    order: lesson.order || index + 1,
                    content: lesson.content || "",
                    isRequired:
                        lesson.isRequired !== undefined
                            ? lesson.isRequired
                            : true,
                    lessonType: lesson.lessonType || "text",
                    videoUrl: lesson.videoUrl || "",
                    quizQuestions:
                        lesson.quizQuestions?.map((q, qIndex) => ({
                            id: q._id || `question-${Date.now()}-${qIndex}`,
                            question: q.question || "",
                            options: q.options || ["", "", "", ""],
                            correctAnswer: q.correctAnswer || 0,
                        })) || [],
                    attachmentUrl: lesson.attachmentUrl || "",
                    attachmentName: lesson.attachmentName || "",
                })) || [];

            setFormData({
                title: course.title || "",
                description: course.description || "",
                category: course.category || "",
                skillLevel: course.skillLevel || "beginner",
                isActive:
                    course.isActive !== undefined ? course.isActive : true,
                tags: course.tags || [],
                lessons: lessons,
                requirements: course.requirements || [],
                outcomes: course.outcomes || [],
                enrollmentPeriod: course.enrollmentPeriod || 0,
                endDate: course.endDate
                    ? new Date(course.endDate).toISOString().split("T")[0]
                    : "",
                image: course.image || null,
                skillsTaught: skillsTaught,
            });

            console.log("🔄 Loaded lessons data:", lessons);

            if (course.image) {
                console.log("🖼️ Course image:", course.image);
                if (course.image.startsWith("http")) {
                    setImagePreview(course.image);
                } else {
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

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [course]);

    const handleClose = useCallback(() => {
        if (loading || saving) return;
        setErrors({});
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    }, [loading, saving, onClose]);

    const handleChange = useCallback(
        (e) => {
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
        },
        [errors]
    );

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
        console.log("🗑️ Removing image...");
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);
        setErrors((prev) => ({ ...prev, image: "" }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        console.log("✅ Image removed from form data");
    };

    // Cleaner array item management
    const handleAddItem = (arrayName, newItem, setNewItem) => {
        if (newItem.trim() && !formData[arrayName].includes(newItem.trim())) {
            setFormData((prev) => ({
                ...prev,
                [arrayName]: [...prev[arrayName], newItem.trim()],
            }));
            setNewItem("");
        }
    };

    const handleRemoveItem = (arrayName, itemToRemove) => {
        setFormData((prev) => ({
            ...prev,
            [arrayName]: prev[arrayName].filter(
                (item) => item !== itemToRemove
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

    // 🆕 FIXED: Lesson management with proper state isolation
    const handleAddLesson = () => {
        const newLessonId = Date.now();
        setFormData((prev) => ({
            ...prev,
            lessons: [
                ...prev.lessons,
                {
                    id: newLessonId,
                    title: "",
                    duration: "",
                    order: prev.lessons.length + 1,
                    content: "",
                    isRequired: true,
                    lessonType: "text",
                    videoUrl: "",
                    quizQuestions: [],
                    attachmentUrl: "",
                    attachmentName: "",
                },
            ],
        }));
    };

    const handleRemoveLesson = (id) => {
        if (formData.lessons.length > 1) {
            setFormData((prev) => ({
                ...prev,
                lessons: prev.lessons.filter((lesson) => lesson.id !== id),
            }));
        }
    };

    // 🆕 FIXED: Proper lesson change without affecting other lessons
    const handleLessonChange = (id, field, value) => {
        console.log(`🔄 Changing lesson ${id}, field: ${field}, value:`, value);

        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson) => {
                if (lesson.id === id) {
                    const updatedLesson = { ...lesson, [field]: value };

                    // Reset dependent fields when lesson type changes
                    if (field === "lessonType") {
                        console.log(
                            `🎯 Resetting fields for lesson type change to: ${value}`
                        );
                        updatedLesson.videoUrl = value === "video" ? "" : "";
                        updatedLesson.quizQuestions =
                            value === "quiz" ? [] : [];
                        updatedLesson.attachmentUrl =
                            value === "reading" ? "" : "";
                        updatedLesson.attachmentName =
                            value === "reading" ? "" : "";
                        updatedLesson.content =
                            value === "text" ? lesson.content : "";
                    }

                    return updatedLesson;
                }
                return lesson;
            }),
        }));
    };

    // Quiz question management
    const handleAddQuizQuestion = (lessonId) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson) =>
                lesson.id === lessonId
                    ? {
                          ...lesson,
                          quizQuestions: [
                              ...(lesson.quizQuestions || []),
                              {
                                  id: Date.now(),
                                  question: "",
                                  options: ["", "", "", ""],
                                  correctAnswer: 0,
                              },
                          ],
                      }
                    : lesson
            ),
        }));
    };

    const handleRemoveQuizQuestion = (lessonId, questionId) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson) =>
                lesson.id === lessonId
                    ? {
                          ...lesson,
                          quizQuestions: lesson.quizQuestions.filter(
                              (q) => q.id !== questionId
                          ),
                      }
                    : lesson
            ),
        }));
    };

    const handleQuizQuestionChange = (lessonId, questionId, field, value) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson) =>
                lesson.id === lessonId
                    ? {
                          ...lesson,
                          quizQuestions: lesson.quizQuestions.map((q) =>
                              q.id === questionId ? { ...q, [field]: value } : q
                          ),
                      }
                    : lesson
            ),
        }));
    };

    const handleQuizOptionChange = (
        lessonId,
        questionId,
        optionIndex,
        value
    ) => {
        setFormData((prev) => ({
            ...prev,
            lessons: prev.lessons.map((lesson) =>
                lesson.id === lessonId
                    ? {
                          ...lesson,
                          quizQuestions: lesson.quizQuestions.map((q) =>
                              q.id === questionId
                                  ? {
                                        ...q,
                                        options: q.options.map(
                                            (opt, optIndex) =>
                                                optIndex === optionIndex
                                                    ? value
                                                    : opt
                                        ),
                                    }
                                  : q
                          ),
                      }
                    : lesson
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
                    newErrors[`lesson_${lesson.id}_title`] = `Lesson ${
                        index + 1
                    } title is required`;
                }
                if (!lesson.duration?.trim()) {
                    newErrors[`lesson_${lesson.id}_duration`] = `Lesson ${
                        index + 1
                    } duration is required`;
                }

                if (lesson.lessonType === "quiz" && lesson.quizQuestions) {
                    lesson.quizQuestions.forEach((question, qIndex) => {
                        if (!question.question?.trim()) {
                            newErrors[
                                `lesson_${lesson.id}_quiz_${question.id}_question`
                            ] = `Question ${qIndex + 1} is required`;
                        }
                        if (question.options.some((opt) => !opt.trim())) {
                            newErrors[
                                `lesson_${lesson.id}_quiz_${question.id}_options`
                            ] = `All options must be filled`;
                        }
                    });
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            const submitData = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "image") {
                    if (formData[key] instanceof File) {
                        submitData.append("image", formData[key]);
                        console.log("📤 Appending new image file");
                    } else if (formData[key] === null) {
                        submitData.append("removeImage", "true");
                        console.log("🗑️ Requesting image removal");
                    }
                } else if (Array.isArray(formData[key])) {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === "isActive") {
                    submitData.append(key, formData[key].toString());
                } else {
                    submitData.append(key, formData[key]);
                }
            });

            console.log("📤 Submitting course update with lessons:", {
                title: formData.title,
                lessons: formData.lessons,
            });

            console.log("🔄 Updating course:", course._id);
            await adminCourseService.updateCourse(course._id, submitData);

            onCourseUpdated();
            handleClose();
        } catch (error) {
            console.error("❌ Error updating course:", error);
            setErrors({ submit: error.message || "Failed to update course" });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col cursor-auto transform transition-all duration-200 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Course
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Update course information and content
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        disabled={saving}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content - Improved scrolling */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Course Image Upload */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Course Image
                            </h3>
                            <div className="flex items-center space-x-6">
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
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                disabled={
                                                    saving || imageUploading
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
                                            disabled={saving}
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
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Basic Information
                            </h3>
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
                                        disabled={saving}
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
                                        disabled={saving}
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="Programming">
                                            Programming
                                        </option>
                                        <option value="Data Science">
                                            Data Science
                                        </option>
                                        <option value="Business">
                                            Business
                                        </option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">
                                            Marketing
                                        </option>
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
                                        <option value="Carpentry">
                                            Carpentry
                                        </option>
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

                            <div className="mt-4">
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
                                    disabled={saving}
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 animate-fadeIn">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                                    Skill Level
                                </label>
                                <select
                                    name="skillLevel"
                                    value={formData.skillLevel}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                    disabled={saving}
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">
                                        Intermediate
                                    </option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        {/* Course Settings */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Course Settings
                            </h3>
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
                                        disabled={saving}
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
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                            errors.endDate
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        disabled={saving}
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
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Skills Taught
                                </h3>
                                <Award size={20} className="text-purple-600" />
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm text-gray-700 mb-2">
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
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                            disabled={saving || skillsLoading}
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
                                        <label className="block text-sm text-gray-700 mb-2">
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
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                            disabled={saving}
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
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSkillTaught}
                                    disabled={!newSkillTaught.skill || saving}
                                    className="flex items-center px-4 py-2.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Add Skill
                                </button>

                                {formData.skillsTaught.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium text-gray-700">
                                            Skills in this Course:
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
                                                            disabled={saving}
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

                        {/* Tags, Requirements & Outcomes */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tags */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h4 className="text-md font-semibold text-gray-900 mb-4">
                                    Tags
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) =>
                                                setNewTag(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                handleKeyPress(e, () =>
                                                    handleAddItem(
                                                        "tags",
                                                        newTag,
                                                        setNewTag
                                                    )
                                                )
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                            placeholder="Add a tag"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddItem(
                                                    "tags",
                                                    newTag,
                                                    setNewTag
                                                )
                                            }
                                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={saving}
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
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            "tags",
                                                            tag
                                                        )
                                                    }
                                                    className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer disabled:opacity-50"
                                                    disabled={saving}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h4 className="text-md font-semibold text-gray-900 mb-4">
                                    Requirements
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newRequirement}
                                            onChange={(e) =>
                                                setNewRequirement(
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                handleKeyPress(e, () =>
                                                    handleAddItem(
                                                        "requirements",
                                                        newRequirement,
                                                        setNewRequirement
                                                    )
                                                )
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                            placeholder="Add a requirement"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddItem(
                                                    "requirements",
                                                    newRequirement,
                                                    setNewRequirement
                                                )
                                            }
                                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={saving}
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
                                                            handleRemoveItem(
                                                                "requirements",
                                                                requirement
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                                        disabled={saving}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Outcomes */}
                            <div className="bg-white rounded-xl border border-gray-100 p-6">
                                <h4 className="text-md font-semibold text-gray-900 mb-4">
                                    Learning Outcomes
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newOutcome}
                                            onChange={(e) =>
                                                setNewOutcome(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                handleKeyPress(e, () =>
                                                    handleAddItem(
                                                        "outcomes",
                                                        newOutcome,
                                                        setNewOutcome
                                                    )
                                                )
                                            }
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                            placeholder="Add an outcome"
                                            disabled={saving}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddItem(
                                                    "outcomes",
                                                    newOutcome,
                                                    setNewOutcome
                                                )
                                            }
                                            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={saving}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.outcomes.map(
                                            (outcome, index) => (
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
                                                            handleRemoveItem(
                                                                "outcomes",
                                                                outcome
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                                        disabled={saving}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🆕 FIXED: Lessons Section with proper state isolation */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Course Lessons
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    Add and organize your course content
                                </p>
                            </div>

                            <div className="space-y-4">
                                {formData.lessons.map((lesson, index) => (
                                    <div
                                        key={lesson.id}
                                        className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-900">
                                                Lesson {index + 1}
                                            </h4>
                                            {formData.lessons.length > 1 && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveLesson(
                                                            lesson.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700 p-1.5 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                                                    disabled={saving}
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Lesson Type
                                                </label>
                                                <select
                                                    value={
                                                        lesson.lessonType ||
                                                        "text"
                                                    }
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            lesson.id,
                                                            "lessonType",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer disabled:opacity-50"
                                                    disabled={saving}
                                                >
                                                    <option value="text">
                                                        Text Lesson
                                                    </option>
                                                    <option value="video">
                                                        Video Lesson
                                                    </option>
                                                    <option value="quiz">
                                                        Quiz Lesson
                                                    </option>
                                                    <option value="reading">
                                                        Reading Material
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Duration *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={lesson.duration}
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            lesson.id,
                                                            "duration",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                                        errors[
                                                            `lesson_${lesson.id}_duration`
                                                        ]
                                                            ? "border-red-300 bg-red-50"
                                                            : "border-gray-300"
                                                    }`}
                                                    placeholder="Duration (e.g., 30 mins)"
                                                    disabled={saving}
                                                />
                                                {errors[
                                                    `lesson_${lesson.id}_duration`
                                                ] && (
                                                    <p className="mt-2 text-xs text-red-600 animate-fadeIn">
                                                        {
                                                            errors[
                                                                `lesson_${lesson.id}_duration`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={lesson.title}
                                                onChange={(e) =>
                                                    handleLessonChange(
                                                        lesson.id,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                                    errors[
                                                        `lesson_${lesson.id}_title`
                                                    ]
                                                        ? "border-red-300 bg-red-50"
                                                        : "border-gray-300"
                                                }`}
                                                placeholder="Lesson title"
                                                disabled={saving}
                                            />
                                            {errors[
                                                `lesson_${lesson.id}_title`
                                            ] && (
                                                <p className="mt-2 text-xs text-red-600 animate-fadeIn">
                                                    {
                                                        errors[
                                                            `lesson_${lesson.id}_title`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        {/* Dynamic Content Based on Lesson Type - FIXED */}
                                        {lesson.lessonType === "video" && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    YouTube Video URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={
                                                        lesson.videoUrl || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            lesson.id,
                                                            "videoUrl",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                    placeholder="https://youtube.com/embed/..."
                                                    disabled={saving}
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Paste YouTube embed URL or
                                                    video ID
                                                </p>
                                            </div>
                                        )}

                                        {lesson.lessonType === "reading" && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Reading Material
                                                </label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-2">
                                                            File URL
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={
                                                                lesson.attachmentUrl ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLessonChange(
                                                                    lesson.id,
                                                                    "attachmentUrl",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                            placeholder="https://cloudinary.com/..."
                                                            disabled={saving}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-2">
                                                            File Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                lesson.attachmentName ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLessonChange(
                                                                    lesson.id,
                                                                    "attachmentName",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                            placeholder="Study Guide.pdf"
                                                            disabled={saving}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {lesson.lessonType === "quiz" && (
                                            <div className="mb-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Quiz Questions
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddQuizQuestion(
                                                                lesson.id
                                                            )
                                                        }
                                                        className="flex items-center px-4 py-2 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 cursor-pointer transition-colors disabled:opacity-50"
                                                        disabled={saving}
                                                    >
                                                        <Plus
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                        Add Question
                                                    </button>
                                                </div>

                                                {lesson.quizQuestions?.map(
                                                    (question, qIndex) => (
                                                        <div
                                                            key={question.id}
                                                            className="mb-4 p-4 border border-gray-200 rounded-lg bg-white"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Question{" "}
                                                                    {qIndex + 1}
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveQuizQuestion(
                                                                            lesson.id,
                                                                            question.id
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                                                    disabled={
                                                                        saving
                                                                    }
                                                                >
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            <input
                                                                type="text"
                                                                value={
                                                                    question.question
                                                                }
                                                                onChange={(e) =>
                                                                    handleQuizQuestionChange(
                                                                        lesson.id,
                                                                        question.id,
                                                                        "question",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 mb-3 ${
                                                                    errors[
                                                                        `lesson_${lesson.id}_quiz_${question.id}_question`
                                                                    ]
                                                                        ? "border-red-300 bg-red-50"
                                                                        : "border-gray-300"
                                                                }`}
                                                                placeholder="Enter question"
                                                                disabled={
                                                                    saving
                                                                }
                                                            />

                                                            <div className="space-y-2">
                                                                {[
                                                                    0, 1, 2, 3,
                                                                ].map(
                                                                    (
                                                                        optIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                optIndex
                                                                            }
                                                                            className="flex items-center gap-3"
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name={`lesson_${lesson.id}_question_${question.id}`}
                                                                                checked={
                                                                                    question.correctAnswer ===
                                                                                    optIndex
                                                                                }
                                                                                onChange={() =>
                                                                                    handleQuizQuestionChange(
                                                                                        lesson.id,
                                                                                        question.id,
                                                                                        "correctAnswer",
                                                                                        optIndex
                                                                                    )
                                                                                }
                                                                                className="text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                                disabled={
                                                                                    saving
                                                                                }
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    question
                                                                                        .options[
                                                                                        optIndex
                                                                                    ] ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleQuizOptionChange(
                                                                                        lesson.id,
                                                                                        question.id,
                                                                                        optIndex,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className={`flex-1 px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50 ${
                                                                                    errors[
                                                                                        `lesson_${lesson.id}_quiz_${question.id}_options`
                                                                                    ]
                                                                                        ? "border-red-300 bg-red-50"
                                                                                        : "border-gray-300"
                                                                                }`}
                                                                                placeholder={`Option ${String.fromCharCode(
                                                                                    65 +
                                                                                        optIndex
                                                                                )}`}
                                                                                disabled={
                                                                                    saving
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                                {/* 🆕 ADD: + Add Another Question button for quizzes */}
                                                {lesson.quizQuestions &&
                                                    lesson.quizQuestions
                                                        .length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAddQuizQuestion(
                                                                    lesson.id
                                                                )
                                                            }
                                                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-purple-400 hover:text-purple-600 transition duration-200 cursor-pointer mt-4"
                                                            disabled={saving}
                                                        >
                                                            + Add Another
                                                            Question
                                                        </button>
                                                    )}
                                            </div>
                                        )}

                                        {/* Default Content for Text Lessons */}
                                        {(lesson.lessonType === "text" ||
                                            !lesson.lessonType) && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Content/Description
                                                </label>
                                                <textarea
                                                    value={lesson.content}
                                                    onChange={(e) =>
                                                        handleLessonChange(
                                                            lesson.id,
                                                            "content",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text disabled:opacity-50"
                                                    placeholder="Lesson content/description"
                                                    disabled={saving}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* 🆕 ADD: The beautiful "+ Add Another Lesson" button from EducationSection */}
                            <button
                                type="button"
                                onClick={handleAddLesson}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition duration-200 cursor-pointer mt-4"
                                disabled={saving}
                            >
                                + Add Another Lesson
                            </button>

                            {formData.lessons.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                                        <Book
                                            size={32}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        No lessons added yet
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Start by adding your first lesson to
                                        create the course content.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="bg-white rounded-xl border border-gray-100 p-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50"
                                    disabled={saving}
                                />
                                <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                    Active Course (Visible to students)
                                </label>
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
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center cursor-pointer ${
                            saving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Updating Course...
                            </>
                        ) : (
                            <>
                                <Save size={16} className="mr-2" />
                                Update Course
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourseModal;
