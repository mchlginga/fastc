// C:\Users\y\OneDrive\Desktop\fastc\frontend\src\components\company\profile\CompanyProfileSkeleton.jsx
function CompanyProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <div className="h-7 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Profile Header Skeleton */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 mb-10">
                    <div className="md:flex items-center gap-10">
                        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                            <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200 md:pl-10 pt-6 md:pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {[...Array(6)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                                        <div>
                                            <div className="h-4 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
                                            <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 flex items-center justify-between"
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                            <div className="text-right">
                                <div className="h-8 bg-gray-300 rounded w-12 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status & Quick Info Cards Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Status Card Skeleton */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Quick Info Card Skeleton */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="space-y-3">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2"
                                >
                                    <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompanyProfileSkeleton;
