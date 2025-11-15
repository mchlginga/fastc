import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, Calendar, Users, CheckCircle } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { adminAttendanceService } from "../../services/attendanceService";

import {
    AttendanceStats,
    AttendanceFilters,
    AttendanceTable,
    AttendanceDetailsModal,
} from "../../components/admin/attendance";

import {
    LoadingState,
    ErrorState,
    ToastNotification,
} from "../../components/common";

import AdminAttendanceSkeleton from "../../components/admin/attendance/AdminAttendanceSkeleton";

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

function AdminAttendance() {
    const { user: adminUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastNotification, setToastNotification] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        verified: 0,
        pending: 0,
        failed: 0,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(activeSearchTerm, 500);
    const [dateFilter, setDateFilter] = useState(
        searchParams.get("date") || "all"
    );
    const [courseFilter, setCourseFilter] = useState(
        searchParams.get("course") || "all"
    );
    const [statusFilter, setStatusFilter] = useState(
        searchParams.get("status") || "all"
    );
    const [showFilters, setShowFilters] = useState(false);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        recordsPerPage: 10,
    });

    const fetchAttendanceRecords = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminAttendanceService.getAttendanceRecords({
                search: debouncedSearchTerm || "",
                date: dateFilter !== "all" ? dateFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                status: statusFilter !== "all" ? statusFilter : "",
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                page: pagination.currentPage,
                limit: pagination.recordsPerPage,
            });

            setAttendanceRecords(response.records);
            setPagination((prev) => ({
                ...prev,
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                totalRecords: response.pagination.totalRecords,
            }));
        } catch (err) {
            console.error("Error fetching attendance records:", err);
            setError(err.message || "Failed to load attendance records");
        } finally {
            setLoading(false);
        }
    }, [
        debouncedSearchTerm,
        dateFilter,
        courseFilter,
        statusFilter,
        startDate,
        endDate,
        pagination.currentPage,
        pagination.recordsPerPage,
    ]);

    const fetchAttendanceStats = useCallback(async () => {
        try {
            const response = await adminAttendanceService.getAttendanceStats();
            setStats(response.stats);
        } catch (err) {
            console.error("Error fetching attendance stats:", err);
        }
    }, []);

    const handleSearch = useCallback(() => {
        setActiveSearchTerm(searchTerm);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, [searchTerm]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");
        setActiveSearchTerm("");
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, []);

    const handleRefresh = async () => {
        await fetchAttendanceRecords();
        await fetchAttendanceStats();
    };

    useEffect(() => {
        fetchAttendanceRecords();
        fetchAttendanceStats();
    }, [fetchAttendanceRecords, fetchAttendanceStats]);

    useEffect(() => {
        if (pagination.currentPage !== 1) {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }
    }, [
        debouncedSearchTerm,
        dateFilter,
        courseFilter,
        statusFilter,
        startDate,
        endDate,
    ]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (dateFilter !== "all") params.set("date", dateFilter);
        if (courseFilter !== "all") params.set("course", courseFilter);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (pagination.currentPage > 1)
            params.set("page", pagination.currentPage);
        setSearchParams(params);
    }, [
        dateFilter,
        courseFilter,
        statusFilter,
        pagination.currentPage,
        setSearchParams,
    ]);

    const handleViewDetails = async (recordId) => {
        try {
            const response =
                await adminAttendanceService.getAttendanceRecordById(recordId);
            setSelectedRecord(response.record);
            setShowDetailsModal(true);
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to load record details",
                type: "error",
            });
        }
    };

    const handleManualVerification = async (recordId) => {
        try {
            await adminAttendanceService.verifyAttendance(recordId);

            setAttendanceRecords((prev) =>
                prev.map((record) =>
                    record._id === recordId
                        ? { ...record, status: "verified" }
                        : record
                )
            );

            fetchAttendanceStats();

            setToastNotification({
                message: "Attendance manually verified",
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to verify attendance",
                type: "error",
            });
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await adminAttendanceService.exportAttendance({
                search: debouncedSearchTerm,
                date: dateFilter !== "all" ? dateFilter : "",
                course: courseFilter !== "all" ? courseFilter : "",
                status: statusFilter !== "all" ? statusFilter : "",
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });

            const blob = new Blob([response.data], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `attendance-${
                new Date().toISOString().split("T")[0]
            }.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setToastNotification({
                message: "Preparing your download...",
                type: "success",
            });
        } catch (err) {
            setToastNotification({
                message: err.message || "Failed to export attendance data",
                type: "error",
            });
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRecordsPerPageChange = (newPerPage) => {
        setPagination((prev) => ({
            ...prev,
            recordsPerPage: newPerPage,
            currentPage: 1,
        }));
    };

    if (loading && attendanceRecords.length === 0) {
        return <AdminAttendanceSkeleton />;
    }

    if (error && attendanceRecords.length === 0) {
        return <ErrorState message={error} onRetry={fetchAttendanceRecords} />;
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Attendance Management
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Monitor and manage trainee attendance records
                                via facial recognition
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <AttendanceStats
                        stats={stats}
                        loading={loading && attendanceRecords.length > 0}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <AttendanceFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onSearch={handleSearch}
                            onClearSearch={handleClearSearch}
                            dateFilter={dateFilter}
                            setDateFilter={setDateFilter}
                            courseFilter={courseFilter}
                            setCourseFilter={setCourseFilter}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            showFilters={showFilters}
                            setShowFilters={setShowFilters}
                            onExportCSV={handleExportCSV}
                            stats={stats}
                            onRefresh={handleRefresh}
                            loading={loading && attendanceRecords.length > 0}
                        />
                    </div>

                    <div>
                        <AttendanceTable
                            records={attendanceRecords}
                            onManualVerification={handleManualVerification}
                            onViewDetails={handleViewDetails}
                            statusFilter={statusFilter}
                            stats={stats}
                            loading={loading && attendanceRecords.length > 0}
                        />
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                onRecordsPerPageChange={
                                    handleRecordsPerPageChange
                                }
                                loading={
                                    loading && attendanceRecords.length > 0
                                }
                            />
                        </div>
                    )}
                </div>

                {showDetailsModal && (
                    <AttendanceDetailsModal
                        record={selectedRecord}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedRecord(null);
                        }}
                        onManualVerify={handleManualVerification}
                    />
                )}

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

const Pagination = ({
    pagination,
    onPageChange,
    onRecordsPerPageChange,
    loading = false,
}) => {
    const { currentPage, totalPages, totalRecords, recordsPerPage } =
        pagination;

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
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                    value={recordsPerPage}
                    onChange={(e) =>
                        onRecordsPerPageChange(Number(e.target.value))
                    }
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                    disabled={loading}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">records per page</span>
            </div>

            <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * recordsPerPage + 1} to{" "}
                {Math.min(currentPage * recordsPerPage, totalRecords)} of{" "}
                {totalRecords} records
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    «
                </button>

                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ‹
                </button>

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

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ›
                </button>

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

export default AdminAttendance;
