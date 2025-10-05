import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Eye,
    Edit,
    Trash2,
    Archive,
    CheckCircle,
    RefreshCw,
    FileText,
    Upload,
    Clock,
    BookOpen,
    Layers,
    Search,
} from "react-feather";

const mockCourses = [
    {
        id: 1,
        title: "Automotive Servicing NC II",
        description:
            "Comprehensive training in automotive repair and maintenance.",
        duration: "6 months",
        lessons: 12,
        instructor: "Maria Santos",
        endDate: null,
        image: "automotive.jpg",
        status: "Active",
    },
    {
        id: 2,
        title: "Electrical Installation NC II",
        description:
            "Learn electrical wiring and installation safety standards.",
        duration: "4 months",
        lessons: 10,
        instructor: "John Reyes",
        endDate: "2024-08-01",
        image: "electrical.jpg",
        status: "Completed",
    },
    {
        id: 3,
        title: "Basic Welding Certification",
        description: "Hands-on training for beginner-level welding skills.",
        duration: "3 months",
        lessons: 8,
        instructor: "Carlos Lim",
        endDate: "2023-12-10",
        image: "welding.jpg",
        status: "Archived",
    },
];

const AdminCourses = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        image: "",
        endDate: "",
    });

    const filteredCourses = useMemo(() => {
        return mockCourses.filter((course) => {
            const matchesSearch = course.title
                .toLowerCase()
                .includes(search.toLowerCase());
            if (activeTab === "all") return matchesSearch;
            if (activeTab === "active")
                return course.status === "Active" && matchesSearch;
            if (activeTab === "completed")
                return course.status === "Completed" && matchesSearch;
            if (activeTab === "archived")
                return course.status === "Archived" && matchesSearch;
            return matchesSearch;
        });
    }, [search, activeTab]);

    const totalCourses = mockCourses.length;
    const activeCourses = mockCourses.filter(
        (c) => c.status === "Active"
    ).length;
    const completedCourses = mockCourses.filter(
        (c) => c.status === "Completed"
    ).length;
    const archivedCourses = mockCourses.filter(
        (c) => c.status === "Archived"
    ).length;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateCourse = (e) => {
        e.preventDefault();
        alert(`Course created: ${formData.title}`);
        setFormData({
            title: "",
            description: "",
            duration: "",
            image: "",
            endDate: "",
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Course Management
                </h1>
                <p className="text-gray-600">
                    Manage all training courses, schedules, and lessons.
                </p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl flex items-center shadow-sm">
                    <BookOpen className="text-blue-600 mr-3" size={24} />
                    <div>
                        <h4 className="text-gray-700 font-semibold">
                            Total Courses
                        </h4>
                        <p className="text-xl font-bold">{totalCourses}</p>
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl flex items-center shadow-sm">
                    <CheckCircle className="text-green-600 mr-3" size={24} />
                    <div>
                        <h4 className="text-gray-700 font-semibold">Active</h4>
                        <p className="text-xl font-bold">{activeCourses}</p>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl flex items-center shadow-sm">
                    <Clock className="text-yellow-600 mr-3" size={24} />
                    <div>
                        <h4 className="text-gray-700 font-semibold">
                            Completed
                        </h4>
                        <p className="text-xl font-bold">{completedCourses}</p>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl flex items-center shadow-sm">
                    <Archive className="text-gray-600 mr-3" size={24} />
                    <div>
                        <h4 className="text-gray-700 font-semibold">
                            Archived
                        </h4>
                        <p className="text-xl font-bold">{archivedCourses}</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <div className="flex space-x-4">
                    {["all", "active", "completed", "archived", "create"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                                    activeTab === tab
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-500"
                                }`}
                            >
                                {tab === "create"
                                    ? "Create Course"
                                    : tab.charAt(0).toUpperCase() +
                                      tab.slice(1)}
                            </button>
                        )
                    )}
                </div>

                {activeTab !== "create" && (
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-2.5 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                )}
            </div>

            {/* All / Active / Completed / Archived */}
            {activeTab !== "create" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {activeTab === "all"
                            ? "All Courses"
                            : activeTab.charAt(0).toUpperCase() +
                              activeTab.slice(1)}{" "}
                        Courses
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-3 px-4 text-left">
                                        Title
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Duration
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Lessons
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Instructor
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((course) => (
                                        <tr
                                            key={course.id}
                                            className="hover:bg-gray-100 border-b border-gray-100"
                                        >
                                            <td className="py-3 px-4 font-medium text-gray-800">
                                                {course.title}
                                            </td>
                                            <td className="py-3 px-4">
                                                {course.duration}
                                            </td>
                                            <td className="py-3 px-4">
                                                {course.lessons}
                                            </td>
                                            <td className="py-3 px-4">
                                                {course.instructor}
                                            </td>
                                            <td
                                                className={`py-3 px-4 font-semibold ${
                                                    course.status === "Active"
                                                        ? "text-green-600"
                                                        : course.status ===
                                                          "Completed"
                                                        ? "text-yellow-600"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {course.status}
                                            </td>
                                            <td className="py-3 px-4 flex space-x-2">
                                                <Link
                                                    to="#"
                                                    className="text-blue-600 hover:text-blue-500"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    to="#"
                                                    className="text-green-600 hover:text-green-500"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                {course.status ===
                                                "Archived" ? (
                                                    <button className="text-green-600 hover:text-green-500">
                                                        <RefreshCw size={16} />
                                                    </button>
                                                ) : (
                                                    <button className="text-gray-600 hover:text-gray-500">
                                                        <Archive size={16} />
                                                    </button>
                                                )}
                                                <button className="text-red-600 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-6 text-gray-500 italic"
                                        >
                                            No courses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Course */}
            {activeTab === "create" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Create New Course
                    </h2>
                    <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows="4"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 6 months"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    End Date (optional)
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Image
                            </label>
                            <div className="mt-1 flex items-center">
                                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200">
                                    <Upload
                                        size={16}
                                        className="text-gray-600"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Upload File
                                    </span>
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                image:
                                                    e.target.files[0]?.name ||
                                                    "",
                                            }))
                                        }
                                        className="hidden"
                                    />
                                </label>
                                {formData.image && (
                                    <span className="ml-3 text-sm text-gray-600">
                                        {formData.image}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Create Course
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
