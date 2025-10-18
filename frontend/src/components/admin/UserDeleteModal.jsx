import React from "react";
import { X, AlertCircle } from "react-feather";

const UserDeleteModal = ({ user, isOpen, onClose, handleDeleteConfirm }) => {
    if (!isOpen || !user) return null;

    return (
        <div
            className="mx-auto fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50"
            onClick={onClose}
        >
            <div
                className="relative top-20 mx-auto p-5 border border-gray-200 not-last:w-full max-w-md shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mt-3 text-center">
                    <AlertCircle
                        className="mx-auto text-red-600 mb-4"
                        size={48}
                    />
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        Delete User
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Are you sure you want to delete {user.firstName}{" "}
                        {user.surname}? This action cannot be undone.
                    </p>
                    <div className="flex justify-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDeleteModal;
