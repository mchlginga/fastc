import { useState } from "react";
import { Filter, X, Search } from "react-feather";
import debounce from "lodash/debounce";

// Custom hook for debounced search
const useDebouncedSearch = (onSearch, delay = 300) => {
    const [localValue, setLocalValue] = useState("");

    const debouncedSearch = debounce((value) => {
        onSearch(value.toLowerCase());
    }, delay);

    const handleChange = (value) => {
        setLocalValue(value);
        debouncedSearch(value);
    };

    return [localValue, handleChange];
};

const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-6">
        <div
            className="flex justify-between items-center cursor-pointer py-2"
            onClick={onToggle}
        >
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <span className="text-gray-500 text-sm">
                {isExpanded ? "−" : "+"}
            </span>
        </div>
        {isExpanded && <div className="mt-2">{children}</div>}
    </div>
);

const SearchableFilter = ({
    searchValue,
    onSearchChange,
    placeholder,
    options,
    selectedValues,
    onValueToggle,
    type,
}) => (
    <>
        <div className="relative mb-3">
            <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text"
            />
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
            {options.filter((option) =>
                option.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0 ? (
                <p className="text-sm text-gray-500 px-2">No {type} found</p>
            ) : (
                options
                    .filter((option) =>
                        option.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                        <label
                            key={option}
                            className={`flex items-center cursor-pointer p-2 rounded-lg text-sm transition-colors ${
                                selectedValues.includes(option)
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "hover:bg-gray-50 text-gray-700"
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => onValueToggle(option)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3">{option}</span>
                        </label>
                    ))
            )}
        </div>
    </>
);

const JobMatchingFilters = ({
    filters,
    filterOptions,
    expandedSections,
    isFilterOpen,
    hasFilters,
    onFilterChange,
    onToggleSection,
    onClearFilters,
    onSkillSearch,
    onCertSearch,
    onToggleFilterOpen,
}) => {
    // Use the custom hook for each search type
    const [localSkillSearch, handleSkillSearch] =
        useDebouncedSearch(onSkillSearch);
    const [localCertSearch, handleCertSearch] =
        useDebouncedSearch(onCertSearch);

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 sticky top-8">
            {/* 🆕 UPDATED: Added max-height and overflow to the main container */}
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        AI Filters
                    </h2>
                    <button
                        className="lg:hidden text-blue-600 hover:text-blue-800 p-2 rounded-lg bg-blue-50 cursor-pointer transition-colors"
                        onClick={() => onToggleFilterOpen(!isFilterOpen)}
                        aria-label="Toggle filter panel"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                {/* Mobile Filter Modal */}
                <div
                    className={`lg:block ${
                        isFilterOpen ? "block" : "hidden"
                    } lg:static fixed inset-0 bg-white z-50 p-6 overflow-y-auto`}
                >
                    <div className="lg:hidden flex justify-between items-center mb-6 sticky top-0 bg-white py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            AI Filters
                        </h2>
                        <button
                            onClick={() => onToggleFilterOpen(false)}
                            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg cursor-pointer bg-gray-100 transition-colors"
                            aria-label="Close filter panel"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Clear Filters */}
                    {hasFilters && (
                        <button
                            onClick={onClearFilters}
                            className="w-full mb-6 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                            Clear All Filters
                        </button>
                    )}

                    {/* Skills Filter */}
                    <FilterSection
                        title="Skills"
                        isExpanded={expandedSections.skills}
                        onToggle={() => onToggleSection("skills")}
                    >
                        <SearchableFilter
                            searchValue={localSkillSearch}
                            onSearchChange={handleSkillSearch}
                            placeholder="Search skills..."
                            options={filterOptions.skills}
                            selectedValues={filters.skills}
                            onValueToggle={(value) =>
                                onFilterChange("skills", value)
                            }
                            type="skills"
                        />
                    </FilterSection>

                    {/* Certifications Filter */}
                    <FilterSection
                        title="Certifications"
                        isExpanded={expandedSections.certifications}
                        onToggle={() => onToggleSection("certifications")}
                    >
                        <SearchableFilter
                            searchValue={localCertSearch}
                            onSearchChange={handleCertSearch}
                            placeholder="Search certifications..."
                            options={filterOptions.certifications}
                            selectedValues={filters.certifications}
                            onValueToggle={(value) =>
                                onFilterChange("certifications", value)
                            }
                            type="certifications"
                        />
                    </FilterSection>

                    {/* Availability Filter */}
                    <FilterSection
                        title="Availability"
                        isExpanded={expandedSections.availability}
                        onToggle={() => onToggleSection("availability")}
                    >
                        <div className="space-y-2">
                            {filterOptions.availability.map((option) => (
                                <label
                                    key={option}
                                    className={`flex items-center cursor-pointer p-2 rounded-lg text-sm transition-colors ${
                                        filters.availability.includes(option)
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.availability.includes(
                                            option
                                        )}
                                        onChange={() =>
                                            onFilterChange(
                                                "availability",
                                                option
                                            )
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3">{option}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Issuer Filter */}
                    <FilterSection
                        title="Issuer"
                        isExpanded={expandedSections.issuer}
                        onToggle={() => onToggleSection("issuer")}
                    >
                        <div className="space-y-2">
                            {filterOptions.issuer.map((issuer) => (
                                <label
                                    key={issuer}
                                    className={`flex items-center cursor-pointer p-2 rounded-lg text-sm transition-colors ${
                                        filters.issuer.includes(issuer)
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.issuer.includes(
                                            issuer
                                        )}
                                        onChange={() =>
                                            onFilterChange("issuer", issuer)
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3">{issuer}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Category Filter */}
                    <FilterSection
                        title="Category"
                        isExpanded={expandedSections.category}
                        onToggle={() => onToggleSection("category")}
                    >
                        <div className="space-y-2">
                            {filterOptions.categories?.map((category) => (
                                <label
                                    key={category}
                                    className={`flex items-center cursor-pointer p-2 rounded-lg text-sm transition-colors ${
                                        filters.category.includes(category)
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.category.includes(
                                            category
                                        )}
                                        onChange={() =>
                                            onFilterChange("category", category)
                                        }
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-3">{category}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Close Filters Button (Mobile) */}
                    <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => onToggleFilterOpen(false)}
                            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                            Close Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobMatchingFilters;
