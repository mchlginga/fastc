const AdminDashboardSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <div className="h-8 bg-gray-300 rounded w-64 animate-pulse mb-2"></div>
                            <div className="h-5 bg-gray-300 rounded w-96 animate-pulse"></div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                            <div className="h-10 bg-gray-300 rounded-xl w-32 animate-pulse"></div>
                            <div className="h-10 bg-gray-300 rounded-xl w-40 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="bg-gray-200 p-3 rounded-xl mr-4">
                                    <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                                <div className="text-right">
                                    <div className="h-8 bg-gray-300 rounded w-16 animate-pulse mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Export Analytics Skeleton */}
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="h-6 bg-gray-300 rounded w-48 animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                        </div>
                        <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-gray-200 rounded-2xl p-4 mb-3">
                                    <div className="h-8 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="h-10 bg-gray-300 rounded-xl w-40 animate-pulse"></div>
                    </div>
                </div>

                {/* System Overview & Recent Activities Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* System Overview Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="w-5 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-5 bg-gray-300 rounded w-32 animate-pulse"></div>
                            </div>

                            <div className="space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center py-3 border-b border-gray-100"
                                    >
                                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities Skeleton */}
                    <div className="lg:col-span-2">
                        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md">
                            <div className="h-6 bg-gray-300 rounded w-40 animate-pulse mb-6"></div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index}>
                                        <div className="flex items-center mb-4">
                                            <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                        </div>
                                        <div className="space-y-3">
                                            {[...Array(3)].map(
                                                (_, itemIndex) => (
                                                    <div
                                                        key={itemIndex}
                                                        className="p-3 bg-gray-200 rounded-xl"
                                                    >
                                                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse mb-2"></div>
                                                        <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardSkeleton;
