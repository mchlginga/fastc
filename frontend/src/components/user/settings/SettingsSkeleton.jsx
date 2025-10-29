const SettingsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation Skeleton */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-md p-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="mb-2 last:mb-0">
                                    <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="border-b border-gray-300 pb-4 mb-6">
                                <div className="h-6 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
                            </div>

                            {/* Form fields skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((field) => (
                                    <div key={field}>
                                        <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                                        <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Button skeleton */}
                            <div className="mt-8 flex justify-end">
                                <div className="h-12 bg-gray-300 rounded-lg w-40 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsSkeleton;
