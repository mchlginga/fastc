import { Clock, Activity, CheckCircle, AlertCircle, X } from "react-feather";

export const getStatusConfig = (status) => {
    const configs = {
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-100",
            label: "Pending",
        },
        active: {
            bg: "bg-emerald-100",
            text: "text-emerald-800",
            border: "border-emerald-100",
            label: "Active",
        },
        completed: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-100",
            label: "Completed",
        },
        cancelled: {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-100",
            label: "Cancelled",
        },
        expired: {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-100",
            label: "Expired",
        },
    };
    return configs[status] || configs.active;
};
