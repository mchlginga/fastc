import { useParams, useNavigate } from "react-router-dom";
import {
    ThumbsUp,
    ThumbsDown,
    Bookmark,
    Clock,
    Download,
    FileText,
    User,
    ChevronLeft,
    Play,
    Lock,
} from "react-feather";

function Lesson() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Lesson Content */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <button
                                onClick={() =>
                                    navigate(`/user/courses/${courseId}`)
                                }
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                            >
                                <ChevronLeft size={16} className="mr-1" />
                                Back to Basic Welding Certification
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Welding Safety
                            </h2>
                            <p className="text-gray-600 text-sm mt-2">
                                Module 1: Safety Fundamentals
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                                <iframe
                                    className="w-full h-96"
                                    src="https://www.youtube.com/embed/SDJfIEZ_7dk?si=esLlaTJPJXaGIIlC"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                ></iframe>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-4">
                                    <button className="bg-blue-100 text-blue-600 p-3 rounded-full hover:bg-blue-200 transition-colors">
                                        <ThumbsUp size={20} />
                                    </button>
                                    <button className="bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-gray-200 transition-colors">
                                        <ThumbsDown size={20} />
                                    </button>
                                    <button className="bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-gray-200 transition-colors">
                                        <Bookmark size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Clock size={16} className="mr-2" />
                                    20 min
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Lesson Overview
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    In this lesson, you'll learn the essential
                                    safety practices for welding. We'll cover
                                    personal protective equipment (PPE), safe
                                    handling of welding tools, and how to avoid
                                    common hazards in a welding environment.
                                </p>

                                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">
                                    Key Concepts
                                </h3>
                                <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
                                    <li>
                                        Wearing appropriate PPE (helmets,
                                        gloves, jackets)
                                    </li>
                                    <li>
                                        Ensuring proper ventilation in welding
                                        areas
                                    </li>
                                    <li>Handling welding equipment safely</li>
                                    <li>
                                        Identifying and mitigating fire hazards
                                    </li>
                                    <li>
                                        Emergency procedures for welding
                                        accidents
                                    </li>
                                </ul>

                                <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">
                                    Resources
                                </h3>
                                <div className="space-y-3">
                                    <a
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download Safety Guidelines
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <FileText size={16} className="mr-2" />
                                        Welding Safety Checklist
                                    </a>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Complete Lesson
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Discussion Section */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Discussion
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Ask a question or share your thoughts..."
                                ></textarea>
                                <div className="flex justify-end mt-2">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        Post Comment
                                    </button>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4 mb-4">
                                <div className="flex items-start space-x-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User
                                            size={20}
                                            className="text-blue-600"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-800">
                                                Juan Dela Cruz
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                2 days ago
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1">
                                            Great safety tips! Is there a
                                            specific brand of welding helmet you
                                            recommend for beginners?
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm">
                                            <a
                                                href="#"
                                                className="text-gray-500 hover:text-blue-600"
                                            >
                                                Reply
                                            </a>
                                            <button className="text-gray-500 hover:text-blue-600 flex items-center">
                                                <ThumbsUp
                                                    size={16}
                                                    className="mr-1"
                                                />{" "}
                                                3
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md sticky top-20">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Lesson Navigation
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <span className="ml-2 font-medium text-gray-800">
                                        0% Complete
                                    </span>
                                </div>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    Complete Lesson
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <Play
                                                size={16}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <span className="font-medium text-gray-800">
                                            Welding Safety
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                            <Lock
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <span className="text-gray-700">
                                            Welding Techniques
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                            <Lock
                                                size={16}
                                                className="text-gray-400"
                                            />
                                        </div>
                                        <span className="text-gray-700">
                                            Weld Imperfections
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lesson;
