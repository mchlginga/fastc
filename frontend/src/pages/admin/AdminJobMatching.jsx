import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Filter, X, Download } from "react-feather";
import debounce from "lodash/debounce";

const AdminJobMatching = () => {
    const { user } = useAuth();
    const [trainees, setTrainees] = useState([]);
    const [filteredTrainees, setFilteredTrainees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        skills: [],
        certifications: [],
        availability: [],
        issuer: [],
    });
    const [skillSearch, setSkillSearch] = useState("");
    const [certSearch, setCertSearch] = useState("");
    const [sortBy, setSortBy] = useState("matchScoreDesc");
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter toggle
    const [expandedSections, setExpandedSections] = useState({
        skills: true,
        certifications: true,
        issuer: true,
        availability: true,
    });

    const skillsList = [
        "Dress-making",
        "Massage Therapy",
        "Beauty Care",
        "Bread and Pastry",
        "Housekeeping",
        "Lantern Making",
        "Welding",
        "Masonry",
        "Carpentry",
        "Events Management",
        "Computer Software and Services",
        "Hairdressing",
    ];

    const certificationsList = [
        "Welding I",
        "Welding II",
        "Carpentry I",
        "Carpentry II",
        "Beauty Care I",
        "Massage Therapy I",
        "Housekeeping I",
        "Masonry I",
    ];

    const issuerList = ["FAST-C"];
    const availabilityOptions = ["Full-time", "Part-time"];

    useEffect(() => {
        const fetchTrainees = async () => {
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

                const { data } = await api.get("/match/matches", { params });
                let sortedTrainees = data.trainees;
                if (sortBy === "matchScoreDesc") {
                    sortedTrainees = sortedTrainees.sort(
                        (a, b) => b.match.score - a.match.score
                    );
                } else if (sortBy === "matchScoreAsc") {
                    sortedTrainees = sortedTrainees.sort(
                        (a, b) => a.match.score - b.match.score
                    );
                }
                setTrainees(sortedTrainees);
                setFilteredTrainees(sortedTrainees);
            } catch (err) {
                console.error("Failed to fetch trainees:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user && ["superAdmin", "admin"].includes(user.role)) {
            fetchTrainees();
        }
    }, [user, filters, sortBy]);

    const handleFilterChange = (category, value) => {
        setFilters((prev) => {
            const currentValues = prev[category];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { ...prev, [category]: newValues };
        });
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const clearFilters = () => {
        setFilters({
            skills: [],
            certifications: [],
            issuer: [],
            availability: [],
        });
        setSkillSearch("");
        setCertSearch("");
    };

    const debouncedSkillSearch = debounce(
        (value) => setSkillSearch(value.toLowerCase()),
        300
    );
    const debouncedCertSearch = debounce(
        (value) => setCertSearch(value.toLowerCase()),
        300
    );

    const exportToCSV = () => {
        const headers = [
            "Name",
            "Email",
            "Skills",
            "Certifications",
            "Availability",
            "Match Score",
            "Category",
        ];
        const rows = filteredTrainees.map((trainee) => [
            trainee.name,
            trainee.email,
            trainee.skills?.join(", ") || "None",
            trainee.certificates
                ?.map((c) => `${c.name} (${c.issuer})`)
                .join(", ") || "None",
            trainee.availability || "N/A",
            `${trainee.match.score}%`,
            trainee.match.category,
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
        link.download = "trainees_export.csv";
        link.click();
    };

    const getMatchBadgeClass = (matchLevel) => {
        switch (matchLevel) {
            case "strong":
                return "bg-green-100 text-green-800 border-green-300";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "weak":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading trainees...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Welcome */}
                <section className="mb-10">
                    <div className="flex items-center mb-2">
                        <h2 className="text-3xl font-bold text-gray-800">
                            AI Job Matching
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Find and export trainees for vocational roles with smart
                        filters.
                    </p>
                </section>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Panel */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Filters
                                </h2>
                                <button
                                    className="lg:hidden text-blue-600 hover:text-blue-800 p-2 rounded-xl bg-blue-50 cursor-pointer"
                                    onClick={() =>
                                        setIsFilterOpen(!isFilterOpen)
                                    }
                                    aria-label="Toggle filter panel"
                                >
                                    <Filter size={24} />
                                </button>
                            </div>

                            {/* Mobile Filter Modal */}
                            <div
                                className={`lg:block ${
                                    isFilterOpen ? "block" : "hidden"
                                } lg:static fixed inset-0 bg-white z-50 p-6 overflow-y-auto`}
                            >
                                <div className="lg:hidden flex justify-between items-center mb-4 sticky top-0 bg-white py-2 mt-10">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Filters
                                    </h2>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="text-gray-600 hover:text-gray-800 p-2 rounded-xl cursor-pointer bg-gray-100"
                                        aria-label="Close filter panel"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Clear Filters */}
                                {hasFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="w-full mb-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Clear All Filters
                                    </button>
                                )}

                                {/* Skills Filter */}
                                <div className="mb-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleSection("skills")}
                                    >
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Skills
                                        </h3>
                                        <span>
                                            {expandedSections.skills
                                                ? "−"
                                                : "+"}
                                        </span>
                                    </div>
                                    {expandedSections.skills && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                placeholder="Search skills..."
                                                onChange={(e) =>
                                                    debouncedSkillSearch(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                aria-label="Search skills"
                                            />
                                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                                {skillsList.filter((skill) =>
                                                    skill
                                                        .toLowerCase()
                                                        .includes(skillSearch)
                                                ).length === 0 ? (
                                                    <p className="text-sm text-gray-500">
                                                        No skills found
                                                    </p>
                                                ) : (
                                                    skillsList
                                                        .filter((skill) =>
                                                            skill
                                                                .toLowerCase()
                                                                .includes(
                                                                    skillSearch
                                                                )
                                                        )
                                                        .map((skill) => (
                                                            <label
                                                                key={skill}
                                                                className={`flex items-center cursor-pointer p-1 rounded ${
                                                                    filters.skills.includes(
                                                                        skill
                                                                    )
                                                                        ? "bg-blue-50"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={filters.skills.includes(
                                                                        skill
                                                                    )}
                                                                    onChange={() =>
                                                                        handleFilterChange(
                                                                            "skills",
                                                                            skill
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                    aria-label={`Select ${skill} skill`}
                                                                />
                                                                <span className="ml-2 text-sm text-gray-700">
                                                                    {skill}
                                                                </span>
                                                            </label>
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Certifications Filter */}
                                <div className="mb-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() =>
                                            toggleSection("certifications")
                                        }
                                    >
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Certifications
                                        </h3>
                                        <span>
                                            {expandedSections.certifications
                                                ? "−"
                                                : "+"}
                                        </span>
                                    </div>
                                    {expandedSections.certifications && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                placeholder="Search certifications..."
                                                onChange={(e) =>
                                                    debouncedCertSearch(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                aria-label="Search certifications"
                                            />
                                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                                {certificationsList.filter(
                                                    (cert) =>
                                                        cert
                                                            .toLowerCase()
                                                            .includes(
                                                                certSearch
                                                            )
                                                ).length === 0 ? (
                                                    <p className="text-sm text-gray-500">
                                                        No certifications found
                                                    </p>
                                                ) : (
                                                    certificationsList
                                                        .filter((cert) =>
                                                            cert
                                                                .toLowerCase()
                                                                .includes(
                                                                    certSearch
                                                                )
                                                        )
                                                        .map((cert) => (
                                                            <label
                                                                key={cert}
                                                                className={`flex items-center cursor-pointer p-1 rounded ${
                                                                    filters.certifications.includes(
                                                                        cert
                                                                    )
                                                                        ? "bg-blue-50"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={filters.certifications.includes(
                                                                        cert
                                                                    )}
                                                                    onChange={() =>
                                                                        handleFilterChange(
                                                                            "certifications",
                                                                            cert
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                    aria-label={`Select ${cert} certification`}
                                                                />
                                                                <span className="ml-2 text-sm text-gray-700">
                                                                    {cert}
                                                                </span>
                                                            </label>
                                                        ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Issuer Filter */}
                                <div className="mb-6">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleSection("issuer")}
                                    >
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Issuer
                                        </h3>
                                        <span>
                                            {expandedSections.issuer
                                                ? "−"
                                                : "+"}
                                        </span>
                                    </div>
                                    {expandedSections.issuer && (
                                        <div className="mt-3 space-y-1">
                                            {issuerList.map((issuer) => (
                                                <label
                                                    key={issuer}
                                                    className={`flex items-center cursor-pointer p-1 rounded ${
                                                        filters.issuer.includes(
                                                            issuer
                                                        )
                                                            ? "bg-blue-50"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.issuer.includes(
                                                            issuer
                                                        )}
                                                        onChange={() =>
                                                            handleFilterChange(
                                                                "issuer",
                                                                issuer
                                                            )
                                                        }
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        aria-label={`Select ${issuer} issuer`}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">
                                                        {issuer}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Availability Filter */}
                                <div>
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() =>
                                            toggleSection("availability")
                                        }
                                    >
                                        <h3 className="text-sm font-medium text-gray-700">
                                            Availability
                                        </h3>
                                        <span>
                                            {expandedSections.availability
                                                ? "−"
                                                : "+"}
                                        </span>
                                    </div>
                                    {expandedSections.availability && (
                                        <div className="mt-3 space-y-1">
                                            {availabilityOptions.map(
                                                (option) => (
                                                    <label
                                                        key={option}
                                                        className={`flex items-center cursor-pointer p-1 rounded ${
                                                            filters.availability.includes(
                                                                option
                                                            )
                                                                ? "bg-blue-50"
                                                                : ""
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.availability.includes(
                                                                option
                                                            )}
                                                            onChange={() =>
                                                                handleFilterChange(
                                                                    "availability",
                                                                    option
                                                                )
                                                            }
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            aria-label={`Select ${option} availability`}
                                                        />
                                                        <span className="ml-2 text-sm text-gray-700">
                                                            {option}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Close Filters Button (Mobile) */}
                                <div className="lg:hidden mt-6">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                                        aria-label="Close filter panel"
                                    >
                                        Close Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Active Filters */}
                        {hasFilters && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {Object.entries(filters).flatMap(
                                    ([category, values]) =>
                                        values.map((value) => (
                                            <span
                                                key={`${category}-${value}`}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {category === "skills"
                                                    ? value
                                                    : category ===
                                                      "certifications"
                                                    ? value
                                                    : category === "issuer"
                                                    ? `Issuer: ${value}`
                                                    : `Availability: ${value}`}
                                                <button
                                                    onClick={() =>
                                                        handleFilterChange(
                                                            category,
                                                            value
                                                        )
                                                    }
                                                    className="ml-2 focus:outline-none cursor-pointer"
                                                    aria-label={`Remove ${value} filter`}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))
                                )}
                            </div>
                        )}

                        {/* Results and Actions */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                <span className="font-semibold">
                                    {filteredTrainees.length}
                                </span>{" "}
                                trainees
                                {hasFilters ? "" : " (no filters applied)"}
                            </p>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
                                aria-label="Export trainees to CSV"
                            >
                                <Download size={16} className="mr-2" /> Export
                                to CSV
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="mb-6">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                aria-label="Sort trainees"
                            >
                                <option value="matchScoreDesc">
                                    Sort by Match Score (High to Low)
                                </option>
                                <option value="matchScoreAsc">
                                    Sort by Match Score (Low to High)
                                </option>
                            </select>
                        </div>

                        {/* Trainee Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredTrainees.length === 0 ? (
                                <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                                    <p className="text-gray-500 font-medium">
                                        No trainees found matching your filters
                                    </p>
                                </div>
                            ) : (
                                filteredTrainees.map((trainee) => (
                                    <div
                                        key={trainee._id}
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-lg">
                                                    {trainee.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {trainee.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {trainee.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-medium text-gray-700">
                                                    Skills
                                                </h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {trainee.skills
                                                        ?.slice(0, 3)
                                                        .map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    {trainee.skills?.length >
                                                        3 && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +
                                                            {trainee.skills
                                                                .length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-gray-700">
                                                    Certifications
                                                </h4>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {trainee.certificates
                                                        ?.slice(0, 3)
                                                        .map((cert, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                                            >
                                                                {cert.name} (
                                                                {cert.issuer})
                                                            </span>
                                                        ))}
                                                    {trainee.certificates
                                                        ?.length > 3 && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +
                                                            {trainee
                                                                .certificates
                                                                .length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-gray-700">
                                                    Availability
                                                </h4>
                                                <span className="inline-flex items-center px-2.5 py-1 mt-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {trainee.availability ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-gray-700">
                                                    {hasFilters
                                                        ? "Recommended Category"
                                                        : "Default Category"}
                                                </h4>
                                                <p className="text-sm font-semibold text-gray-900 mt-2">
                                                    {trainee.match.category}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-medium text-gray-700">
                                                    {hasFilters
                                                        ? "Match Score"
                                                        : "Baseline Score"}
                                                </h4>
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-semibold border ${getMatchBadgeClass(
                                                        trainee.match.matchLevel
                                                    )}`}
                                                >
                                                    {trainee.match.score}%{" "}
                                                    {hasFilters
                                                        ? "Match"
                                                        : "Score"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJobMatching;
