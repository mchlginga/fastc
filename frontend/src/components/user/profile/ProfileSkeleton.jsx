function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header Skeleton */}
                <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border border-gray-100">
                    <div className="md:flex items-center gap-10">
                        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                            <div className="w-36 h-36 bg-gray-300 rounded-full animate-pulse mb-4"></div>
                            <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                            <div className="flex gap-2 mt-3">
                                <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                                <div className="h-6 bg-gray-300 rounded w-12 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-300 md:pl-10 pt-6 md:pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index}>
                                        <div className="h-4 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
                                        <div className="h-5 bg-gray-300 rounded w-24 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-10 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                    {[...Array(2)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-gray-300 rounded-xl animate-pulse"></div>
                            <div className="text-right">
                                <div className="h-8 bg-gray-300 rounded w-12 mb-2 animate-pulse"></div>
                                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Course Progress Skeleton */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-10">
                    <div className="p-6 border-b border-gray-300 bg-gray-50">
                        <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                    </div>
                    <div className="p-6 space-y-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-8 animate-pulse"></div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-gray-300 h-2.5 rounded-full w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certificates Skeleton */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                            >
                                <div className="h-40 bg-gray-300 animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-5 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSkeleton;
