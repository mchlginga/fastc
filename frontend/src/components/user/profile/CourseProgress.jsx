import { Link } from "react-router-dom";
import { Book } from "react-feather";

const ProgressBar = ({ enrollment }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-gray-800 font-medium text-sm">
                {enrollment.course?.title || "Untitled Course"}
            </span>
            <span className="text-gray-600 text-sm">
                {enrollment.progress || 0}%
            </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                    width: `${enrollment.progress || 0}%`,
                }}
            ></div>
        </div>
    </div>
);

function CourseProgress({ courses }) {
    const activeCourses = courses.filter(
        (course) => course && course.status === "active"
    );

    return (
        <section className="mb-10">
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-300 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Course Progress
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    {activeCourses.slice(0, 4).map((enrollment, idx) => (
                        <ProgressBar
                            key={
                                enrollment.enrollmentId || enrollment.id || idx
                            }
                            enrollment={enrollment}
                        />
                    ))}
                    {activeCourses.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <Book
                                size={48}
                                className="mx-auto text-gray-300 mb-3"
                            />
                            <p className="text-sm">No active courses yet.</p>
                            <Link
                                to="/courses"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CourseProgress;
