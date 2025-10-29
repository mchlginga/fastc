function CertificatesSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <div className="w-8 h-8 bg-gray-300 rounded mr-3 animate-pulse"></div>
                                <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                            </div>
                            <div className="h-6 bg-gray-300 rounded w-64 animate-pulse"></div>
                        </div>
                        {/* Search Bar Skeleton */}
                        <div className="w-full lg:w-80">
                            <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between"
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-xl mr-4 animate-pulse"></div>
                            <div className="text-right">
                                <div className="h-8 bg-gray-300 rounded w-12 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Certificates Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col"
                        >
                            {/* Header Skeleton */}
                            <div className="bg-gray-300 p-6 rounded-t-2xl animate-pulse">
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
    );
}

export default CertificatesSkeleton;
