import { useState, useEffect } from "react";
import {
    Calendar,
    Download,
    Clock,
    Award,
    Book,
    FileText,
} from "react-feather";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    getCertificates,
    downloadCertificate,
} from "../../services/authService";

function UserCertificates() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);
                const data = await getCertificates(user._id);
                setCertificates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCertificates();
        }
    }, [user]);

    const handleDownload = async (certificateId, title) => {
        try {
            console.log(`Downloading certificate: ${certificateId}, ${title}`);
            const blob = await downloadCertificate(certificateId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `FAST-C_Certificate_${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(`Download error: ${err.message}`);
            setError("Failed to download certificate.");
        }
    };

    if (loading) {
        return (
            <div className="text-gray-600 text-center text-sm">Loading...</div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center text-sm">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Warning Message */}
            {user?.profileStatus === "pending" && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                    <p className="text-sm">
                        Your profile is under review. You cannot enroll in
                        courses until approved.
                        <Link
                            to="/user/settings"
                            className="text-blue-600 hover:text-blue-800 font-medium ml-2"
                        >
                            Edit Profile
                        </Link>
                    </p>
                </div>
            )}

            {/* Welcome */}
            <section className="mb-10">
                <div className="flex items-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Certificates
                    </h2>
                    <FileText size={26} className="text-blue-600 ml-3" />
                </div>
                <p className="text-gray-600 text-lg">
                    View and download all your earned certificates
                </p>
            </section>

            {/* Certificates */}
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div
                            key={cert.certificateId}
                            className="bg-white rounded-lg shadow-md p-6 stat-card duration-300 hover:-translate-y-1 hover:shadow-lg transition transform"
                        >
                            <div className="relative">
                                <img
                                    src={cert.image}
                                    alt={cert.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div
                                    className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
                                        cert.status === "expired"
                                            ? "bg-red-600"
                                            : "bg-blue-600"
                                    }`}
                                >
                                    {cert.status === "expired"
                                        ? "Expired"
                                        : "Verified"}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                    {cert.title}
                                </h3>
                                <div className="flex items-center mb-2">
                                    <Calendar
                                        size={16}
                                        className="text-gray-400 mr-2"
                                    />
                                    <span className="text-gray-600 text-sm">
                                        Completed:{" "}
                                        {new Date(
                                            cert.completionDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center mb-4">
                                    <Calendar
                                        size={16}
                                        className="text-gray-400 mr-2"
                                    />
                                    <span className="text-gray-600 text-sm">
                                        Expires:{" "}
                                        {new Date(
                                            cert.expirationDate
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Clock
                                            size={16}
                                            className="text-gray-400 mr-2"
                                        />
                                        <span className="text-gray-600 text-sm">
                                            {cert.duration || "N/A"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                cert.certificateId,
                                                cert.title
                                            )
                                        }
                                        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center cursor-pointer"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {certificates.length === 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 stat-card transition-all duration-300 flex items-center justify-center">
                            <div className="text-center">
                                <Award
                                    size={24}
                                    className="mx-auto text-gray-400 mb-2"
                                />
                                <p className="text-gray-600 text-sm mb-4">
                                    Complete more courses to earn certificates
                                </p>
                                <Link
                                    to="/user/courses"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default UserCertificates;
