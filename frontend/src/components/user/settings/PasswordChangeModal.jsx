import { Eye, EyeOff, Lock, X } from "react-feather";
import { changePassword } from "../../../services/userService";

const PasswordChangeModal = ({
    isOpen,
    onClose,
    passwordData,
    passwordErrors,
    changingPassword,
    showPasswords,
    onPasswordDataChange,
    onPasswordErrorsChange,
    onChangingPasswordChange,
    onShowPasswordsChange,
    onToastNotification,
}) => {
    if (!isOpen) return null;

    const togglePasswordVisibility = (field) => {
        onShowPasswordsChange((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { id, value } = e.target;
        onPasswordDataChange((prev) => ({ ...prev, [id]: value }));
        onPasswordErrorsChange((prev) => ({ ...prev, [id]: "" }));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            onPasswordErrorsChange(newErrors);
            return;
        }

        onChangingPasswordChange(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            onToastNotification({
                message: "Password changed successfully!",
                type: "success",
            });

            onClose();
        } catch (error) {
            onToastNotification({
                message: error.message || "Failed to change password",
                type: "error",
            });
        } finally {
            onChangingPasswordChange(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Change Password
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handlePasswordChange}>
                    <div className="p-6 space-y-4">
                        {/* Current Password */}
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-2"
                                htmlFor="currentPassword"
                            >
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    type={
                                        showPasswords.currentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    className={`w-full px-4 py-3 pr-10 border ${
                                        passwordErrors.currentPassword
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition`}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "currentPassword"
                                        )
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPasswords.currentPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {passwordErrors.currentPassword && (
                                <p className="text-red-600 text-xs mt-1">
                                    {passwordErrors.currentPassword}
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-2"
                                htmlFor="newPassword"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={
                                        showPasswords.newPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className={`w-full px-4 py-3 pr-10 border ${
                                        passwordErrors.newPassword
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition`}
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility("newPassword")
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPasswords.newPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {passwordErrors.newPassword && (
                                <p className="text-red-600 text-xs mt-1">
                                    {passwordErrors.newPassword}
                                </p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">
                                Password must be at least 6 characters long
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                className="block text-gray-600 text-sm font-medium mb-2"
                                htmlFor="confirmPassword"
                            >
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={
                                        showPasswords.confirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    className={`w-full px-4 py-3 pr-10 border ${
                                        passwordErrors.confirmPassword
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition`}
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "confirmPassword"
                                        )
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPasswords.confirmPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            {passwordErrors.confirmPassword && (
                                <p className="text-red-600 text-xs mt-1">
                                    {passwordErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-300 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={changingPassword}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center cursor-pointer ${
                                changingPassword
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {changingPassword ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Changing...
                                </>
                            ) : (
                                <>
                                    <Lock size={16} className="mr-2" />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
