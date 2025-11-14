function CourseDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section Skeleton */}
                <div className="mb-8">
                    <div className="space-y-1">
                        <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-56 animate-pulse"></div>
                    </div>
                </div>

                {/* Course Header Card Skeleton */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden mb-8">
                    <div className="md:flex">
                        {/* Image Skeleton */}
                        <div className="md:shrink-0 md:w-1/3">
                            <div className="h-64 w-full md:h-full bg-gray-300 animate-pulse"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-8 md:w-2/3">
                            {/* Title Skeleton */}
                            <div className="h-7 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>

                            {/* Description Skeleton */}
                            <div className="space-y-2 mb-6">
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                            </div>

                            {/* Progress Bar Skeleton */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gray-300 h-2 rounded-full w-1/2 animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Button Skeleton */}
                            <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Course Content Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* What You'll Learn Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                            <div className="flex items-center mb-4">
                                <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                                <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Description Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        {/* Requirements Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="h-5 bg-gray-300 rounded w-24 mb-3 animate-pulse"></div>
                            <div className="space-y-2">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center text-sm"
                                    >
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Details Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm"
                                    >
                                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Stats Skeleton */}
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="h-5 bg-gray-300 rounded w-28 mb-4 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="h-5 bg-gray-300 rounded w-6 mx-auto mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="h-5 bg-gray-300 rounded w-6 mx-auto mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetailSkeleton;
