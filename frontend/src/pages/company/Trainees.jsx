import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Eye, Bookmark, ChevronRight } from "react-feather";

const Trainees = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [validityFilter, setValidityFilter] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setError("Please enter a search query.");
            setResults([]);
            return;
        }

        setError("");
        setIsLoading(true);

        // Simulate API call (replace with GET /trainees/search)
        setTimeout(() => {
            const mockResults = [
                {
                    id: "juan-dela-cruz",
                    name: "Juan Dela Cruz",
                    certificates: ["Welding NC II", "Carpentry Basics"],
                    validity: "June 15, 2027",
                    matchScore: "Highly Recommended",
                },
                {
                    id: "ana-reyes",
                    name: "Ana Reyes",
                    certificates: ["Carpentry NC II"],
                    validity: "March 10, 2026",
                    matchScore: "85% Match",
                },
            ];

            // Filter results based on course and validity
            const filteredResults = mockResults.filter((trainee) => {
                const matchesQuery =
                    trainee.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    trainee.certificates.some((cert) =>
                        cert.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                const matchesCourse = courseFilter
                    ? trainee.certificates.some((cert) =>
                          cert
                              .toLowerCase()
                              .includes(courseFilter.toLowerCase())
                      )
                    : true;
                const matchesValidity = validityFilter
                    ? validityFilter === "valid"
                        ? new Date(trainee.validity) > new Date()
                        : new Date(trainee.validity) <= new Date()
                    : true;
                return matchesQuery && matchesCourse && matchesValidity;
            });

            setResults(filteredResults);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Search Trainees
                </h1>
                <p className="text-gray-600">
                    Find trainees by name, skill, or certificate
                </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Search Trainees
                </h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name, skill, or certificate..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setError("");
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm min-w-1/3"
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm md:w-1/2"
                    >
                        <option value="">All Courses</option>
                        <option value="welding">Basic Welding</option>
                        <option value="pastry">Pastry Making</option>
                        <option value="dressmaking">Dressmaking</option>
                    </select>
                    <select
                        value={validityFilter}
                        onChange={(e) => setValidityFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm md:w-1/2"
                    >
                        <option value="">Certificate Validity</option>
                        <option value="valid">Valid</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 w-full disabled:bg-blue-400"
                    >
                        <Search size={16} className="inline mr-2" />
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>

            {/* Search Results */}
            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Search Results
                </h2>
                {isLoading ? (
                    <p className="text-sm text-gray-600">Loading...</p>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((trainee) => (
                            <div
                                key={trainee.id}
                                className="border-b border-gray-300 pb-2 flex items-start"
                            >
                                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium">
                                            {trainee.name}
                                        </h3>
                                        <span className="text-sm text-green-600 font-semibold">
                                            {trainee.matchScore}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {trainee.certificates.map(
                                            (cert, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                >
                                                    {cert}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Valid until: {trainee.validity}
                                    </p>
                                    <div className="mt-2 flex space-x-2">
                                        <Link
                                            to={`/company/trainee/${trainee.id}`}
                                            className="text-sm text-blue-600 hover:text-blue-500 flex items-center"
                                        >
                                            <Eye size={16} className="mr-1" />
                                            View Profile
                                        </Link>
                                        <Link
                                            to={`/company/shortlist/add/${trainee.id}`}
                                            className="text-sm text-green-600 hover:text-green-500 flex items-center"
                                        >
                                            <Bookmark
                                                size={16}
                                                className="mr-1"
                                            />
                                            Shortlist
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-4">
                        <p className="text-sm font-medium">
                            No exact matches found. Try broadening your filters.
                        </p>
                        <p className="text-sm mt-2">
                            Near matches:{" "}
                            <Link
                                to="/company/search?certificate=nc1-welding"
                                className="text-blue-600 hover:text-blue-500"
                            >
                                View NC I Welding candidates
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Trainees;
