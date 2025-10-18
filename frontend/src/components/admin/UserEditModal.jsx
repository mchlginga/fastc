import React from "react";
import { X } from "react-feather";

const UserEditModal = ({
    user,
    isOpen,
    onClose,
    editFormData,
    setEditFormData,
    handleEditSubmit,
}) => {
    if (!isOpen || !user) return null;

    const handleChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50"
            onClick={onClose}
        >
            <div
                className="relative top-20 mx-auto p-5 border border-gray-200 w-full max-w-md shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Edit User
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <form
                        onSubmit={handleEditSubmit}
                        className="px-4 py-5 sm:p-6"
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={editFormData.username}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={editFormData.firstName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Surname
                            </label>
                            <input
                                type="text"
                                name="surname"
                                value={editFormData.surname}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserEditModal;
