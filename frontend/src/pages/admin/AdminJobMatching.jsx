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

const AdminJobMatching = () => {
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

    // Memoized filter application
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

    // Memoized sorting
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
            if (!user || !["superAdmin", "admin"].includes(user.role)) return;

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
    }, [user, filters, sortBy, sortTrainees]);

    // Apply filters locally when possible (for better performance)
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
                trainee.skills?.join(", ") || "None",
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
            link.download = `trainees_export_${
                new Date().toISOString().split("T")[0]
            }.csv`;
            link.click();

            await logCsvExport({
                exportType: "job-matching",
                recordsCount: filteredTrainees.length,
                filters: filters,
                matchCriteria: {
                    sortBy,
                    hasFilters: hasFilters,
                },
            });

            setToastNotification({
                message: `Exported ${filteredTrainees.length} trainees successfully`,
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

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AI Job Matching
                    </h1>
                    <p className="text-gray-600">
                        Smart matching of trainees to vocational roles using AI
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6">
                    <JobMatchingStats stats={stats} />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Panel */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <JobMatchingFilters
                            filters={filters}
                            filterOptions={filterOptions}
                            expandedSections={expandedSections}
                            isFilterOpen={isFilterOpen}
                            skillSearch={skillSearch}
                            certSearch={certSearch}
                            categorySearch={categorySearch}
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
                            sortBy={sortBy}
                            exporting={exporting}
                            hasFilters={hasFilters}
                            onSortChange={setSortBy}
                            onExport={exportToCSV}
                            onClearFilters={clearFilters}
                            filters={filters}
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

export default AdminJobMatching;
