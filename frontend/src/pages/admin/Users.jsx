import { useState } from "react";
import { Link } from "react-router-dom";
import {
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    PauseCircle,
} from "react-feather";

const Users = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectRemarks, setRejectRemarks] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const handleReject = (user) => {
        setSelectedUser(user);
        setRejectModalOpen(true);
    };

    const handleSubmitReject = () => {
        console.log(
            "Rejecting verification for:",
            selectedUser,
            "Remarks:",
            rejectRemarks
        );
        // Add API call to reject verification
        setRejectModalOpen(false);
        setRejectRemarks("");
        setSelectedUser(null);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    Users Management
                </h1>
                <p className="text-gray-600">
                    Manage trainees, companies, admins, and verification
                    requests
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
                        All Users
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "trainees" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("trainees")}
                    >
                        Trainees
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "companies" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("companies")}
                    >
                        Companies
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "admins" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("admins")}
                    >
                        Admins/Staff
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 ${
                            activeTab === "verifications" ? "tab-active" : ""
                        }`}
                        onClick={() => setActiveTab("verifications")}
                    >
                        Verification Requests
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className={activeTab === "all" ? "" : "hidden"} id="all">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            All Users
                        </h2>
                        <Link
                            to="#add-user"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add User
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Role
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Registered
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Juan Dela Cruz
                                    </td>
                                    <td className="py-3 px-4">
                                        juan@example.com
                                    </td>
                                    <td className="py-3 px-4">Trainee</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Verified
                                    </td>
                                    <td className="py-3 px-4">2023-01-10</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">ABC Corp</td>
                                    <td className="py-3 px-4">
                                        contact@abccorp.com
                                    </td>
                                    <td className="py-3 px-4">Company</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Approved
                                    </td>
                                    <td className="py-3 px-4">2023-02-15</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Maria Santos</td>
                                    <td className="py-3 px-4">
                                        maria@fastc.org
                                    </td>
                                    <td className="py-3 px-4">Admin</td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4">2022-11-05</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "trainees" ? "" : "hidden"}
                id="trainees"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Trainees
                        </h2>
                        <Link
                            to="#add-trainee"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add Trainee
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Registered
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        Juan Dela Cruz
                                    </td>
                                    <td className="py-3 px-4">
                                        juan@example.com
                                    </td>
                                    <td className="py-3 px-4 text-green-600">
                                        Verified
                                    </td>
                                    <td className="py-3 px-4">2023-01-10</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Ana Gomez</td>
                                    <td className="py-3 px-4">
                                        ana@example.com
                                    </td>
                                    <td className="py-3 px-4 text-yellow-600">
                                        Pending Verification
                                    </td>
                                    <td className="py-3 px-4">2023-03-20</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "companies" ? "" : "hidden"}
                id="companies"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Companies
                        </h2>
                        <Link
                            to="#add-company"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add Company
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Company Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Contact Email
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Registered
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">ABC Corp</td>
                                    <td className="py-3 px-4">
                                        contact@abccorp.com
                                    </td>
                                    <td className="py-3 px-4 text-green-600">
                                        Approved
                                    </td>
                                    <td className="py-3 px-4">2023-02-15</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-yellow-600 hover:text-yellow-500"
                                        >
                                            <PauseCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">
                                        XYZ Industries
                                    </td>
                                    <td className="py-3 px-4">
                                        info@xyzindustries.com
                                    </td>
                                    <td className="py-3 px-4 text-yellow-600">
                                        Pending Approval
                                    </td>
                                    <td className="py-3 px-4">2023-04-01</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-yellow-600 hover:text-yellow-500"
                                        >
                                            <PauseCircle size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className={activeTab === "admins" ? "" : "hidden"} id="admins">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Admins/Staff
                        </h2>
                        <Link
                            to="#add-admin"
                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                        >
                            <PlusCircle size={16} className="mr-1" />
                            Add Admin
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Registered
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Maria Santos</td>
                                    <td className="py-3 px-4">
                                        maria@fastc.org
                                    </td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4">2022-11-05</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Carlos Lim</td>
                                    <td className="py-3 px-4">
                                        carlos@fastc.org
                                    </td>
                                    <td className="py-3 px-4 text-green-600">
                                        Active
                                    </td>
                                    <td className="py-3 px-4">2022-12-01</td>
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
                                            <Edit size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div
                className={activeTab === "verifications" ? "" : "hidden"}
                id="verifications"
            >
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Verification Requests
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Email
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Submitted Documents
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Submitted
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Ana Gomez</td>
                                    <td className="py-3 px-4">
                                        ana@example.com
                                    </td>
                                    <td className="py-3 px-4">
                                        High School Diploma, ID
                                    </td>
                                    <td className="py-3 px-4">2023-03-20</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleReject({
                                                    name: "Ana Gomez",
                                                    email: "ana@example.com",
                                                })
                                            }
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-100">
                                    <td className="py-3 px-4">Pedro Reyes</td>
                                    <td className="py-3 px-4">
                                        pedro@example.com
                                    </td>
                                    <td className="py-3 px-4">
                                        TESDA Certificate, Transcript
                                    </td>
                                    <td className="py-3 px-4">2023-04-05</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <Link
                                            to="#"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-green-600 hover:text-green-500"
                                        >
                                            <CheckCircle size={16} />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleReject({
                                                    name: "Pedro Reyes",
                                                    email: "pedro@example.com",
                                                })
                                            }
                                            className="text-red-600 hover:text-red-500"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Reject Modal */}
                {rejectModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Reject Verification
                            </h3>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter rejection remarks"
                                value={rejectRemarks}
                                onChange={(e) =>
                                    setRejectRemarks(e.target.value)
                                }
                            />
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={handleSubmitReject}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={() => setRejectModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
