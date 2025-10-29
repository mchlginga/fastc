import { useState } from "react";
import { Filter, X } from "react-feather";
import debounce from "lodash/debounce";

const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="mb-6">
        <div
            className="flex justify-between items-center cursor-pointer"
            onClick={onToggle}
        >
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <span>{isExpanded ? "−" : "+"}</span>
        </div>
        {isExpanded && <div className="mt-3">{children}</div>}
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
        <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-text"
        />
        <div className="space-y-1 max-h-48 overflow-y-auto">
            {options.filter((option) =>
                option.toLowerCase().includes(searchValue.toLowerCase())
            ).length === 0 ? (
                <p className="text-sm text-gray-500">No {type} found</p>
            ) : (
                options
                    .filter((option) =>
                        option.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                        <label
                            key={option}
                            className={`flex items-center cursor-pointer p-1 rounded ${
                                selectedValues.includes(option)
                                    ? "bg-blue-50"
                                    : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => onValueToggle(option)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {option}
                            </span>
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
    skillSearch,
    certSearch,
    categorySearch,
    hasFilters,
    onFilterChange,
    onToggleSection,
    onClearFilters,
    onSkillSearch,
    onCertSearch,
    onCategorySearch,
    onToggleFilterOpen,
}) => {
    const [localSkillSearch, setLocalSkillSearch] = useState(skillSearch);
    const [localCertSearch, setLocalCertSearch] = useState(certSearch);
    const [localCategorySearch, setLocalCategorySearch] =
        useState(categorySearch);

    const debouncedSkillSearch = debounce(
        (value) => onSkillSearch(value.toLowerCase()),
        300
    );
    const debouncedCertSearch = debounce(
        (value) => onCertSearch(value.toLowerCase()),
        300
    );
    const debouncedCategorySearch = debounce(
        (value) => onCategorySearch(value.toLowerCase()),
        300
    );

    const handleSkillSearch = (value) => {
        setLocalSkillSearch(value);
        debouncedSkillSearch(value);
    };

    const handleCertSearch = (value) => {
        setLocalCertSearch(value);
        debouncedCertSearch(value);
    };

    const handleCategorySearch = (value) => {
        setLocalCategorySearch(value);
        debouncedCategorySearch(value);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                    AI Filters
                </h2>
                <button
                    className="lg:hidden text-blue-600 hover:text-blue-800 p-2 rounded-xl bg-blue-50 cursor-pointer"
                    onClick={() => onToggleFilterOpen(!isFilterOpen)}
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
                        AI Filters
                    </h2>
                    <button
                        onClick={() => onToggleFilterOpen(false)}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-xl cursor-pointer bg-gray-100"
                        aria-label="Close filter panel"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Clear Filters */}
                {hasFilters && (
                    <button
                        onClick={onClearFilters}
                        className="w-full mb-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
                    >
                        Clear All Filters
                    </button>
                )}

                {/* Category Filter */}
                <FilterSection
                    title="Job Category"
                    isExpanded={expandedSections.category}
                    onToggle={() => onToggleSection("category")}
                >
                    <SearchableFilter
                        searchValue={localCategorySearch}
                        onSearchChange={handleCategorySearch}
                        placeholder="Search categories..."
                        options={filterOptions.categories}
                        selectedValues={filters.category}
                        onValueToggle={(value) =>
                            onFilterChange("category", value)
                        }
                        type="categories"
                    />
                </FilterSection>

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
                    <div className="space-y-1">
                        {filterOptions.availability.map((option) => (
                            <label
                                key={option}
                                className={`flex items-center cursor-pointer p-1 rounded ${
                                    filters.availability.includes(option)
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
                                        onFilterChange("availability", option)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {option}
                                </span>
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
                    <div className="space-y-1">
                        {filterOptions.issuer.map((issuer) => (
                            <label
                                key={issuer}
                                className={`flex items-center cursor-pointer p-1 rounded ${
                                    filters.issuer.includes(issuer)
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.issuer.includes(issuer)}
                                    onChange={() =>
                                        onFilterChange("issuer", issuer)
                                    }
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {issuer}
                                </span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Close Filters Button (Mobile) */}
                <div className="lg:hidden mt-6">
                    <button
                        onClick={() => onToggleFilterOpen(false)}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-xl transition-colors cursor-pointer"
                    >
                        Close Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobMatchingFilters;
