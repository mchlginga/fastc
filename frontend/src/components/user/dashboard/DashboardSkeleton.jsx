function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Alert Skeleton */}
                <div className="bg-gray-200 animate-pulse h-16 rounded-lg mb-6"></div>

                {/* Hero Section Skeleton */}
                <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl p-8 mb-10">
                    <div className="h-8 bg-gray-400 rounded w-1/3 mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-400 rounded w-2/3 animate-pulse"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div className="bg-gray-200 p-3 rounded-xl w-12 h-12 animate-pulse"></div>
                                <div className="text-right">
                                    <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Overview Skeleton */}
                <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-md mb-10 overflow-hidden border border-gray-100">
                    <div className="p-8 md:w-1/3 flex justify-center items-center">
                        <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                    <div className="p-8 md:w-2/3 border-l border-gray-100">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
                        <div className="flex gap-3">
                            <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Active Courses Skeleton */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3 animate-pulse"></div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-full h-10 bg-gray-200 rounded-lg mt-4 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DashboardSkeleton;
