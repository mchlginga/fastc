import { AlertTriangle, Lock, Shield } from "react-feather";

const SecuritySection = ({
    showPasswordModal,
    showDeleteModal,
    onPasswordModalChange,
    onDeleteModalChange,
    searchQuery,
    isFiltered = false,
}) => {
    if (isFiltered) {
        return (
            <section className="space-y-6">
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                        <Shield size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Security settings
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Security settings don't support search. Clear your
                        search to view security options.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Password Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:border-gray-300 transition-colors">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Password
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Change your account password
                    </p>
                </div>
                <button
                    onClick={() => onPasswordModalChange(true)}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                >
                    Change Password
                </button>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-white rounded-xl shadow-xs border border-red-300 p-6">
                <div className="border-b border-red-300 pb-4 mb-6 -mx-6 -mt-6 px-6 py-4 rounded-t-xl bg-red-50">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Danger Zone
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Permanently delete your account and all associated data
                    </p>
                </div>
                <div>
                    <p className="text-gray-600 text-sm mb-4">
                        This will immediately log you out and you won't be able
                        to access your account again.
                    </p>
                    <button
                        onClick={() => onDeleteModalChange(true)}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center cursor-pointer"
                    >
                        <AlertTriangle size={16} className="mr-2" />
                        Delete Account
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
