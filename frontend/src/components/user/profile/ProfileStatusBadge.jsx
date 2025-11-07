function ProfileStatusBadge({ status }) {
    const getStatusConfig = (status) => {
        const configs = {
            approved: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                label: "Approved",
            },
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                label: "Pending Review",
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
        >
            {config.label}
        </span>
    );
}

export default ProfileStatusBadge;
