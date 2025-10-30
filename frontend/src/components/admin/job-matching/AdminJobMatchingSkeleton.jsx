// C:\Users\y\OneDrive\Desktop\fastc\frontend\src\components\admin\job-matching\AdminJobMatchingSkeleton.jsx

const AdminJobMatchingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                            >
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Panel Skeleton */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                                <div className="lg:hidden h-8 w-8 bg-gray-200 rounded"></div>
                            </div>

                            {/* Clear Filters Skeleton */}
                            <div className="h-10 bg-gray-200 rounded-xl mb-6"></div>

                            {/* Filter Sections */}
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-8 bg-gray-200 rounded-lg"></div>
                                        {[...Array(3)].map((_, j) => (
                                            <div
                                                key={j}
                                                className="flex items-center space-x-2"
                                            >
                                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-1">
                        {/* Results and Actions Skeleton */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                                    <div className="h-3 bg-gray-200 rounded w-64"></div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
                                </div>
                            </div>
                        </div>

                        {/* Trainee Grid Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                                    </div>

                                    {/* Category */}
                                    <div className="mb-6">
                                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-4">
                                        <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[...Array(3)].map((_, j) => (
                                                <div
                                                    key={j}
                                                    className="h-6 bg-gray-200 rounded-full w-20"
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div className="mb-4">
                                        <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[...Array(2)].map((_, j) => (
                                                <div
                                                    key={j}
                                                    className="h-6 bg-gray-200 rounded-full w-24"
                                                ></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJobMatchingSkeleton;
