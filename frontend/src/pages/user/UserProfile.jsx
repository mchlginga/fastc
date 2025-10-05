import { useState, useEffect, useRef } from "react";
import { Camera, Phone, Calendar, Clock, Award } from "react-feather";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    getCompletions,
    getCertificates,
    uploadProfilePic,
} from "../../services/authService";

function UserProfile() {
    const { user, setUser } = useAuth();
    const [stats, setStats] = useState({
        activeCourses: 0,
        certificates: 0,
        totalHours: 0,
    });
    const [courses, setCourses] = useState([]);
    const [recentCertificates, setRecentCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const completionsData = await getCompletions(user._id);
                const completions = completionsData.courses || [];
                const activeCourses = completions.filter(
                    (c) => c.status === "approved" && c.progress < 100
                ).length;
                const certificates = completions.filter(
                    (c) => c.progress === 100
                ).length;
                const totalHours = completions.reduce(
                    (sum, c) =>
                        sum + parseFloat(c.duration?.split(" ")[0] || 0),
                    0
                );

                const certData = await getCertificates(user._id);
                const recent = certData.slice(0, 3);

                setStats({ activeCourses, certificates, totalHours });
                setCourses(completions);
                setRecentCertificates(recent);
            } catch (err) {
                setError(err.message || "Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleProfilePicUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!allowedTypes.includes(file.type)) {
            setError("Only JPEG or PNG images are allowed.");
            return;
        }
        if (file.size > maxSize) {
            setError("Image size must be less than 5MB.");
            return;
        }

        try {
            const updatedUser = await uploadProfilePic(file);
            console.log("Updating user state with:", updatedUser);
            setUser(updatedUser);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to upload profile picture.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    if (loading) {
        return (
            <div className="text-gray-600 text-center text-sm py-10">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 text-center text-sm py-10">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-10">
            {/* warning */}
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
            <section>
                <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
                    <div className="md:flex items-center gap-10">
                        <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                            <div className="relative">
                                <img
                                    src="/pic.png"
                                    alt="Profile"
                                    className="w-36 h-36 rounded-full object-cover shadow-md ring-4 ring-blue-200 hover:scale-105 transition"
                                />
                                <button
                                    onClick={triggerFileInput}
                                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleProfilePicUpload}
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mt-4">
                                {user?.firstName || "User"}{" "}
                                {user?.surname || ""}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {user?.role || "User"}
                            </p>
                        </div>
                        <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-300 md:pl-10 pt-6 md:pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Info
                                    label="Email"
                                    value={user?.email || "N/A"}
                                />
                                <Info
                                    label="Phone"
                                    value={user?.contactNumber || "N/A"}
                                />
                                <Info
                                    label="Location"
                                    value={user?.address || "N/A"}
                                />
                                <Info
                                    label="Joined"
                                    value={
                                        user?.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "N/A"
                                    }
                                />
                            </div>
                            <Link
                                to="/user/settings"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Learning Statistics
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl">
                    {[
                        {
                            label: "Active Courses",
                            value: stats.activeCourses,
                            icon: <Clock size={24} className="text-blue-600" />,
                            color: "bg-blue-100",
                        },
                        {
                            label: "Certificates",
                            value: stats.certificates,
                            icon: (
                                <Award size={24} className="text-green-600" />
                            ),
                            color: "bg-green-100",
                        },
                        {
                            label: "Total Hours",
                            value: stats.totalHours,
                            icon: (
                                <Calendar
                                    size={24}
                                    className="text-purple-600"
                                />
                            ),
                            color: "bg-purple-100",
                        },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-md p-6 stat-card duration-300 hover:-translate-y-1 hover:shadow-lg transition transform"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`${stat.color} p-3 rounded-lg mr-4`}
                                >
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Course Progress
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        {courses
                            .filter((course) => course.status === "approved")
                            .slice(0, 4)
                            .map((course, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-800 font-medium">
                                            {course.title}
                                        </span>
                                        <span className="text-gray-600">
                                            {course.progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${course.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        {courses.filter(
                            (course) => course.status === "approved"
                        ).length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <p className="text-sm">
                                    No courses enrolled yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Recent Certificates
                    </h3>
                    <Link
                        to="/user/certificates"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {recentCertificates.slice(0, 3).map((cert, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow-md stat-card transition-all duration-300 overflow-hidden"
                        >
                            <img
                                src={cert.image}
                                alt={cert.title}
                                className="w-full h-40 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-800 mb-1">
                                    {cert.title}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    Completed:{" "}
                                    {new Date(
                                        cert.completionDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {recentCertificates.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-6 stat-card transition-all duration-300 text-center">
                            <p className="text-gray-600 text-sm">
                                Complete courses to see your certificates here.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

const Info = ({ label, value }) => (
    <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
    </div>
);

export default UserProfile;
