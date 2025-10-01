import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

function AdminProfileReview() {
    const { user } = useAuth();
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPendingProfiles();
    }, []);

    const fetchPendingProfiles = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/user?profileStatus=pending");
            setPendingProfiles(data);
        } catch (err) {
            setError("Failed to load pending profiles.");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status) => {
        try {
            await api.patch(`/user/${id}/review`, { profileStatus: status });
            fetchPendingProfiles(); // Refresh list
        } catch (err) {
            setError("Failed to review profile.");
        }
    };

    if (loading) return <p>Loading pending profiles...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Profile Reviews</h2>
            <div className="space-y-4">
                {pendingProfiles.map((profile) => (
                    <div
                        key={profile._id}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium">{profile.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {profile.email}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() =>
                                        handleReview(profile._id, "approved")
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() =>
                                        handleReview(profile._id, "rejected")
                                    }
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p>
                                <strong>Username:</strong>{" "}
                                {profile.username || "Not provided"}
                            </p>
                            <p>
                                <strong>Birthdate:</strong>{" "}
                                {profile.birthdate || "Not provided"}
                            </p>
                            <p>
                                <strong>Gender:</strong>{" "}
                                {profile.gender || "Not provided"}
                            </p>
                            <p>
                                <strong>Contact:</strong>{" "}
                                {profile.contactNumber || "Not provided"}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {profile.address || "Not provided"}
                            </p>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-medium mb-2">Education</h4>
                            {profile.education && profile.education.length ? (
                                <ul className="list-disc pl-5 space-y-1">
                                    {profile.education.map((edu, idx) => (
                                        <li key={idx}>
                                            {edu.schoolName} (
                                            {edu.educationLevel},{" "}
                                            {edu.yearGraduated})
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No education provided</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {pendingProfiles.length === 0 && <p>No pending profiles.</p>}
        </div>
    );
}

export default AdminProfileReview;
