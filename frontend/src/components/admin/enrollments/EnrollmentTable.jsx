import { Users } from "react-feather";
import EnrollmentTableRow from "./EnrollmentTableRow";

const EnrollmentTable = ({
    enrollments,
    selectedEnrollments,
    selectAll,
    onSelectAll,
    onSelectEnrollment,
    onViewEnrollment,
    onEditEnrollment,
    onStatusUpdate,
    onDeleteEnrollment,
    statusFilter,
    courseFilter,
    userFilter,
    searchTerm,
    stats,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-full">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {[...Array(8)].map((_, index) => (
                                        <th
                                            key={index}
                                            className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left"
                                        >
                                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {[...Array(8)].map((_, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="border-b border-gray-100"
                                    >
                                        {[...Array(8)].map((_, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="px-6 py-4 whitespace-nowrap"
                                            >
                                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
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
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {/* Checkbox */}
                                <th className="pl-6 pr-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={onSelectAll}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500 focus:ring-2 focus:ring-offset-1"
                                    />
                                </th>

                                {/* User Info */}
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[180px]">
                                    User
                                </th>

                                {/* Course Info */}
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[200px]">
                                    Course
                                </th>

                                {/* Regular Columns */}
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[100px]">
                                    Status
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[100px]">
                                    Progress
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[120px]">
                                    Enrolled Date
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[120px]">
                                    Access Until
                                </th>

                                {/* Actions */}
                                <th className="pr-6 pl-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[100px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {enrollments.map((enrollment, index) => (
                                <EnrollmentTableRow
                                    key={enrollment._id}
                                    enrollment={enrollment}
                                    isSelected={selectedEnrollments.has(
                                        enrollment._id
                                    )}
                                    onSelect={() =>
                                        onSelectEnrollment(enrollment._id)
                                    }
                                    onView={() => onViewEnrollment(enrollment)}
                                    onEdit={() => onEditEnrollment(enrollment)}
                                    onStatusUpdate={onStatusUpdate}
                                    onDelete={() =>
                                        onDeleteEnrollment(enrollment)
                                    }
                                    rowIndex={index}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {enrollments.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <Users
                                    size={48}
                                    className="text-gray-300 mb-4"
                                />
                                <p className="text-gray-500 font-medium mb-1">
                                    No enrollments found
                                </p>
                                <p className="text-sm text-gray-400 max-w-sm">
                                    {statusFilter !== "all" ||
                                    courseFilter !== "all" ||
                                    userFilter !== "all" ||
                                    searchTerm
                                        ? "Try adjusting your search criteria or filters to find what you're looking for"
                                        : "No enrollments found in the system yet"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnrollmentTable;
