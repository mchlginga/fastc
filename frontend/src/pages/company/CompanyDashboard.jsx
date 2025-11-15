import { useState, useEffect, useCallback } from "react";
import {
    getJobMatches,
    getMatchingStats,
    logCsvExport,
} from "../../services/matchService";
import { useAuth } from "../../context/AuthContext";

// Components
import {
    JobMatchingStats,
    JobMatchingFilters,
    TraineeGrid,
} from "../../components/admin/job-matching";

// Common Components
import {
    LoadingState,
    ErrorState,
    ToastNotification,
} from "../../components/common";

// Skeleton Component
import AdminJobMatchingSkeleton from "../../components/admin/job-matching/AdminJobMatchingSkeleton";

// Company Components
import CompanyProfileAlert from "../../components/company/CompanyProfileAlert";

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [trainees, setTrainees] = useState([]);
    const [filteredTrainees, setFilteredTrainees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        skills: [],
        certifications: [],
        availability: [],
        issuer: [],
        category: [],
    });
    const [filterOptions, setFilterOptions] = useState({
        skills: [],
        certifications: [],
        categories: [],
        issuer: [],
        availability: ["Full-time", "Part-time"],
    });
    const [skillSearch, setSkillSearch] = useState("");
    const [certSearch, setCertSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [sortBy, setSortBy] = useState("matchScoreDesc");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        certifications: true,
        issuer: true,
        availability: true,
        category: true,
    });
    const [exporting, setExporting] = useState(false);
    const [stats, setStats] = useState({
        totalTrainees: 0,
        traineesWithCertificates: 0,
        fullTimeTrainees: 0,
        partTimeTrainees: 0,
        topSkills: [],
    });
    const [toastNotification, setToastNotification] = useState(null);

    // Access control
    const hasAccess =
        user && (user.role === "company" || user.role === "superAdmin");
    const isPendingCompany =
        user?.role === "company" && user?.profileStatus === "pending";

    // Memoized filter application (same as Admin)
    const applyFilters = useCallback((traineesList, currentFilters) => {
        if (!traineesList.length) return [];

        return traineesList.filter((trainee) => {
            // Skills filter
            if (currentFilters.skills.length > 0) {
                const traineeSkills =
                    trainee.match.factors?.skillDetails?.map((s) => s.name) ||
                    [];
                const hasMatchingSkill = currentFilters.skills.some(
                    (filterSkill) =>
                        traineeSkills.some((traineeSkill) =>
                            traineeSkill
                                .toLowerCase()
                                .includes(filterSkill.toLowerCase())
                        )
                );
                if (!hasMatchingSkill) return false;
            }

            // Certifications filter
            if (currentFilters.certifications.length > 0) {
                const traineeCerts =
                    trainee.certificates?.map((c) => c.title) || [];
                const hasMatchingCert = currentFilters.certifications.some(
                    (filterCert) =>
                        traineeCerts.some((traineeCert) =>
                            traineeCert
                                .toLowerCase()
                                .includes(filterCert.toLowerCase())
                        )
                );
                if (!hasMatchingCert) return false;
            }

            // Availability filter
            if (currentFilters.availability.length > 0) {
                if (
                    !currentFilters.availability.includes(trainee.availability)
                ) {
                    return false;
                }
            }

            // Issuer filter
            if (currentFilters.issuer.length > 0) {
                const traineeIssuers =
                    trainee.certificates?.map((c) => c.issuedBy) || [];
                const hasMatchingIssuer = currentFilters.issuer.some((issuer) =>
                    traineeIssuers.includes(issuer)
                );
                if (!hasMatchingIssuer) return false;
            }

            // Category filter
            if (currentFilters.category.length > 0) {
                if (!currentFilters.category.includes(trainee.match.category)) {
                    return false;
                }
            }

            return true;
        });
    }, []);

    // Memoized sorting (same as Admin)
    const sortTrainees = useCallback((traineesList, sortMethod) => {
        const sorted = [...traineesList];
        switch (sortMethod) {
            case "matchScoreDesc":
                return sorted.sort((a, b) => b.match.score - a.match.score);
            case "matchScoreAsc":
                return sorted.sort((a, b) => a.match.score - b.match.score);
            case "nameAsc":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "nameDesc":
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sorted;
        }
    }, []);

    useEffect(() => {
        const fetchTraineesAndData = async () => {
            if (!hasAccess) return;

            setLoading(true);
            try {
                const params = {};
                if (filters.skills.length > 0)
                    params.skills = filters.skills.join(",");
                if (filters.certifications.length > 0)
                    params.certifications = filters.certifications.join(",");
                if (filters.availability.length > 0)
                    params.availability = filters.availability.join(",");
                if (filters.issuer.length > 0)
                    params.issuer = filters.issuer.join(",");
                if (filters.category.length > 0)
                    params.category = filters.category.join(",");

                const data = await getJobMatches(params);
                const sortedTrainees = sortTrainees(data.trainees, sortBy);

                setTrainees(sortedTrainees);
                setFilteredTrainees(sortedTrainees);

                if (data.filterOptions) {
                    setFilterOptions(data.filterOptions);
                }
            } catch (err) {
                console.error("Failed to fetch trainees:", err);
                setError(err.message || "Failed to load job matching data");
            } finally {
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const data = await getMatchingStats();
                setStats(data.stats);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        };

        fetchTraineesAndData();
        fetchStats();
    }, [user, filters, sortBy, hasAccess, sortTrainees]);

    // Apply filters locally when possible (same as Admin)
    useEffect(() => {
        if (trainees.length > 0) {
            const filtered = applyFilters(trainees, filters);
            const sorted = sortTrainees(filtered, sortBy);
            setFilteredTrainees(sorted);
        }
    }, [trainees, filters, sortBy, applyFilters, sortTrainees]);

    const handleFilterChange = useCallback((category, value) => {
        setFilters((prev) => {
            const currentValues = prev[category];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { ...prev, [category]: newValues };
        });
    }, []);

    const handleRemoveFilter = useCallback((category, value) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].filter((v) => v !== value),
        }));
    }, []);

    const toggleSection = useCallback((section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            skills: [],
            certifications: [],
            issuer: [],
            availability: [],
            category: [],
        });
        setSkillSearch("");
        setCertSearch("");
        setCategorySearch("");
    }, []);

    const exportToCSV = async () => {
        // Block CSV export for pending companies
        if (isPendingCompany) {
            setToastNotification({
                message:
                    "CSV export is disabled while your profile is under review",
                type: "warning",
            });
            return;
        }

        try {
            setExporting(true);

            const headers = [
                "Name",
                "Email",
                "Phone",
                "Skills",
                "Certifications",
                "Availability",
                "Match Score",
                "Match Level",
                "Recommended Category",
                "Total Certificates",
                "Profile Status",
            ];

            const rows = filteredTrainees.map((trainee) => [
                trainee.name,
                trainee.email,
                trainee.contactNumber || "N/A",
                trainee.match.factors?.skillDetails
                    ?.map((s) => s.name)
                    .join(", ") || "None",
                trainee.certificates
                    ?.map((c) => `${c.title} (${c.issuedBy})`)
                    .join(", ") || "None",
                trainee.availability || "N/A",
                `${trainee.match.score}%`,
                trainee.match.matchLevel,
                trainee.match.category,
                trainee.certificates?.length || 0,
                trainee.profileStatus || "N/A",
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
            ].join("\n");

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `potential_candidates_${
                new Date().toISOString().split("T")[0]
            }.csv`;
            link.click();

            await logCsvExport({
                exportType: "job-matching",
                recordsCount: filteredTrainees.length,
                filters: filters,
                matchCriteria: {
                    sortBy,
                    hasFilters,
                },
            });

            setToastNotification({
                message: `Exported ${filteredTrainees.length} candidates successfully`,
                type: "success",
            });
        } catch (error) {
            console.error("Failed to export CSV:", error);
            setToastNotification({
                message: "Failed to export CSV. Please try again.",
                type: "error",
            });
        } finally {
            setExporting(false);
        }
    };

    const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

    // Show role-specific header
    const getHeaderTitle = () => {
        if (user?.role === "superAdmin") {
            return "Company Talent Pool - Admin View";
        }
        return "Talent Discovery";
    };

    const getHeaderDescription = () => {
        if (user?.role === "superAdmin") {
            return "Manage and explore the talent pool as a system administrator";
        }
        if (isPendingCompany) {
            return "Explore potential matches while your profile is under review (limited access)";
        }
        return "Find qualified trainees that match your company's needs using AI-powered matching";
    };

    if (loading) {
        return <AdminJobMatchingSkeleton />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Access Restricted
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You need Company or Super Admin privileges to access
                            this dashboard.
                        </p>
                        <p className="text-sm text-gray-500">
                            Current role: {user?.role || "Not authenticated"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/60 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Company Profile Alert */}
                <CompanyProfileAlert user={user} />

                {/* Header - Dynamic based on role */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                {getHeaderTitle()}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {getHeaderDescription()}
                            </p>
                        </div>
                        {user?.role === "superAdmin" && (
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Admin Mode
                            </div>
                        )}
                        {isPendingCompany && (
                            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                Pending Approval
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <JobMatchingStats stats={stats} loading={loading} />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Panel */}
                    <div className="w-full lg:w-80 shrink-0">
                        <JobMatchingFilters
                            filters={filters}
                            filterOptions={filterOptions}
                            expandedSections={expandedSections}
                            isFilterOpen={isFilterOpen}
                            hasFilters={hasFilters}
                            onFilterChange={handleFilterChange}
                            onToggleSection={toggleSection}
                            onClearFilters={clearFilters}
                            onSkillSearch={setSkillSearch}
                            onCertSearch={setCertSearch}
                            onCategorySearch={setCategorySearch}
                            onToggleFilterOpen={setIsFilterOpen}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <TraineeGrid
                            trainees={filteredTrainees}
                            exporting={exporting}
                            hasFilters={hasFilters}
                            onExport={exportToCSV}
                            onClearFilters={clearFilters}
                            filters={filters}
                            onRemoveFilter={handleRemoveFilter}
                            isPendingCompany={isPendingCompany}
                        />
                    </div>
                </div>

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
};

export default CompanyDashboard;
