import { Users } from "react-feather";
import UserTableRow from "./UserTableRow";

const UserTable = ({
    users,
    selectedUsers,
    selectAll,
    onSelectAll,
    onSelectUser,
    onViewUser,
    onEditUser,
    onStatusUpdate,
    onDeleteUser,
    statusFilter,
    setStatusFilter,
    stats,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-full">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    {[...Array(7)].map((_, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left"
                                        >
                                            <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Table Container */}
            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                {/* Checkbox */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={onSelectAll}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                                    />
                                </th>

                                {/* User Info */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[200px]">
                                    User
                                </th>

                                {/* Regular Columns */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[100px]">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[120px]">
                                    Contact
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[100px]">
                                    Joined
                                </th>

                                {/* Actions */}
                                <th className="px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left min-w-[100px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <UserTableRow
                                    key={user._id}
                                    user={user}
                                    isSelected={selectedUsers.has(user._id)}
                                    onSelect={() => onSelectUser(user._id)}
                                    onView={() => onViewUser(user)}
                                    onEdit={() => onEditUser(user)}
                                    onStatusUpdate={onStatusUpdate}
                                    onDelete={() => onDeleteUser(user)}
                                    rowIndex={index}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <div className="py-12 text-center border-t border-gray-100">
                            <Users
                                size={48}
                                className="mx-auto mb-4 text-gray-400"
                            />
                            <p className="text-gray-500 mb-2">No users found</p>
                            <p className="text-sm text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserTable;
