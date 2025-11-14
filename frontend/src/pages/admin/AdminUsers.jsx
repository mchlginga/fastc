import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Users } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminUserService } from "../../services/userService";

// Components
import {
    UserStats,
    UserFilters,
    UserTable,
} from "../../components/admin/users";

import {
    AddUserModal,
    EditUserModal,
    UserDetailModal,
} from "../../components/admin/users/modals";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
    ConfirmationModal,
} from "../../components/common";

// Skeleton Component
import AdminUsersSkeleton from "../../components/admin/users/AdminUsersSkeleton";

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

function AdminUsers() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [roleFilter, setRoleFilter] = useState(
        searchParams.get("role") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        usersPerPage: 10,
    });

    // Selected users for bulk actions
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Modals
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [bulkDelete, setBulkDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch users with optimized dependencies
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminUserService.getUsers({
                search: debouncedSearchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                role: roleFilter !== "all" ? roleFilter : "",
                page: pagination.currentPage,
                limit: pagination.usersPerPage,
            });

            setUsers(response.users);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                totalUsers: response.pagination.totalUsers,
            }));
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchTerm,
        statusFilter,
        roleFilter,
        pagination.currentPage,
        pagination.usersPerPage,
    ]);

    const handleRefresh = async () => {
        await fetchUsers();
    };

    // Initial fetch and when filters change
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset to page 1 when filters change
    useEffect(() => {
        if (pagination.currentPage !== 1) {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }
    }, [debouncedSearchTerm, statusFilter, roleFilter]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (roleFilter !== "all") params.set("role", roleFilter);
        if (pagination.currentPage > 1)
            params.set("page", pagination.currentPage);
        setSearchParams(params);
    }, [statusFilter, roleFilter, pagination.currentPage, setSearchParams]);

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await adminUserService.updateUserStatus(userId, newStatus);

            setUsers((prev) =>
                prev.map((user) =>
                    user._id === userId
                        ? { ...user, profileStatus: newStatus }
                        : user
                )
            );

            setToastNotification({
                message: `User status updated to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to update user status",
                type: "error",
            });
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            const userIds = Array.from(selectedUsers).filter(
                (id) => id && id.length > 0
            );

            if (userIds.length === 0) {
                setToastNotification({
                    message: "No valid users selected",
                    type: "error",
                });
                return;
            }

            await adminUserService.bulkUpdateUserStatus(userIds, newStatus);

            setUsers((prev) =>
                prev.map((user) =>
                    selectedUsers.has(user._id)
                        ? { ...user, profileStatus: newStatus }
                        : user
                )
            );

            setSelectedUsers(new Set());
            setSelectAll(false);

            setToastNotification({
                message: `Updated ${selectedUsers.size} users to ${newStatus}`,
                type: "success",
            });
        } catch (err) {
            console.error("Bulk status update error:", err);
            setToastNotification({
                message: err.message || "Failed to update users",
                type: "error",
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await adminUserService.deleteUser(userId);
            setUsers((prev) => prev.filter((user) => user._id !== userId));
            setToastNotification({
                message: "User deleted successfully",
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete user",
                type: "error",
            });
            throw err;
        }
    };

    const handleBulkDelete = async () => {
        try {
            const userIds = Array.from(selectedUsers).filter(
                (id) => id && id.length > 0
            );

            if (userIds.length === 0) {
                setToastNotification({
                    message: "No valid users selected",
                    type: "error",
                });
                return false;
            }

            const deletePromises = userIds.map((userId) =>
                adminUserService.deleteUser(userId)
            );

            await Promise.all(deletePromises);
            setUsers((prev) =>
                prev.filter((user) => !selectedUsers.has(user._id))
            );
            setSelectedUsers(new Set());
            setSelectAll(false);

            setToastNotification({
                message: `Deleted ${selectedUsers.size} users successfully`,
                type: "success",
            });
            return true;
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete users",
                type: "error",
            });
            throw err;
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            let success;
            if (bulkDelete) {
                success = await handleBulkDelete();
            } else {
                success = await handleDeleteUser(userToDelete._id);
            }

            if (success) {
                setShowDeleteModal(false);
                setUserToDelete(null);
                setBulkDelete(false);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditUserModal(true);
    };

    const handleUserUpdated = () => {
        fetchUsers();
        setToastNotification({
            message: "User updated successfully",
            type: "success",
        });
    };

    const handleUserAdded = () => {
        fetchUsers();
        setToastNotification({
            message: "User created successfully",
            type: "success",
        });
    };

    const confirmDeleteUser = (user) => {
        setUserToDelete(user);
        setBulkDelete(false);
        setShowDeleteModal(true);
    };

    const confirmBulkDelete = () => {
        if (selectedUsers.size === 0) return;
        setUserToDelete(null);
        setBulkDelete(true);
        setShowDeleteModal(true);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            const allIds = new Set(users.map((user) => user._id));
            setSelectedUsers(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectUser = (userId) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
        setSelectAll(newSelected.size === users.length);
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        setSelectedUsers(new Set());
        setSelectAll(false);

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleUsersPerPageChange = (newPerPage) => {
        setPagination((prev) => ({
            ...prev,
            usersPerPage: newPerPage,
            currentPage: 1,
        }));
        setSelectedUsers(new Set());
        setSelectAll(false);
    };

    const getStats = () => {
        const total = pagination.totalUsers;
        const pending = users.filter(
            (u) => u.profileStatus === "pending"
        ).length;
        const approved = users.filter(
            (u) => u.profileStatus === "approved"
        ).length;
        const rejected = users.filter(
            (u) => u.profileStatus === "rejected"
        ).length;
        const trainees = users.filter((u) => u.role === "user").length;
        const companies = users.filter((u) => u.role === "company").length;
        const admins = users.filter(
            (u) => u.role === "admin" || u.role === "superAdmin"
        ).length;

        return {
            total,
            pending,
            approved,
            rejected,
            trainees,
            companies,
            admins,
        };
    };

    const stats = getStats();

    if (loading && users.length === 0) {
        return <AdminUsersSkeleton />;
    }

    if (error && users.length === 0) {
        return <ErrorState message={error} onRetry={fetchUsers} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                User Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Manage system users, review profiles, and handle
                                approvals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <UserStats
                        stats={stats}
                        loading={loading && users.length > 0}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100">
                        <UserFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            roleFilter={roleFilter}
                            setRoleFilter={setRoleFilter}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            selectedUsers={selectedUsers}
                            onAddUser={() => setShowAddUserModal(true)}
                            onBulkStatusUpdate={handleBulkStatusUpdate}
                            onBulkDelete={confirmBulkDelete}
                            stats={stats}
                            onRefresh={handleRefresh}
                            loading={loading && users.length > 0}
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <UserTable
                            users={users}
                            selectedUsers={selectedUsers}
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                            onSelectUser={handleSelectUser}
                            onViewUser={(user) => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                            }}
                            onEditUser={handleEditUser}
                            onStatusUpdate={handleStatusUpdate}
                            onDeleteUser={confirmDeleteUser}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            stats={stats}
                            loading={loading && users.length > 0}
                        />
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onUsersPerPageChange={handleUsersPerPageChange}
                                loading={loading && users.length > 0}
                            />
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AddUserModal
                    isOpen={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    onUserAdded={handleUserAdded}
                />

                <EditUserModal
                    isOpen={showEditUserModal}
                    onClose={() => {
                        setShowEditUserModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    onUserUpdated={handleUserUpdated}
                />

                <UserDetailModal
                    isOpen={showUserModal}
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    onStatusUpdate={handleStatusUpdate}
                    onEdit={handleEditUser}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        if (!deleteLoading) {
                            setShowDeleteModal(false);
                            setUserToDelete(null);
                            setBulkDelete(false);
                        }
                    }}
                    onConfirm={handleDeleteConfirm}
                    title={
                        bulkDelete
                            ? `Delete ${selectedUsers.size} Users?`
                            : "Delete User?"
                    }
                    message={
                        bulkDelete
                            ? `Are you sure you want to delete ${selectedUsers.size} users? This action cannot be undone.`
                            : `Are you sure you want to delete ${
                                  userToDelete?.role === "company"
                                      ? userToDelete?.companyName
                                      : `${userToDelete?.firstName} ${userToDelete?.surname}`
                              }? This action cannot be undone.`
                    }
                    confirmText={
                        bulkDelete
                            ? `Delete ${selectedUsers.size} Users`
                            : "Delete User"
                    }
                    type="danger"
                    isLoading={deleteLoading}
                />

                {/* Toast Notifications */}
                {toastNotification && (
                    <ToastNotification
                        message={toastNotification.message}
                        type={toastNotification.type}
                        onClose={() => setToastNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}

// Pagination Component
const Pagination = ({
    pagination,
    onPageChange,
    onUsersPerPageChange,
    loading = false,
}) => {
    const { currentPage, totalPages, totalUsers, usersPerPage } = pagination;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Users per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                    value={usersPerPage}
                    onChange={(e) =>
                        onUsersPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    disabled={loading}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">users per page</span>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                {Math.min(currentPage * usersPerPage, totalUsers)} of{" "}
                {totalUsers} users
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    «
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ‹
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={loading}
                        className={`px-3 py-1 text-sm font-medium border rounded transition-colors cursor-pointer ${
                            currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ›
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    »
                </button>
            </div>
        </div>
    );
};

export default AdminUsers;
