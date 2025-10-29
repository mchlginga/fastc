function CourseDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button Skeleton */}
                <div className="mb-6">
                    <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>

                {/* Course Header Skeleton */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                    <div className="md:flex">
                        {/* Image Skeleton */}
                        <div className="md:flex-shrink-0 md:w-1/3">
                            <div className="h-64 w-full md:h-full bg-gray-300 animate-pulse"></div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="p-8 md:w-2/3">
                            {/* Badges Skeleton */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="h-6 bg-gray-300 rounded-full w-32 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded-full w-28 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
                            </div>

                            {/* Title Skeleton */}
                            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>

                            {/* Description Skeleton */}
                            <div className="space-y-2 mb-6">
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                            </div>

                            {/* Stats Skeleton */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="w-5 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Progress Bar Skeleton */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-gray-300 h-3 rounded-full w-1/2 animate-pulse"></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Button Skeleton */}
                            <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Course Details Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[...Array(6)].map((_, index) => (
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
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 animate-pulse"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
                                                <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="h-8 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Description Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-6">
                        {/* Requirements Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="h-6 bg-gray-300 rounded w-32 mb-3 animate-pulse"></div>
                            <div className="space-y-2">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="w-2 h-2 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Stats Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-5 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between"
                                    >
                                        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress Stats Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-12 mx-auto animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-300 rounded w-12 mx-auto animate-pulse"></div>
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
