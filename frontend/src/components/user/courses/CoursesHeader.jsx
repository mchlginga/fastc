import { Book, Search } from "react-feather";

function CoursesHeader({ statusFilter, searchQuery, onSearchChange }) {
    const getSubtitle = () => {
        if (statusFilter) {
            return `Showing ${statusFilter} courses`;
        }
        return "Browse available courses or manage your enrollments";
    };

    return (
        <section className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Book size={26} className="text-blue-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-800">
                            Courses
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg">{getSubtitle()}</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full lg:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CoursesHeader;
