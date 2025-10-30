// C:\Users\y\OneDrive\Desktop\fastc\frontend\src\components\admin\job-matching\TraineeGrid.jsx
import { Download, Filter, X } from "react-feather";
import { memo } from "react";
import TraineeCard from "./TraineeCard";

// 🆕 IMPROVED: Better filter display names
const getFilterDisplayName = (category, value) => {
    switch (category) {
        case "skills":
            return value; // Just show "Welding", "Dress-making", etc.
        case "certifications":
            return value; // Just show "Welding I", "Dressmaking II", etc.
        case "availability":
            return value; // Just show "Full-time", "Part-time"
        case "issuer":
            return value; // Just show "FAST-C", "TESDA", etc.
        case "category":
            return value; // Just show the category name
        default:
            return value;
    }
};

const ActiveFilters = memo(({ filters, onRemoveFilter }) => {
    const hasFilters = Object.values(filters).some((arr) => arr.length > 0);

    if (!hasFilters) return null;

    return (
        <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(filters).flatMap(([category, values]) =>
                values.map((value) => (
                    <span
                        key={`${category}-${value}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                        {/* 🆕 IMPROVED: Show only the value, not the category name */}
                        {getFilterDisplayName(category, value)}
                        <button
                            onClick={() => onRemoveFilter(category, value)}
                            className="ml-2 focus:outline-none cursor-pointer hover:text-blue-900 transition-colors"
                            aria-label={`Remove ${value} filter`}
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))
            )}
        </div>
    );
});

const TraineeGrid = memo(
    ({
        trainees,
        sortBy,
        exporting,
        hasFilters,
        onSortChange,
        onExport,
        onClearFilters,
        filters = {},
        onRemoveFilter, // 🆕 NEW: Add this prop
    }) => {
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

        // 🆕 IMPROVED: Use the passed onRemoveFilter function
        const handleRemoveFilter = (category, value) => {
            if (onRemoveFilter) {
                onRemoveFilter(category, value);
            }
        };

        return (
            <>
                {/* Active Filters */}
                <ActiveFilters
                    filters={filters}
                    onRemoveFilter={handleRemoveFilter}
                />

                {/* Results and Actions */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                <span className="font-semibold">
                                    {trainees.length}
                                </span>{" "}
                                trainees
                                {hasFilters
                                    ? " matching your criteria"
                                    : " (all trainees)"}
                            </p>
                            {hasFilters && (
                                <p className="text-xs text-gray-500 mt-1">
                                    AI-powered matching based on skills,
                                    certificates, and availability
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                            >
                                <option value="matchScoreDesc">
                                    Best Match First
                                </option>
                                <option value="matchScoreAsc">
                                    Lowest Match First
                                </option>
                                <option value="nameAsc">Name A-Z</option>
                                <option value="nameDesc">Name Z-A</option>
                            </select>
                            <button
                                onClick={onExport}
                                disabled={exporting || trainees.length === 0}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={16} className="mr-2" />
                                {exporting ? "Exporting..." : "Export to CSV"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Trainee Grid */}
                <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
                    {trainees.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter
                                        size={24}
                                        className="text-gray-400"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    No trainees found
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {hasFilters
                                        ? "Try adjusting your filters to see more results."
                                        : "There are no approved trainees in the system yet."}
                                </p>
                                {hasFilters && (
                                    <button
                                        onClick={onClearFilters}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        trainees.map((trainee) => (
                            <TraineeCard
                                key={trainee._id}
                                trainee={trainee}
                                getMatchBadgeClass={getMatchBadgeClass}
                                hasFilters={hasFilters}
                            />
                        ))
                    )}
                </div>
            </>
        );
    }
);

export default TraineeGrid;
