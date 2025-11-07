function CompanyProfileAlert({ user }) {
    if (user?.profileStatus === "pending") {
        return (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-start">
                    <div className="shrink-0">
                        <svg
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                            Profile Under Review
                        </h3>
                        <div className="mt-1 text-sm text-yellow-700">
                            <p>
                                Your company profile is pending admin approval.
                                You can explore job matching but some features
                                are limited. You'll gain full access once
                                approved.
                            </p>
                            <p className="mt-1 text-xs">
                                <strong>Current limitations:</strong> Contact
                                details hidden, CSV export disabled
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (user?.profileStatus === "rejected") {
        return (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                <div className="flex items-start">
                    <div className="shrink-0">
                        <svg
                            className="h-5 w-5 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Profile Rejected
                        </h3>
                        <div className="mt-1 text-sm text-red-700">
                            <p>
                                Your company profile was rejected. Please update
                                your profile information and resubmit for
                                approval.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default CompanyProfileAlert;
