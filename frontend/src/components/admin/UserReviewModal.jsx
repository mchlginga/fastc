import { useState, useEffect } from "react";
import {
    X,
    CheckCircle,
    XCircle,
    Download,
    Edit2,
    Save,
    XCircle as CancelIcon,
} from "react-feather";
import {
    updateCertificate,
    addSkillFromCertificate,
    getUserById,
} from "../../services/userService";

const UserReviewModal = ({
    user: initialUser,
    isOpen,
    onClose,
    handleReviewSubmit,
    onRefresh,
}) => {
    if (!isOpen || !initialUser) return null;

    const [user, setUser] = useState(initialUser);
    // State for editing certificates
    const [editingCertIndex, setEditingCertIndex] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        issuer: "",
        date: "",
        expiration: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const handleEditStart = (index) => {
        const cert = user.certificates[index];
        setEditForm({
            name: cert.name || "",
            issuer: cert.issuer || "",
            date: cert.date ? cert.date.split("T")[0] : "",
            expiration: cert.expiration ? cert.expiration.split("T")[0] : "",
        });
        setEditingCertIndex(index);
    };

    const handleEditChange = (field) => (e) => {
        setEditForm({ ...editForm, [field]: e.target.value });
    };

    const handleEditSave = async () => {
        setLoading(true);
        setError("");
        try {
            await updateCertificate(user._id, editingCertIndex, editForm);

            // Fetch fresh user data to update modal immediately (preserves proof etc.)
            const freshUser = await getUserById(user._id);
            setUser(freshUser); // Update local user state

            alert("Certificate updated successfully!");
            setEditingCertIndex(null);
            onRefresh?.(); // Still refresh parent list
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update certificate."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditCancel = () => {
        setEditingCertIndex(null);
        setEditForm({ name: "", issuer: "", date: "", expiration: "" });
    };

    const handleAddSkill = async (certIndex) => {
        setLoading(true);
        setError("");
        try {
            const result = await addSkillFromCertificate(user._id, certIndex);

            // Optionally fetch fresh user after adding skill
            const freshUser = await getUserById(user._id);
            setUser(freshUser);

            alert(result.message || `Skill added from certificate!`);
            onRefresh?.();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add skill.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const API_BASE_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const getFileUrl = (filePath) => {
        if (!filePath) return null;

        const cleanPath = filePath.startsWith("/")
            ? filePath.slice(1)
            : filePath;
        return `${API_BASE_URL}/${cleanPath}`;
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50"
            onClick={onClose}
        >
            <div
                className="relative top-10 mx-auto p-6 border border-gray-200 w-full max-w-4xl shadow-xl rounded-md bg-white max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Review Profile: {user.firstName} {user.surname}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Education Section */}
                <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Education
                    </h4>
                    {user.education && user.education.length > 0 ? (
                        <div className="space-y-4">
                            {user.education.map((edu, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Level:
                                            </p>
                                            <p className="text-gray-900">
                                                {edu.educationLevel || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                School:
                                            </p>
                                            <p className="text-gray-900">
                                                {edu.schoolName || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Year:
                                            </p>
                                            <p className="text-gray-900">
                                                {edu.yearGraduated || "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                Proof:
                                            </p>
                                            {edu.proof ? (
                                                <a
                                                    href={getFileUrl(edu.proof)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    View Proof{" "}
                                                    <Download
                                                        className="ml-1"
                                                        size={16}
                                                    />
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">
                                                    No proof uploaded
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">
                            No education information provided.
                        </p>
                    )}
                </div>

                {/* Certificates Section */}
                <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Certificates
                    </h4>
                    {user.certificates && user.certificates.length > 0 ? (
                        <div className="space-y-4">
                            {user.certificates.map((cert, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                >
                                    {editingCertIndex === index ? (
                                        // Edit Mode
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={handleEditChange(
                                                        "name"
                                                    )}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Issuer
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.issuer}
                                                    onChange={handleEditChange(
                                                        "issuer"
                                                    )}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Issue Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={editForm.date}
                                                        onChange={handleEditChange(
                                                            "date"
                                                        )}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Expiration Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={
                                                            editForm.expiration
                                                        }
                                                        onChange={handleEditChange(
                                                            "expiration"
                                                        )}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleEditSave}
                                                    disabled={loading}
                                                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    <Save
                                                        className="mr-1"
                                                        size={16}
                                                    />
                                                    {loading
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="flex items-center px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                                                >
                                                    <CancelIcon
                                                        className="mr-1"
                                                        size={16}
                                                    />{" "}
                                                    Cancel
                                                </button>
                                            </div>
                                            {error && (
                                                <p className="text-red-600 text-sm">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        // View Mode
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Name:
                                                </p>
                                                <p className="text-gray-900">
                                                    {cert.name || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Issuer:
                                                </p>
                                                <p className="text-gray-900">
                                                    {cert.issuer || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Issue Date:
                                                </p>
                                                <p className="text-gray-900">
                                                    {cert.date
                                                        ? new Date(
                                                              cert.date
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Expiration:
                                                </p>
                                                <p className="text-gray-900">
                                                    {cert.expiration
                                                        ? new Date(
                                                              cert.expiration
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Proof:
                                                </p>
                                                {cert.proof ? (
                                                    <a
                                                        href={getFileUrl(
                                                            cert.proof
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                    >
                                                        View Proof{" "}
                                                        <Download
                                                            className="ml-1"
                                                            size={16}
                                                        />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        No proof uploaded
                                                    </span>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 flex space-x-2 mt-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditStart(index)
                                                    }
                                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit2
                                                        size={16}
                                                        className="mr-1"
                                                    />{" "}
                                                    Edit Details
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleAddSkill(index)
                                                    }
                                                    disabled={loading}
                                                    className="flex items-center text-green-600 hover:text-green-800 disabled:opacity-50"
                                                >
                                                    {loading
                                                        ? "Adding..."
                                                        : "Add Skill"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">
                            No certificates provided.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={() => {
                            handleReviewSubmit("rejected");
                            onClose();
                        }}
                        className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                    >
                        <XCircle className="mr-2" size={20} /> Reject Profile
                    </button>
                    <button
                        onClick={() => {
                            handleReviewSubmit("approved");
                            onClose();
                        }}
                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                    >
                        <CheckCircle className="mr-2" size={20} /> Approve
                        Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReviewModal;
