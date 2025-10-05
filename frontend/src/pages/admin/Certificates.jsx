import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Download, XCircle, Mail } from "react-feather";
import axios from "axios";

const AdminCertificates = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        user: "",
        course: "",
        title: "",
        completionDate: "",
        expirationDate: "",
    });

    // 🔹 Fetch certificates (mock + future API)
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                // const res = await axios.get("/api/certificates");
                // setCertificates(res.data);

                // Sample data (mocked)
                setCertificates([
                    {
                        _id: "1",
                        certificateUrl: "/uploads/sample_certificate_1.pdf",
                        title: "Welding NC II Certificate",
                        user: { name: "Juan Dela Cruz" },
                        course: { title: "Welding NC II" },
                        completionDate: "2023-06-15",
                        expirationDate: "2025-06-15",
                        status: "active",
                    },
                    {
                        _id: "2",
                        certificateUrl: "/uploads/sample_certificate_2.pdf",
                        title: "Dressmaking NC II Certificate",
                        user: { name: "Ana Gomez" },
                        course: { title: "Dressmaking NC II" },
                        completionDate: "2023-03-10",
                        expirationDate: "2025-03-10",
                        status: "active",
                    },
                    {
                        _id: "3",
                        certificateUrl: "/uploads/sample_certificate_3.pdf",
                        title: "Computer Systems Servicing NC II",
                        user: { name: "Pedro Reyes" },
                        course: { title: "Computer Systems Servicing NC II" },
                        completionDate: "2021-01-15",
                        expirationDate: "2023-01-15",
                        status: "expired",
                    },
                ]);
            } catch (err) {
                console.error("Failed to fetch certificates:", err);
            }
        };

        fetchCertificates();
    }, []);

    // 🔹 Handle input change for form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Handle create/generate certificate
    const handleGenerateCertificate = async (e) => {
        e.preventDefault();
        try {
            // const res = await axios.post("/api/certificates", formData);
            // setCertificates([...certificates, res.data]);

            // Mock append sample
            const newCert = {
                _id: Date.now().toString(),
                certificateUrl: "/uploads/sample_generated.pdf",
                title: formData.title || "New Certificate",
                user: { name: formData.user },
                course: { title: formData.course },
                completionDate: formData.completionDate,
                expirationDate: formData.expirationDate,
                status: "active",
            };
            setCertificates([...certificates, newCert]);

            setFormData({
                user: "",
                course: "",
                title: "",
                completionDate: "",
                expirationDate: "",
            });
            alert("✅ Certificate generated successfully!");
        } catch (err) {
            console.error("Failed to generate certificate:", err);
        }
    };

    const expiredCertificates = certificates.filter(
        (c) => c.status === "expired"
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Certificates Management
                </h1>
                <p className="text-gray-600">
                    Manage issued certificates and generate new ones
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    {["all", "generate", "expired"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                                activeTab === tab ? "tab-active" : ""
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "all"
                                ? "All Certificates"
                                : tab === "generate"
                                ? "Generate Certificate"
                                : "Expired Certificates"}
                        </button>
                    ))}
                </nav>
            </div>

            {/* All Certificates */}
            {activeTab === "all" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        All Certificates
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left">
                                        Certificate Title
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Trainee
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Course
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Completion
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Expiration
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificates.map((cert) => (
                                    <tr
                                        key={cert._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            {cert.title}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.user?.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.course?.title}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.completionDate}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.expirationDate}
                                        </td>
                                        <td
                                            className={`py-3 px-4 font-medium ${
                                                cert.status === "expired"
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {cert.status === "expired"
                                                ? "Expired"
                                                : "Valid"}
                                        </td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <Link
                                                to={cert.certificateUrl}
                                                className="text-blue-600 hover:text-blue-500"
                                                target="_blank"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <a
                                                href={cert.certificateUrl}
                                                download
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                <Download size={16} />
                                            </a>
                                            <button className="text-red-600 hover:text-red-500">
                                                <XCircle size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Generate Certificate */}
            {activeTab === "generate" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Generate Certificate
                    </h2>
                    <form
                        onSubmit={handleGenerateCertificate}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Trainee Name
                            </label>
                            <input
                                type="text"
                                name="user"
                                value={formData.user}
                                onChange={handleInputChange}
                                placeholder="e.g. Juan Dela Cruz"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course
                            </label>
                            <input
                                type="text"
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                placeholder="e.g. Welding NC II"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certificate Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g. Welding NC II Certificate"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Completion Date
                                </label>
                                <input
                                    type="date"
                                    name="completionDate"
                                    value={formData.completionDate}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Expiration Date
                                </label>
                                <input
                                    type="date"
                                    name="expirationDate"
                                    value={formData.expirationDate}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Generate & Issue
                        </button>
                    </form>
                </div>
            )}

            {/* Expired Certificates */}
            {activeTab === "expired" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Expired Certificates
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left">
                                        Trainee
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Course
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Expiration
                                    </th>
                                    <th className="py-3 px-4 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {expiredCertificates.map((cert) => (
                                    <tr
                                        key={cert._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-4">
                                            {cert.user?.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.course?.title}
                                        </td>
                                        <td className="py-3 px-4">
                                            {cert.expirationDate}
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link
                                                to="#"
                                                className="text-blue-600 hover:text-blue-500 flex items-center"
                                            >
                                                <Mail
                                                    size={16}
                                                    className="mr-1"
                                                />
                                                Notify Trainee
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCertificates;
