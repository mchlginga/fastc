import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminJobMatching = () => {
    const { user } = useAuth();
    const [trainees, setTrainees] = useState([]);
    const [filteredTrainees, setFilteredTrainees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shortlisted, setShortlisted] = useState(new Set());
    const [filters, setFilters] = useState({
        skills: [],
        certifications: [],
        availability: [],
        issuer: [],
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
                setTrainees(data.trainees);
                setFilteredTrainees(data.trainees);
                setShortlisted(
                    new Set(
                        data.trainees
                            .filter((t) => t.isShortlisted)
                            .map((t) => t._id)
                    )
                );
            } catch (err) {
                console.error("Failed to fetch trainees:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user && ["superAdmin", "admin"].includes(user.role)) {
            fetchTrainees();
        }
    }, [user, filters]);

    const handleFilterChange = (category, value) => {
        setFilters((prev) => {
            const currentValues = prev[category];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { ...prev, [category]: newValues };
        });
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

    const toggleShortlist = async (traineeId) => {
        try {
            if (shortlisted.has(traineeId)) {
                await api.delete(`/match/shortlist/${traineeId}`);
                setShortlisted((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(traineeId);
                    return newSet;
                });
            } else {
                await api.post("/match/shortlist", { traineeId });
                setShortlisted((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(traineeId);
                    return newSet;
                });
            }
        } catch (err) {
            console.error("Shortlist error:", err);
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
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        AI-Based Job Matching
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm">
                        Discover and shortlist trainees based on their skills,
                        certifications, issuer, and availability.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filter Panel */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Filter Trainees
                            </h2>

                            {/* Skills Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Skills
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {skillsList.map((skill) => (
                                        <label
                                            key={skill}
                                            className="flex items-center cursor-pointer"
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
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {skill}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Certifications Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Certifications
                                </h3>
                                <div className="space-y-2">
                                    {certificationsList.map((cert) => (
                                        <label
                                            key={cert}
                                            className="flex items-center cursor-pointer"
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
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {cert}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Issuer Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Certificate Issuer
                                </h3>
                                <div className="space-y-2">
                                    {issuerList.map((issuer) => (
                                        <label
                                            key={issuer}
                                            className="flex items-center cursor-pointer"
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
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {issuer}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Availability
                                </h3>
                                <div className="space-y-2">
                                    {availabilityOptions.map((option) => (
                                        <label
                                            key={option}
                                            className="flex items-center cursor-pointer"
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
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {hasFilters && (
                                <button
                                    onClick={() =>
                                        setFilters({
                                            skills: [],
                                            certifications: [],
                                            issuer: [],
                                            availability: [],
                                        })
                                    }
                                    className="w-full mt-6 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors duration-200"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Count */}
                        <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center mb-4">
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing{" "}
                                    <span className="font-semibold">
                                        {filteredTrainees.length}
                                    </span>{" "}
                                    trainees
                                    {hasFilters ? "" : " (no filters applied)"}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {shortlisted.size} Shortlisted
                                </p>
                            </div>
                        </div>

                        {/* Trainees Card Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {filteredTrainees.length === 0 ? (
                                <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                    <p className="text-gray-500 font-medium">
                                        No trainees found matching your filters
                                    </p>
                                </div>
                            ) : (
                                filteredTrainees.map((trainee) => (
                                    <div
                                        key={trainee._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
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
                                                <h3 className="text-sm font-semibold text-gray-900">
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
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {trainee.skills
                                                        ?.slice(0, 3)
                                                        .map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    {trainee.skills?.length >
                                                        3 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
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
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {trainee.certificates
                                                        ?.slice(0, 3)
                                                        .map((cert, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700"
                                                            >
                                                                {cert.name} (
                                                                {cert.issuer})
                                                            </span>
                                                        ))}
                                                    {trainee.certificates
                                                        ?.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
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
                                                <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
                                                <p className="text-sm font-medium text-gray-900 mt-1">
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
                                                    className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm font-semibold border ${getMatchBadgeClass(
                                                        trainee.match.matchLevel
                                                    )}`}
                                                >
                                                    {trainee.match.score}%{" "}
                                                    {hasFilters
                                                        ? "Match"
                                                        : "Score"}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    toggleShortlist(trainee._id)
                                                }
                                                className={`w-full px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${
                                                    shortlisted.has(trainee._id)
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                {shortlisted.has(trainee._id)
                                                    ? "Shortlisted"
                                                    : "Shortlist"}
                                            </button>
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
