import { useState, useEffect } from "react";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    reviewProfile,
} from "../../services/userService";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Home,
    Eye,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    RefreshCw,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Briefcase,
    ChevronRight,
    ChevronLeft,
} from "react-feather";
import UserViewModal from "../../components/admin/UserViewModal";
import UserEditModal from "../../components/admin/UserEditModal";
import UserDeleteModal from "../../components/admin/UserDeleteModal";
import UserReviewModal from "../../components/admin/UserReviewModal";

const AdminUsers = () => {
    // datas states
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filter tsaka search states
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    // form states (edit modal)
    const [editFormData, setEditFormData] = useState({
        username: "",
        firstName: "",
        surname: "",
    });

    // statistics states
    const [stats, setStats] = useState({
        total: 0,
        trainees: 0,
        companies: 0,
        admins: 0,
        pendingApprovals: 0,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFiltersAndSearch();
    }, [users, searchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        calculateStats();
    }, [users]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load users");
            console.error("Fetch users error:", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = () => {
        // TODO: Implement statistics calculation
        const total = users.length;
        const trainees = users.filter((u) => u.role === "user").length;
        const companies = users.filter((u) => u.role === "company").length;
        const admins = users.filter((u) => u.role === "admin").length;
        const pendingApprovals = users.filter(
            (u) => u.profileStatus === "pending"
        ).length;

        setStats({ total, trainees, companies, admins, pendingApprovals });
    };

    const applyFiltersAndSearch = () => {
        let result = [...users];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (user) =>
                    `${user.firstName} ${user.surname}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (user.username &&
                        user.username
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply role filter
        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter);
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter(
                (user) => user.profileStatus === statusFilter
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case "name":
                    aValue = `${a.firstName} ${a.surname}`;
                    bValue = `${b.firstName} ${b.surname}`;
                    break;
                case "role":
                    aValue = a.role;
                    bValue = b.role;
                    break;
                case "status":
                    aValue = a.profileStatus;
                    bValue = b.profileStatus;
                    break;
                default:
                    aValue = `${a.firstName} ${a.surname}`;
                    bValue = `${b.firstName} ${b.surname}`;
            }
            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        setFilteredUsers(result);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getCurrentPageUsers = () => {
        const indexOfLastUser = currentPage * itemsPerPage;
        const indexOfFirstUser = indexOfLastUser - itemsPerPage;
        return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    };

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleViewUser = async (user) => {
        try {
            const fullUser = await getUserById(user._id);
            setSelectedUser(fullUser);
            setIsViewModalOpen(true);
        } catch (err) {
            console.error("View user error:", err);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditFormData({
            username: user.username || "",
            firstName: user.firstName || "",
            surname: user.surname || "",
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(selectedUser._id, editFormData);
            await fetchUsers();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Edit user error:", err);
        }
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUser(selectedUser._id);
            await fetchUsers();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error("Delete user error:", err);
        }
    };

    const handleReviewClick = (user) => {
        setSelectedUser(user);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = async (status) => {
        try {
            await reviewProfile(selectedUser._id, status);
            await fetchUsers();
            setIsReviewModalOpen(false);
        } catch (err) {
            console.error("Review profile error:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-red-50 p-8 rounded-2xl">
                    <AlertCircle
                        className="mx-auto text-red-600 mb-4"
                        size={48}
                    />
                    <h2 className="text-xl font-semibold text-red-900 mb-2">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                {/* welcome */}
                <section className="mb-10">
                    <div className="flex items-center mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">
                            User Management
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Manage trainees, companies, and administrators
                    </p>
                </section>

                {/* statistics cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {/* TODO: Implement statistics cards */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-gray-500 text-sm mb-1">
                            Total Users
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.total}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-gray-500 text-sm mb-1">Trainees</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.trainees}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-gray-500 text-sm mb-1">Companies</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.companies}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-gray-500 text-sm mb-1">Admins</p>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.admins}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <p className="text-gray-500 text-sm mb-1">
                            Pending Approvals
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                            {stats.pendingApprovals}
                        </p>
                    </div>
                    {/* More stat cards... */}
                </section>

                {/* filter and search */}
                <section className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Search by name, username, or email..."
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <div className="relative">
                                <Filter
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <select
                                    value={roleFilter}
                                    onChange={handleRoleFilterChange}
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="user">Trainee</option>
                                    <option value="company">Company</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <div className="relative">
                                <Filter
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* users table */}
                <section className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("name")}
                                    >
                                        User{" "}
                                        {sortBy === "name" &&
                                            (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("role")}
                                    >
                                        Role{" "}
                                        {sortBy === "role" &&
                                            (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status{" "}
                                        {sortBy === "status" &&
                                            (sortOrder === "asc" ? "↑" : "↓")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentPageUsers().length > 0 ? (
                                    getCurrentPageUsers().map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-dashed border-gray-400" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName}{" "}
                                                            {user.surname}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.profileStatus ===
                                                    "approved" && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Approved
                                                    </span>
                                                )}
                                                {user.profileStatus ===
                                                    "pending" && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                )}
                                                {user.profileStatus ===
                                                    "rejected" && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        handleViewUser(user)
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3 cursor-pointer"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEditUser(user)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                {user.profileStatus ===
                                                    "pending" && (
                                                    <button
                                                        onClick={() =>
                                                            handleReviewClick(
                                                                user
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900 mr-3 cursor-pointer"
                                                        title="Review"
                                                    >
                                                        <CheckCircle
                                                            size={16}
                                                        />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(user)
                                                    }
                                                    className="text-red-600 hover:text-red-900 cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            No users found matching the filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* pagination */}
                <section className="flex justify-center mb-8">
                    {filteredUsers.length > 0 && totalPages > 1 && (
                        <nav className="flex items-center space-x-1">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === 1
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
                                }`}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-4 py-2 rounded-md ${
                                        currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-md ${
                                    currentPage === totalPages
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 cursor-pointer"
                                }`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </nav>
                    )}
                    {filteredUsers.length > 0 && (
                        <p className="ml-4 text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredUsers.length
                            )}{" "}
                            of {filteredUsers.length} results
                        </p>
                    )}
                </section>

                {/* modals */}
                <UserViewModal
                    user={selectedUser}
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                />
                <UserEditModal
                    user={selectedUser}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    editFormData={editFormData}
                    setEditFormData={setEditFormData}
                    handleEditSubmit={handleEditSubmit}
                />
                <UserDeleteModal
                    user={selectedUser}
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    handleDeleteConfirm={handleDeleteConfirm}
                />
                <UserReviewModal
                    user={selectedUser}
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    handleReviewSubmit={handleReviewSubmit}
                    onRefresh={fetchUsers} // Pass refresh
                />
            </div>
        </div>
    );
};

export default AdminUsers;
