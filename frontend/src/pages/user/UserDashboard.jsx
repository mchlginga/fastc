import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { generateCertificate } from "../../services/authService";
import Button from "../../components/Button";

export default function UserDashboard() {
    const { user, handleLogout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateCert = async (certificateName) => {
        setLoading(true);
        setError("");

        try {
            const pdfBlob = await generateCertificate(certificateName); 
            const url = window.URL.createObjectURL(new Blob([pdfBlob])); 
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${user.name}-${certificateName || "certificate"}.pdf`);
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
                <h2 className="text-xl font-semibold">Certificates</h2>
                {error && <p className="text-red-500">{error}</p>}

                {user?.certificates?.length > 0 ? (
                    <ul className="mt-2">
                        {user.certificates.map( (cert, index) => (
                            <li key={index} className="border p-2 mb-2">
                                <p>Course: {cert.name}</p>
                                <p>Issued: {new Date(cert.expiresAt).toLocaleDateString()}</p>
                                {cert.expiresAt && (
                                    <p>Expires: {new Date(cert.expiresAt).toLocaleDateString()}</p>
                                )}
                                <Button
                                    onClick={() => handleGenerateCert(cert.name)}
                                    disabled={loading}
                                    className="mt-2"
                                >
                                    {loading ? "Generating..." : "Download Certificate"}
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No certificates available.</p>
                )}
            </div>

            <Button onClick={handleLogout} className="mt-4">
                Logout
            </Button>
        </div>
    );
};