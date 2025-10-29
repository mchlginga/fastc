import { useState, useEffect } from "react";
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

function AdminUsers() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);

    // Filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [roleFilter, setRoleFilter] = useState(
        searchParams.get("role") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

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
    const [deleteLoading, setDeleteLoading] = useState(false); // NEW: Loading state for delete

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (roleFilter !== "all") params.set("role", roleFilter);
        setSearchParams(params);
    }, [statusFilter, roleFilter, setSearchParams]);

    // Filter users when search or filters change
    useEffect(() => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.firstName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.surname
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.companyName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (user) => user.profileStatus === statusFilter
            );
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, statusFilter, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminUserService.getUsers({
                search: searchTerm,
                status: statusFilter !== "all" ? statusFilter : "",
                role: roleFilter !== "all" ? roleFilter : "",
                page: 1,
                limit: 50,
            });
            setUsers(response.users);
        } catch (err) {
            setError(err.message || "Failed to load users");
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

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
            await adminUserService.bulkUpdateUserStatus(
                Array.from(selectedUsers),
                newStatus
            );

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
            setToastNotification({
                message: err.message || "Failed to update users",
                type: "error",
            });
        }
    };

    // UPDATED: Handle delete user with proper modal closing
    const handleDeleteUser = async (userId) => {
        try {
            await adminUserService.deleteUser(userId);
            setUsers((prev) => prev.filter((user) => user._id !== userId));
            setToastNotification({
                message: "User deleted successfully",
                type: "success",
            });
            return true; // Return success
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete user",
                type: "error",
            });
            throw err;
        }
    };

    // UPDATED: Handle bulk delete with proper modal closing
    const handleBulkDelete = async () => {
        try {
            const deletePromises = Array.from(selectedUsers).map((userId) =>
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
            return true; // Return success
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to delete users",
                type: "error",
            });
            throw err;
        }
    };

    // UPDATED: Handle delete confirmation with loading state
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
                // Close modal only on success
                setShowDeleteModal(false);
                setUserToDelete(null);
                setBulkDelete(false);
            }
        } catch (error) {
            // Error is already handled in the delete functions, just keep modal open
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

    // Handle user added with toast notification
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
            const allIds = new Set(filteredUsers.map((user) => user._id));
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
        setSelectAll(newSelected.size === filteredUsers.length);
    };

    const getStats = () => {
        const total = users.length;
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

    if (loading) {
        return <AdminUsersSkeleton />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchUsers} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-3">
                        <Users size={28} className="text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Management
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage system users, review profiles, and handle
                        approvals
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <UserStats stats={stats} />
                </div>

                {/* Unified Container for Filters and Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Filters Section */}
                    <div className="p-6 border-b border-gray-100 bg-white">
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
                        />
                    </div>

                    {/* Table Section */}
                    <div>
                        <UserTable
                            users={filteredUsers}
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
                        />
                    </div>
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

                {/* UPDATED: ConfirmationModal with proper loading and onConfirm */}
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

export default AdminUsers;
