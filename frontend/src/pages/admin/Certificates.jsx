import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Download, XCircle, Mail } from "react-feather";

const AdminCertificates = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [formData, setFormData] = useState({
        traineeName: "",
        course: "",
        completionDate: "",
        certificateId: "FASTC-AUTO-2023-XXX",
        expiryDate: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateCertificate = (e) => {
        e.preventDefault();
        console.log("Generating certificate:", formData);
        // Add API call to generate certificate (e.g., POST /certificates)
        setFormData({
            traineeName: "",
            course: "",
            completionDate: "",
            certificateId: "FASTC-AUTO-2023-XXX",
            expiryDate: "",
        });
    };

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
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "all" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Certificates
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "generate" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("generate")}
                    >
                        Generate Certificate
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "expired" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("expired")}
                    >
                        Expired Certificates
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className={activeTab === "all" ? "" : "hidden"} id="all">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        All Certificates
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Certificate ID
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Trainee Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Course
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Issue Date
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Expiry Date
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        FASTC-WLD-2023-001
                                    </td>
                                    <td className="py-3 px-4">
                                        Juan Dela Cruz
                                    </td>
                                    <td className="py-3 px-4">Welding NC II</td>
                                    <td className="py-3 px-4">2023-06-15</td>
                                    <td className="py-3 px-4">2025-06-15</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Valid
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Download size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        FASTC-DRS-2023-002
                                    </td>
                                    <td className="py-3 px-4">Ana Gomez</td>
                                    <td className="py-3 px-4">
                                        Dressmaking NC II
                                    </td>
                                    <td className="py-3 px-4">2023-03-10</td>
                                    <td className="py-3 px-4">2025-03-10</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Valid
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Download size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        FASTC-CSS-2021-001
                                    </td>
                                    <td className="py-3 px-4">Pedro Reyes</td>
                                    <td className="py-3 px-4">
                                        Computer Systems Servicing NC II
                                    </td>
                                    <td className="py-3 px-4">2021-01-15</td>
                                    <td className="py-3 px-4">2023-01-15</td>
                                    <td className="py-3 px-4 text-red-600">
                                        Expired
                                    </td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Download size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "generate" ? "" : "hidden"}
                id="generate"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
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
                            <select
                                name="traineeName"
                                value={formData.traineeName}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Trainee</option>
                                <option value="Juan Dela Cruz">
                                    Juan Dela Cruz
                                </option>
                                <option value="Ana Gomez">Ana Gomez</option>
                                <option value="Pedro Reyes">Pedro Reyes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Course
                            </label>
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Course</option>
                                <option value="Automotive Servicing NC II">
                                    Automotive Servicing NC II
                                </option>
                                <option value="Electrical Installation NC II">
                                    Electrical Installation NC II
                                </option>
                                <option value="Dressmaking NC II">
                                    Dressmaking NC II
                                </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Completion Date
                            </label>
                            <input
                                type="date"
                                name="completionDate"
                                value={formData.completionDate}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certificate ID
                            </label>
                            <input
                                type="text"
                                name="certificateId"
                                value={formData.certificateId}
                                disabled
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Expiry Date (optional)
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Generate & Issue
                        </button>
                    </form>
                </div>
            </div>

            <div
                className={activeTab === "expired" ? "" : "hidden"}
                id="expired"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Expired Certificates
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Trainee Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Course
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Expiry Date
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Pedro Reyes</td>
                                    <td className="py-3 px-4">
                                        Computer Systems Servicing NC II
                                    </td>
                                    <td className="py-3 px-4">2023-01-15</td>
                                    <td className="py-3 px-4 text-red-600">
                                        Needs Renewal
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Mail size={16} className="mr-1" />
                                            Notify Trainee
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Maria Lopez</td>
                                    <td className="py-3 px-4">
                                        Electrical Installation NC I
                                    </td>
                                    <td className="py-3 px-4">2022-04-20</td>
                                    <td className="py-3 px-4 text-red-600">
                                        Needs Renewal
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Mail size={16} className="mr-1" />
                                            Notify Trainee
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCertificates;
