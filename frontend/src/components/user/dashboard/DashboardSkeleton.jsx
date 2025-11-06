function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Alert Skeleton */}
                <div className="bg-gray-200 animate-pulse h-16 rounded-lg mb-6"></div>

                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white border border-gray-100 rounded-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="h-7 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Overview Skeleton */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 mb-8 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                            <div>
                                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Active Courses Skeleton */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-xs border border-gray-100 p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 animate-pulse"></div>
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default DashboardSkeleton;
