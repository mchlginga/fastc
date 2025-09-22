import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Award,
    CheckCircle,
    XCircle,
    RefreshCw,
    Download,
    Eye,
} from "react-feather";

const Certificates = () => {
    const [activeTab, setActiveTab] = useState("active");
    const [certificateTitle, setCertificateTitle] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [certificateFile, setCertificateFile] = useState(null);

    const handleFileChange = (e) => {
        setCertificateFile(e.target.files[0]);
    };

    const handleUpload = () => {
        // Add upload logic here (e.g., API call)
        console.log("Uploading:", {
            certificateTitle,
            expiryDate,
            certificateFile,
        });
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Certificates
                </h1>
                <p className="text-gray-600">
                    Manage your credentials and upload external certificates
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-4">
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "active" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("active")}
                    >
                        Active
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "expired" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("expired")}
                    >
                        Expired
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "upload" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("upload")}
                    >
                        Upload
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className={activeTab === "active" ? "" : "hidden"} id="active">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Certificate 1 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    Welding NC II
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Certificate ID: FASTC-WLD-2023-001
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Issued: June 15, 2023
                                </p>
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Valid until June 15, 2025
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to="#"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Download size={16} className="mr-1" />
                                        Download PDF
                                    </Link>
                                    <Link
                                        to="#"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View Online
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Certificate 2 */}
                    <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    Dressmaking NC II
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Certificate ID: FASTC-DRS-2023-002
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Issued: March 10, 2023
                                </p>
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <CheckCircle size={16} className="mr-1" />
                                    Valid until March 10, 2025
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to="#"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Download size={16} className="mr-1" />
                                        Download PDF
                                    </Link>
                                    <Link
                                        to="#"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View Online
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "expired" ? "" : "hidden"}
                id="expired"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Expired Certificate 1 */}
                    <div className="bg-gray-100 rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex items-start">
                            <div className="bg-gray-200 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-600">
                                    Computer Systems Servicing NC II
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Certificate ID: FASTC-CSS-2021-001
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Issued: January 15, 2021
                                </p>
                                <p className="text-sm text-red-600 mt-1 flex items-center">
                                    <XCircle size={16} className="mr-1" />
                                    Expired: January 15, 2023
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to="/user/courses"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <RefreshCw size={16} className="mr-1" />
                                        Renew Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Expired Certificate 2 */}
                    <div className="bg-gray-100 rounded-xl shadow-sm p-6 card-hover transition">
                        <div className="flex items-start">
                            <div className="bg-gray-200 p-3 rounded-lg mr-4">
                                <Award size={24} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-600">
                                    Electrical Installation NC I
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Certificate ID: FASTC-ELE-2020-003
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Issued: April 20, 2020
                                </p>
                                <p className="text-sm text-red-600 mt-1 flex items-center">
                                    <XCircle size={16} className="mr-1" />
                                    Expired: April 20, 2022
                                </p>
                                <div className="mt-3 flex space-x-2">
                                    <Link
                                        to="/user/courses"
                                        className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                    >
                                        <RefreshCw size={16} className="mr-1" />
                                        Renew Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={activeTab === "upload" ? "" : "hidden"} id="upload">
                <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Upload External Certificate
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certificate Title
                            </label>
                            <input
                                type="text"
                                value={certificateTitle}
                                onChange={(e) =>
                                    setCertificateTitle(e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., TESDA NC II"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Expiry Date (if applicable)
                            </label>
                            <input
                                type="date"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Certificate File (PDF/Image)
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.png"
                                onChange={handleFileChange}
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleUpload}
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Upload Certificate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificates;
