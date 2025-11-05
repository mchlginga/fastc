import { X } from "react-feather";

function ProfilePictureModal({ isOpen, onClose, profilePicUrl, imageError }) {
    if (!isOpen) return null;

    const displayUrl = profilePicUrl && !imageError ? profilePicUrl : null;

    return (
        <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 cursor-pointer"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                {displayUrl ? (
                    <img
                        src={displayUrl} // ✅ DIRECT CLOUDINARY URL
                        alt="Admin Profile"
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onError={(e) => {
                            // Fallback if image fails to load
                            console.warn(
                                "Failed to load profile picture:",
                                displayUrl
                            );
                        }}
                    />
                ) : (
                    <div className="text-white text-lg">
                        No profile picture available
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                    <X size={32} />
                </button>
            </div>
        </div>
    );
}

export default ProfilePictureModal;
