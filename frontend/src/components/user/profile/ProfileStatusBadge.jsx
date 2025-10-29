function ProfileStatusBadge({ status }) {
    const getStatusConfig = (status) => {
        const configs = {
            approved: {
                bg: "bg-green-100",
                text: "text-green-800",
                border: "border-green-200",
                label: "Approved",
            },
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                border: "border-yellow-200",
                label: "Pending Review",
            },
            rejected: {
                bg: "bg-red-100",
                text: "text-red-800",
                border: "border-red-200",
                label: "Rejected",
            },
        };
        return configs[status] || configs.pending;
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${config.bg} ${config.text} ${config.border}`}
        >
            {config.label}
        </span>
    );
}

export default ProfileStatusBadge;
