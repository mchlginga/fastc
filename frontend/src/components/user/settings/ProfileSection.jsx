import { useState } from "react";
import { Save, Edit, Upload, Trash2, User } from "react-feather";
import {
    updateUserProfile,
    uploadProfilePic,
    removeProfilePic,
} from "../../../services/userService";
import ConfirmationModal from "../../common/ConfirmationModal";

const ProfileSection = ({
    profileData,
    user,
    errors,
    loading,
    uploadingProfilePic,
    onProfileDataChange,
    onErrorsChange,
    onUploadingProfilePicChange,
    onToastNotification,
    onUserUpdate,
    isFiltered = false,
}) => {
    const [saving, setSaving] = useState(false);
    const [showRemoveProfilePicModal, setShowRemoveProfilePicModal] =
        useState(false);
    const [removingProfilePic, setRemovingProfilePic] = useState(false);

    // Format date for display
    const formatDisplayDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Format date for input (YYYY-MM-DD)
    const formatInputDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        return date.toISOString().split("T")[0];
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        onProfileDataChange((prev) => ({ ...prev, [id]: value }));
        onErrorsChange((prev) => ({ ...prev, [id]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!profileData.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!profileData.surname.trim())
            newErrors.surname = "Last name is required";
        if (
            profileData.contactNumber &&
            !/^\+?[\d\s-()]+$/.test(profileData.contactNumber)
        ) {
            newErrors.contactNumber = "Please enter a valid phone number";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            onErrorsChange(validationErrors);
            return;
        }

        setSaving(true);
        try {
            const response = await updateUserProfile({
                firstName: profileData.firstName.trim(),
                surname: profileData.surname.trim(),
                birthdate: profileData.birthdate,
                gender: profileData.gender,
                contactNumber: profileData.contactNumber,
                address: profileData.address,
            });

            // FIX: Check if response has user property (from backend) or is the user object directly
            const updatedUser = response.user || response;

            onUserUpdate(updatedUser);
            onToastNotification({
                message: "Profile updated successfully!",
                type: "success",
            });
        } catch (error) {
            onToastNotification({
                message: error.message || "Failed to update profile.",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            onToastNotification({
                message: "Only JPEG, PNG, or WebP images are allowed.",
                type: "error",
            });
            return;
        }

        if (file.size > maxSize) {
            onToastNotification({
                message: "Image size must be less than 5MB.",
                type: "error",
            });
            return;
        }

        try {
            onUploadingProfilePicChange(true);
            const formData = new FormData();
            formData.append("profilePic", file);
            const response = await uploadProfilePic(formData);

            if (response.success) {
                onUserUpdate((prevUser) => ({ ...prevUser, ...response.user }));
                onToastNotification({
                    message: "Profile picture updated successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            onToastNotification({
                message: error.message || "Failed to upload profile picture.",
                type: "error",
            });
        } finally {
            onUploadingProfilePicChange(false);
        }
    };

    const handleRemoveProfilePic = async () => {
        if (!user?.profilePic) {
            onToastNotification({
                message: "No profile picture to remove.",
                type: "info",
            });
            return;
        }

        // Show confirmation modal instead of window.confirm
        setShowRemoveProfilePicModal(true);
    };

    const confirmRemoveProfilePic = async () => {
        try {
            setRemovingProfilePic(true);
            const response = await removeProfilePic();

            if (response.success) {
                onUserUpdate((prevUser) => ({ ...prevUser, ...response.user }));
                onToastNotification({
                    message: "Profile picture removed successfully!",
                    type: "success",
                });
                setShowRemoveProfilePicModal(false);
            }
        } catch (error) {
            onToastNotification({
                message: error.message || "Failed to remove profile picture.",
                type: "error",
            });
        } finally {
            setRemovingProfilePic(false);
        }
    };

    if (isFiltered) {
        return (
            <section>
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        No profile information found
                    </h3>
                    <p className="text-gray-600 text-sm">
                        No profile information matches your search criteria. Try
                        adjusting your search terms.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            {/* Remove Profile Picture Confirmation Modal */}
            <ConfirmationModal
                isOpen={showRemoveProfilePicModal}
                onClose={() => setShowRemoveProfilePicModal(false)}
                onConfirm={confirmRemoveProfilePic}
                title="Remove Profile Picture"
                message="Are you sure you want to remove your profile picture? This action cannot be undone."
                confirmText="Remove Picture"
                cancelText="Keep Picture"
                type="warning"
                isLoading={removingProfilePic}
            />

            {/* Basic Information Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Basic Information
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Update your personal details
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="firstName"
                            >
                                First Name *
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={profileData.firstName}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.firstName
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="surname"
                            >
                                Last Name *
                            </label>
                            <input
                                id="surname"
                                type="text"
                                value={profileData.surname}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.surname
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter your last name"
                            />
                            {errors.surname && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.surname}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="email"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                readOnly
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Contact support to change your email.
                            </p>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="birthdate"
                            >
                                Birthdate
                            </label>
                            <input
                                id="birthdate"
                                type="date"
                                value={formatInputDate(profileData.birthdate)}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            />
                            {profileData.birthdate && (
                                <p className="text-gray-500 text-xs mt-1">
                                    {formatDisplayDate(profileData.birthdate)}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="gender"
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                value={profileData.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="contactNumber"
                            >
                                Contact Number
                            </label>
                            <input
                                id="contactNumber"
                                type="tel"
                                value={profileData.contactNumber}
                                onChange={handleInputChange}
                                placeholder="+09212754390"
                                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.contactNumber
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-300"
                                }`}
                            />
                            {errors.contactNumber && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.contactNumber}
                                </p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-2"
                                htmlFor="address"
                            >
                                Address
                            </label>
                            <textarea
                                id="address"
                                rows="3"
                                value={profileData.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Enter your full address"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center cursor-pointer ${
                                saving ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Profile Picture Card */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Profile Picture
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Upload a clear photo of yourself (Max 5MB, JPEG/PNG/WebP
                        only)
                    </p>
                </div>

                <div className="flex items-center">
                    <div className="relative mr-6">
                        {user?.profilePic ? (
                            <img
                                src={user.profilePic}
                                alt="Profile"
                                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-200"
                                onError={(e) => {
                                    // Fallback if Cloudinary URL fails
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200">
                                <User size={24} className="text-gray-400" />
                            </div>
                        )}
                        <button
                            className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition cursor-pointer"
                            onClick={() =>
                                document
                                    .getElementById("profile-pic-upload")
                                    .click()
                            }
                        >
                            <Edit size={12} />
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center">
                            <input
                                id="profile-pic-upload"
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleProfilePicChange}
                                disabled={uploadingProfilePic}
                            />
                            {uploadingProfilePic ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={14} className="mr-2" />
                                    Upload New
                                </>
                            )}
                        </label>
                        <button
                            onClick={handleRemoveProfilePic}
                            disabled={!user?.profilePic}
                            className={`text-red-600 hover:text-red-700 font-medium flex items-center text-sm cursor-pointer ${
                                !user?.profilePic
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileSection;
