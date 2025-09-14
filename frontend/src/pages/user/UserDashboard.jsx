import { useState, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import { generateCertificate, getCompletions } from "../../services/authService";
import Button from "../../components/Button";

export default function UserDashboard() {
    const { user, handleLogout} = useAuth();
    const [completions, setCompletions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect( () => {
        const fetchCompletions = async () => {
            setLoading(true);

            try {
                const data = await getCompletions(user._id);
                setCompletions(data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load completions.")
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchCompletions();
    }, [user]);

    const handleGenerateCert = async (courseId, courseName) => {
        setLoading(true);
        setError("");

        try {
            const pdfBlob = await generateCertificate(courseId); 
            const url = window.URL.createObjectURL(new Blob([pdfBlob])); 
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${user.name}-${courseName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to generate certificate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
            <p className="mt-2">Your role: {user?.role}</p>

            {/* Profile Section */}
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Profile</h2>
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
                <p>Location: {user?.city}, {user?.country}</p>
            </div>

            {/* Certificate Section */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Completed Courses</h2>
                {error && <p className="text-red-500">{error}</p>}

                {loading ? (
                    <p>Loading completions...</p>
                ) : completions.length > 0 ? (
                    <ul className="mt-2">
                        {completions.map( (completion) => (
                            <li key={completion._id} className="border p-2 mb-2">
                                <p>Course: {completion.course.name}</p>
                                <p>Completed: {new Date(completion.completedAt).toLocaleDateString()}</p>

                                <Button
                                    onClick={() => handleGenerateCert(completion.course._id, completion.course.name)}
                                    disabled={loading}
                                    className="mt-2"
                                >
                                    {loading ? "Generating..." : "Download Certificate"}
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses completed.</p>
                )}
            </div>

            <Button onClick={handleLogout} className="mt-4">
                Logout
            </Button>
        </div>
    );
};