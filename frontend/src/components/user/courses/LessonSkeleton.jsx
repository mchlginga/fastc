function LessonSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button Skeleton */}
                <div className="mb-6">
                    <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Lesson Header Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                <div className="flex-1">
                                    {/* Badges Skeleton */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
                                        <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
                                    </div>
                                    {/* Title Skeleton */}
                                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
                                    {/* Description Skeleton */}
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                                    </div>
                                </div>
                                {/* Duration Skeleton */}
                                <div className="h-10 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
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
                                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-24 animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Lesson Content Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {/* Video/Content Area Skeleton */}
                            <div className="aspect-w-16 aspect-h-9 bg-gray-300 animate-pulse h-96"></div>

                            {/* Lesson Content Details Skeleton */}
                            <div className="p-8">
                                {/* Learning Materials Skeleton */}
                                <div className="mb-8">
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

                                {/* Completion Section Skeleton */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                                </div>

                                {/* Navigation Skeleton */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                    <div className="h-10 bg-gray-300 rounded-xl w-32 animate-pulse"></div>
                                    <div className="h-10 bg-gray-300 rounded-xl w-32 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Course Info Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
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

                        {/* Lesson Navigation Skeleton */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-gray-300 rounded mr-2 animate-pulse"></div>
                                    <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="p-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                                <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                                            </div>
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
}

export default LessonSkeleton;
