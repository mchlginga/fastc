import React from "react";

const TraineeCard = ({
    trainee,
    getMatchBadgeClass,
    hasFilters,
    isPendingCompany = false,
}) => {
    const skills = trainee.match.factors?.skillDetails || [];
    const certs = trainee.certificates || [];

    // Format the filter bonus to remove excessive decimal places
    const formatBonus = (bonus) => {
        if (!bonus || bonus === 0) return null;
        return Math.round(bonus * 100) / 100;
    };

    const filterBonus = formatBonus(trainee.match.factors?.filterBonus);

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-sm transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {trainee.profilePic ? (
                            <img
                                src={trainee.profilePic}
                                alt={`${trainee.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        ) : (
                            <span className="text-blue-600 font-medium text-sm">
                                {trainee.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                            {trainee.name}
                        </h3>
                        {!isPendingCompany ? (
                            <p className="text-xs text-gray-500 mt-0.5">
                                {trainee.email}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 italic mt-0.5">
                                Contact details available after approval
                            </p>
                        )}
                    </div>
                </div>
                <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getMatchBadgeClass(
                        trainee.match.matchLevel
                    )}`}
                >
                    {trainee.match.score}%
                </div>
            </div>

            {/* Category */}
            <div className="mb-6">
                <p className="font-medium text-gray-900 text-sm">
                    {trainee.match.category}
                </p>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                        Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100"
                            >
                                {skill.name}
                                {skill.certCount > 1 && ` (${skill.certCount})`}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certs.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">
                        Certifications
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {certs.slice(0, 4).map((cert, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs bg-purple-50 text-purple-700 rounded-lg font-medium border border-purple-100"
                            >
                                {cert.title}
                            </span>
                        ))}
                        {certs.length > 4 && (
                            <span className="px-2.5 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg font-medium border border-gray-200">
                                +{certs.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                <span className="text-gray-500 font-medium">
                    {trainee.availability || "Not specified"}
                </span>
                {filterBonus > 0 && (
                    <span className="text-emerald-600 font-medium">
                        +{filterBonus}% bonus
                    </span>
                )}
            </div>

            {/* Info message for pending companies */}
            {isPendingCompany && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 text-center font-medium">
                        Full profile access after approval
                    </p>
                </div>
            )}
        </div>
    );
};

export default TraineeCard;
