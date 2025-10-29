function CoursesSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Alert Skeleton */}
                <div className="bg-gray-200 animate-pulse h-16 rounded-lg mb-6"></div>

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

                {/* Tabs Skeleton */}
                <div className="flex space-x-2 mt-4 mb-8">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="h-10 bg-gray-300 rounded-lg w-32 animate-pulse"
                        ></div>
                    ))}
                </div>

                {/* Courses Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md border border-gray-100"
                        >
                            {/* Image Skeleton */}
                            <div className="w-full h-48 bg-gray-300 rounded-t-2xl animate-pulse"></div>

                            {/* Content Skeleton */}
                            <div className="p-6">
                                {/* Badges Skeleton */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
                                    <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                                </div>

                                {/* Title Skeleton */}
                                <div className="h-5 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>

                                {/* Description Skeleton */}
                                <div className="space-y-2 mb-4">
                                    <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
                                </div>

                                {/* Meta Info Skeleton */}
                                <div className="flex justify-between items-center text-sm mb-4">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-300 rounded mr-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-300 rounded mr-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Button Skeleton */}
                                <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CoursesSkeleton;
