import { AlertTriangle, Lock } from "react-feather";

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
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                        <Lock size={32} className="text-gray-400" />
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
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                <div className="border-b border-gray-300 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Password
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Change your account password
                    </p>
                </div>
                <button
                    onClick={() => onPasswordModalChange(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition cursor-pointer"
                >
                    Change Password
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition border border-red-300">
                <div className="border-b border-red-300 pb-4 mb-6 bg-red-50 -mx-6 -mt-6 px-6 py-4 rounded-t-2xl">
                    <h3 className="text-lg font-semibold text-gray-800">
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
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center cursor-pointer"
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
