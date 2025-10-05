import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Bookmark,
    User,
    Eye,
    Trash2,
    Zap,
    TrendingUp,
    Star,
    Clock,
    Award,
    MapPin,
} from "react-feather";

const JobMatching = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [matchedCandidates, setMatchedCandidates] = useState([]);
    const [shortlistedCandidates, setShortlistedCandidates] = useState([
        {
            id: 1,
            name: "Maria Santos",
            skills: ["Welding NC II", "Blueprint Reading"],
            dateAdded: "Sep 18, 2025",
            location: "Angeles City",
            matchScore: 92,
        },
        {
            id: 2,
            name: "Pedro Lim",
            skills: ["Carpentry NC II", "Furniture Making"],
            dateAdded: "Sep 17, 2025",
            location: "San Fernando",
            matchScore: 88,
        },
    ]);

    // Expanded candidate database with FAST-C courses
    const allCandidates = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            skills: ["Welding NC II", "Metal Fabrication", "Safety Training"],
            certificates: ["Welding NC II", "Industrial Safety"],
            experience: "3 years",
            location: "San Fernando, Pampanga",
            validUntil: "June 15, 2027",
            matchScore: 95,
            status: "Available",
        },
        {
            id: 2,
            name: "Ana Reyes",
            skills: ["Carpentry NC II", "Furniture Making", "Wood Finishing"],
            certificates: ["Carpentry NC II", "Cabinet Making"],
            experience: "2 years",
            location: "Angeles City, Pampanga",
            validUntil: "March 10, 2026",
            matchScore: 88,
            status: "Available",
        },
        {
            id: 3,
            name: "Roberto Garcia",
            skills: ["Bread and Pastry NC II", "Baking", "Cake Decoration"],
            certificates: ["Bread and Pastry NC II", "Food Safety"],
            experience: "4 years",
            location: "Mabalacat, Pampanga",
            validUntil: "December 20, 2026",
            matchScore: 92,
            status: "Available",
        },
        {
            id: 4,
            name: "Linda Aquino",
            skills: [
                "Housekeeping NC II",
                "Room Management",
                "Laundry Services",
            ],
            certificates: ["Housekeeping NC II"],
            experience: "1 year",
            location: "San Fernando, Pampanga",
            validUntil: "August 5, 2027",
            matchScore: 85,
            status: "Available",
        },
        {
            id: 5,
            name: "Carlos Mendoza",
            skills: ["Masonry NC II", "Tile Installation", "Concrete Work"],
            certificates: ["Masonry NC II", "Safety Training"],
            experience: "5 years",
            location: "Guagua, Pampanga",
            validUntil: "January 15, 2028",
            matchScore: 90,
            status: "Available",
        },
        {
            id: 6,
            name: "Elena Santos",
            skills: [
                "Dressmaking NC II",
                "Pattern Making",
                "Garment Construction",
            ],
            certificates: ["Dressmaking NC II", "Fashion Design Basics"],
            experience: "2 years",
            location: "Mexico, Pampanga",
            validUntil: "May 30, 2026",
            matchScore: 87,
            status: "Available",
        },
        {
            id: 7,
            name: "Jose Fernandez",
            skills: [
                "Massage Therapy NC II",
                "Therapeutic Massage",
                "Sports Massage",
            ],
            certificates: ["Massage Therapy NC II", "First Aid"],
            experience: "3 years",
            location: "Angeles City, Pampanga",
            validUntil: "October 12, 2027",
            matchScore: 91,
            status: "Available",
        },
        {
            id: 8,
            name: "Patricia Cruz",
            skills: ["Events Management", "Event Planning", "Coordination"],
            certificates: ["Events Management NC III", "Customer Service"],
            experience: "4 years",
            location: "San Fernando, Pampanga",
            validUntil: "February 28, 2027",
            matchScore: 89,
            status: "Available",
        },
        {
            id: 9,
            name: "Ramon Torres",
            skills: [
                "Computer Software NC III",
                "Microsoft Office",
                "Data Entry",
            ],
            certificates: ["Computer Software NC III", "IT Fundamentals"],
            experience: "2 years",
            location: "Mabalacat, Pampanga",
            validUntil: "July 18, 2026",
            matchScore: 86,
            status: "Available",
        },
        {
            id: 10,
            name: "Gloria Ramos",
            skills: ["Bread and Pastry NC II", "Pastry Arts", "Dessert Making"],
            certificates: ["Bread and Pastry NC II"],
            experience: "3 years",
            location: "Angeles City, Pampanga",
            validUntil: "November 5, 2027",
            matchScore: 93,
            status: "Available",
        },
        {
            id: 11,
            name: "Miguel Santos",
            skills: ["Welding NC II", "Arc Welding", "Metal Cutting"],
            certificates: ["Welding NC II", "Blueprint Reading"],
            experience: "6 years",
            location: "Guagua, Pampanga",
            validUntil: "April 22, 2028",
            matchScore: 94,
            status: "Available",
        },
        {
            id: 12,
            name: "Teresa Lopez",
            skills: [
                "Housekeeping NC II",
                "Hotel Operations",
                "Customer Service",
            ],
            certificates: ["Housekeeping NC II", "Tourism Services"],
            experience: "2 years",
            location: "San Fernando, Pampanga",
            validUntil: "September 8, 2026",
            matchScore: 84,
            status: "Available",
        },
        {
            id: 13,
            name: "Antonio Diaz",
            skills: ["Carpentry NC II", "Cabinet Making", "Wood Design"],
            certificates: ["Carpentry NC II", "Furniture Design"],
            experience: "4 years",
            location: "Mexico, Pampanga",
            validUntil: "December 1, 2027",
            matchScore: 90,
            status: "Available",
        },
        {
            id: 14,
            name: "Rosa Morales",
            skills: ["Dressmaking NC II", "Tailoring", "Alterations"],
            certificates: ["Dressmaking NC II"],
            experience: "5 years",
            location: "Angeles City, Pampanga",
            validUntil: "March 15, 2028",
            matchScore: 88,
            status: "Available",
        },
        {
            id: 15,
            name: "Felipe Gonzales",
            skills: ["Masonry NC II", "Bricklaying", "Plastering"],
            certificates: ["Masonry NC II", "Construction Safety"],
            experience: "7 years",
            location: "San Fernando, Pampanga",
            validUntil: "June 30, 2028",
            matchScore: 92,
            status: "Available",
        },
        {
            id: 16,
            name: "Carmen Jimenez",
            skills: [
                "Events Management",
                "Wedding Planning",
                "Corporate Events",
            ],
            certificates: [
                "Events Management NC III",
                "Hospitality Management",
            ],
            experience: "3 years",
            location: "Mabalacat, Pampanga",
            validUntil: "August 10, 2027",
            matchScore: 87,
            status: "Available",
        },
        {
            id: 17,
            name: "Ricardo Perez",
            skills: [
                "Computer Software NC III",
                "Web Design",
                "Graphic Design",
            ],
            certificates: ["Computer Software NC III", "Adobe Certified"],
            experience: "4 years",
            location: "Angeles City, Pampanga",
            validUntil: "October 25, 2027",
            matchScore: 91,
            status: "Available",
        },
        {
            id: 18,
            name: "Luisa Martinez",
            skills: [
                "Massage Therapy NC II",
                "Swedish Massage",
                "Aromatherapy",
            ],
            certificates: ["Massage Therapy NC II", "Wellness Certification"],
            experience: "2 years",
            location: "San Fernando, Pampanga",
            validUntil: "May 12, 2026",
            matchScore: 86,
            status: "Available",
        },
        {
            id: 19,
            name: "Diego Castillo",
            skills: ["Lantern Making", "Parol Design", "Traditional Crafts"],
            certificates: ["Lantern Making Certificate", "Arts and Crafts"],
            experience: "8 years",
            location: "San Fernando, Pampanga",
            validUntil: "December 15, 2028",
            matchScore: 95,
            status: "Available",
        },
        {
            id: 20,
            name: "Sofia Navarro",
            skills: [
                "Bread and Pastry NC II",
                "Artisan Bread",
                "Specialty Cakes",
            ],
            certificates: ["Bread and Pastry NC II", "Culinary Arts"],
            experience: "5 years",
            location: "Mexico, Pampanga",
            validUntil: "January 20, 2028",
            matchScore: 94,
            status: "Available",
        },
    ];

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const query = searchQuery.toLowerCase();
            const matches = allCandidates
                .filter((candidate) => {
                    const skillsMatch = candidate.skills.some((skill) =>
                        skill.toLowerCase().includes(query)
                    );
                    const certMatch = candidate.certificates.some((cert) =>
                        cert.toLowerCase().includes(query)
                    );
                    const nameMatch = query
                        .split(" ")
                        .some((word) =>
                            candidate.name.toLowerCase().includes(word)
                        );
                    const locationMatch = query
                        .split(" ")
                        .some((word) =>
                            candidate.location.toLowerCase().includes(word)
                        );
                    return (
                        skillsMatch || certMatch || nameMatch || locationMatch
                    );
                })
                .sort((a, b) => b.matchScore - a.matchScore);

            setMatchedCandidates(matches);
            setIsSearching(false);
        }, 1500);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const addToShortlist = (candidate) => {
        if (shortlistedCandidates.find((c) => c.id === candidate.id)) {
            alert("This candidate is already in your shortlist!");
            return;
        }
        setShortlistedCandidates([
            ...shortlistedCandidates,
            {
                id: candidate.id,
                name: candidate.name,
                skills: candidate.skills.slice(0, 2),
                dateAdded: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                location: candidate.location,
                matchScore: candidate.matchScore,
            },
        ]);
    };

    const removeFromShortlist = (id) => {
        setShortlistedCandidates(
            shortlistedCandidates.filter((c) => c.id !== id)
        );
    };

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                    AI Job Matching
                </h1>
                <span className="font-semibold">{allCandidates.length}</span>{" "}
                trained professionals available •
                <span className="font-semibold ml-2">
                    {shortlistedCandidates.length}
                </span>{" "}
                shortlisted
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* AI Search Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                        <div className="bg-blue-600 p-2 rounded-lg mr-3">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                AI-Powered Candidate Search
                            </h2>
                            <p className="text-sm text-gray-600">
                                Describe your job requirements in natural
                                language
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search
                                    size={20}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="e.g., 'Bread and Pastry' or 'Welders near San Fernando' or 'Housekeeping'"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-sm cursor-pointer"
                            >
                                {isSearching ? "Searching..." : "Search"}
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-gray-600">
                                Quick searches:
                            </span>
                            <button
                                onClick={() => setSearchQuery("Welding NC II")}
                                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition duration-200"
                            >
                                Welding
                            </button>
                            <button
                                onClick={() =>
                                    setSearchQuery("Bread and Pastry")
                                }
                                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition duration-200"
                            >
                                Bread & Pastry
                            </button>
                            <button
                                onClick={() => setSearchQuery("Carpentry")}
                                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition duration-200"
                            >
                                Carpentry
                            </button>
                            <button
                                onClick={() => setSearchQuery("Dressmaking")}
                                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition duration-200"
                            >
                                Dressmaking
                            </button>
                            <button
                                onClick={() => setSearchQuery("Housekeeping")}
                                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition duration-200"
                            >
                                Housekeeping
                            </button>
                        </div>
                    </div>

                    {isSearching && (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                                <p className="text-sm text-gray-600">
                                    AI is analyzing candidates...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isSearching && matchedCandidates.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <div className="flex items-center">
                                <TrendingUp
                                    size={18}
                                    className="text-green-600 mr-2"
                                />
                                <h3 className="font-semibold text-gray-800">
                                    {matchedCandidates.length} Match
                                    {matchedCandidates.length !== 1
                                        ? "es"
                                        : ""}{" "}
                                    Found
                                </h3>
                            </div>
                            {matchedCandidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <User
                                                size={28}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {candidate.name}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <MapPin
                                                            size={14}
                                                            className="mr-1"
                                                        />
                                                        {candidate.location}
                                                    </div>
                                                </div>
                                                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                                    <Star
                                                        size={16}
                                                        className="text-green-600 mr-1"
                                                    />
                                                    <span className="text-sm font-semibold text-green-600">
                                                        {candidate.matchScore}%
                                                        Match
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {candidate.skills.map(
                                                    (skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
                                                        >
                                                            {skill}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center">
                                                    <Award
                                                        size={14}
                                                        className="mr-1 text-blue-600"
                                                    />
                                                    {
                                                        candidate.certificates
                                                            .length
                                                    }{" "}
                                                    Certificate
                                                    {candidate.certificates
                                                        .length !== 1
                                                        ? "s"
                                                        : ""}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock
                                                        size={14}
                                                        className="mr-1 text-blue-600"
                                                    />
                                                    {candidate.experience}{" "}
                                                    experience
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-3">
                                                Valid until:{" "}
                                                <span className="font-medium">
                                                    {candidate.validUntil}
                                                </span>
                                            </p>

                                            <div className="flex gap-3">
                                                <Link
                                                    to="#view-profile"
                                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center font-medium transition duration-200"
                                                >
                                                    <Eye
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        addToShortlist(
                                                            candidate
                                                        )
                                                    }
                                                    className="text-sm text-green-600 hover:text-green-700 flex items-center font-medium transition duration-200"
                                                >
                                                    <Bookmark
                                                        size={16}
                                                        className="mr-1"
                                                    />
                                                    Add to Shortlist
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isSearching &&
                        searchQuery &&
                        matchedCandidates.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-600">
                                    No matches found. Try different keywords or
                                    skills.
                                </p>
                            </div>
                        )}
                </div>

                {/* Shortlisted Candidates */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <Bookmark
                                size={24}
                                className="text-blue-600 mr-2"
                            />
                            <h2 className="text-xl font-semibold text-gray-800">
                                Shortlisted Candidates
                            </h2>
                        </div>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {shortlistedCandidates.length} Total
                        </span>
                    </div>

                    {shortlistedCandidates.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Bookmark
                                size={48}
                                className="mx-auto mb-3 text-gray-300"
                            />
                            <p>No candidates shortlisted yet.</p>
                            <p className="text-sm mt-1">
                                Search and add candidates to your shortlist.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                            Candidate
                                        </th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                            Skills
                                        </th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                            Match Score
                                        </th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                            Date Added
                                        </th>
                                        <th className="py-3 px-4 text-left font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shortlistedCandidates.map((candidate) => (
                                        <tr
                                            key={candidate.id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {candidate.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {candidate.location}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {candidate.skills.map(
                                                        (skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-green-600 font-semibold">
                                                    {candidate.matchScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">
                                                {candidate.dateAdded}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to="#view-profile"
                                                        className="text-blue-600 hover:text-blue-700 transition duration-200"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            removeFromShortlist(
                                                                candidate.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700 transition duration-200 cursor-pointer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobMatching;
