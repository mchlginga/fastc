function CertificatesSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <div className="h-7 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="h-7 bg-gray-200 rounded w-12 animate-pulse mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Card Skeleton */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Filters Section Skeleton */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search Bar Skeleton */}
                            <div className="flex-1 max-w-lg">
                                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                            {/* Action Buttons Skeleton */}
                            <div className="flex flex-wrap gap-2">
                                <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Certificates Grid Skeleton */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl border border-gray-100 flex flex-col"
                                >
                                    {/* Header Skeleton */}
                                    <div className="bg-gray-300 p-6 rounded-t-xl animate-pulse">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-6 bg-gray-400 rounded w-32 animate-pulse"></div>
                                            <div className="h-6 bg-gray-400 rounded w-20 animate-pulse"></div>
                                        </div>
                                        <div className="h-4 bg-gray-400 rounded w-24 animate-pulse"></div>
                                    </div>

                                    {/* Body Skeleton */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <div className="h-5 bg-gray-300 rounded w-40 mb-2 animate-pulse"></div>
                                            <div className="h-3 bg-gray-300 rounded w-full animate-pulse"></div>
                                            <div className="h-3 bg-gray-300 rounded w-3/4 mt-1 animate-pulse"></div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            {[...Array(2)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center"
                                                >
                                                    <div className="w-4 h-4 bg-gray-300 rounded mr-3 animate-pulse"></div>
                                                    <div className="space-y-1 flex-1">
                                                        <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                                                        <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="h-3 bg-gray-300 rounded w-20 mb-1 animate-pulse"></div>
                                            <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                        </div>

                                        <div className="flex space-x-2 mt-auto">
                                            <div className="flex-1 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                                            <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CertificatesSkeleton;
