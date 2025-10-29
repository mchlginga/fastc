import { Clock, Activity, CheckCircle, AlertCircle, X } from "react-feather";

export const getStatusConfig = (status) => {
    const configs = {
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-200",
            icon: <Clock size={12} className="mr-1" />,
            label: "Pending Approval",
        },
        active: {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-200",
            icon: <Activity size={12} className="mr-1" />,
            label: "Active",
        },
        completed: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-200",
            icon: <CheckCircle size={12} className="mr-1" />,
            label: "Completed",
        },
        cancelled: {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
            icon: <X size={12} />,
            label: "Cancelled",
        },
        expired: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-200",
            icon: <AlertCircle size={12} />,
            label: "Access Expired",
        },
    };
    return configs[status] || configs.active;
};
