import { Book, Search, X, RefreshCw } from "react-feather";

function CoursesHeader({
    statusFilter,
    searchQuery,
    onSearchChange,
    onRefresh,
    refreshing = false,
}) {
    const getSubtitle = () => {
        if (statusFilter) {
            return `Showing ${statusFilter} courses`;
        }
        return "Browse available courses or manage your enrollments";
    };

    const handleClearSearch = () => {
        onSearchChange("");
    };

    return (
        <section className="mb-8">
            {/* Header Section - Clean and Minimal */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Courses
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        {getSubtitle()}
                    </p>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    {/* Clean Search Bar */}
                    <div className="relative flex-1 lg:w-80">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Refresh Button */}
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            disabled={refreshing}
                            className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-50/60 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            title="Refresh courses"
                        >
                            <RefreshCw
                                size={18}
                                className={`${
                                    refreshing ? "animate-spin" : ""
                                }`}
                            />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CoursesHeader;
