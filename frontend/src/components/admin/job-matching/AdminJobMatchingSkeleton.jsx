import { BarChart2 } from "react-feather";

const SkeletonStatCard = () => (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="text-right">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
        </div>
    </div>
);

const SkeletonFilterSection = () => (
    <div className="mb-6">
        <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
        </div>
    </div>
);

const SkeletonTraineeCard = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="ml-4">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        <div className="space-y-4">
            {/* Skills Skeleton */}
            <div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, idx) => (
                        <div
                            key={idx}
                            className="h-6 bg-gray-200 rounded w-16 animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>

            {/* Certifications Skeleton */}
            <div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(2)].map((_, idx) => (
                        <div
                            key={idx}
                            className="h-6 bg-gray-200 rounded w-20 animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>

            {/* Details Grid Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, idx) => (
                    <div key={idx}>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* AI Recommendation Skeleton */}
            <div className="pt-3 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="text-right">
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const AdminJobMatchingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <BarChart2 size={28} className="text-blue-600 mr-3" />
                        <div className="h-8 bg-gray-300 rounded w-64 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-96 animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, index) => (
                            <SkeletonStatCard key={index} />
                        ))}
                    </div>
                </div>

                {/* Unified Container Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Skeleton */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1 max-w-lg">
                                <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(2)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div className="flex gap-3">
                                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <SkeletonTraineeCard key={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJobMatchingSkeleton;
