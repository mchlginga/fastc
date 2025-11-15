import { Activity, Clock } from "react-feather";

const DashboardHeader = ({
    user,
    onlineUsers,
    lastUpdated,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Format time without seconds
    const formatTimeWithoutSeconds = (date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Welcome back, {user?.firstName || "Admin"}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Overview of your FAST-C training center
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
