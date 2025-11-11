import { Clock, User, Book } from "react-feather";
import AttendanceTableRow from "./AttendanceTableRow";

const AttendanceTable = ({
    records,
    onManualVerification,
    statusFilter,
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
                                    {[...Array(6)].map((_, index) => (
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
                                        {[...Array(6)].map((_, cellIndex) => (
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
                                {/* Trainee Info */}
                                <th className="pl-6 pr-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[200px]">
                                    Trainee
                                </th>

                                {/* Regular Columns */}
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[150px]">
                                    Course & Lesson
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[120px]">
                                    Clock-in Time
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[100px]">
                                    Status
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[120px]">
                                    Verification Method
                                </th>

                                {/* Actions */}
                                <th className="pr-6 pl-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left min-w-[100px]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-100">
                            {records.map((record, index) => (
                                <AttendanceTableRow
                                    key={record._id}
                                    record={record}
                                    onManualVerification={onManualVerification}
                                    rowIndex={index}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {records.length === 0 && (
                        <div className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <Clock
                                    size={48}
                                    className="text-gray-300 mb-4"
                                />
                                <p className="text-gray-500 font-medium mb-1">
                                    No attendance records found
                                </p>
                                <p className="text-sm text-gray-400 max-w-sm">
                                    {statusFilter !== "all"
                                        ? "Try adjusting your filters to find what you're looking for"
                                        : "No attendance records available yet"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;
