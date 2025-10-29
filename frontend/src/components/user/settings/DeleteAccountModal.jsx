import { AlertTriangle, X } from "react-feather";

const DeleteAccountModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Delete Account
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <AlertTriangle
                            size={20}
                            className="text-red-600 mr-3"
                        />
                        <p className="text-gray-600 text-sm">
                            Are you sure you want to delete your account? This
                            action cannot be undone. All your data will be
                            permanently removed.
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center cursor-pointer">
                            <AlertTriangle size={16} className="mr-2" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
