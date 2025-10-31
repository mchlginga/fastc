import React from "react";

const TraineeCard = ({ trainee, getMatchBadgeClass, hasFilters }) => {
    const skills = trainee.match.factors?.skillDetails || [];
    const certs = trainee.certificates || [];

    // 🆕 FIX: Format the filter bonus to remove excessive decimal places
    const formatBonus = (bonus) => {
        if (!bonus || bonus === 0) return null;
        // Round to 2 decimal places to avoid floating-point precision issues
        return Math.round(bonus * 100) / 100;
    };

    const filterBonus = formatBonus(trainee.match.factors?.filterBonus);

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {trainee.profilePic ? (
                            <img
                                src={trainee.profilePic} // ✅ DIRECT CLOUDINARY URL
                                alt={`${trainee.name}'s profile`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback if image fails to load
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
                        <h3 className="font-semibold text-gray-900">
                            {trainee.name}
                        </h3>
                        <p className="text-sm text-gray-500">{trainee.email}</p>
                    </div>
                </div>
                <div
                    className={`px-2.5 py-1 rounded text-sm font-medium ${getMatchBadgeClass(
                        trainee.match.matchLevel
                    )}`}
                >
                    {trainee.match.score}%
                </div>
            </div>

            {/* Category */}
            <div className="mb-6">
                <p className="font-medium text-gray-900">
                    {trainee.match.category}
                </p>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium"
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
                    <p className="text-xs text-gray-500 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-1.5">
                        {certs.slice(0, 4).map((cert, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium"
                            >
                                {cert.title}
                            </span>
                        ))}
                        {certs.length > 4 && (
                            <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                                +{certs.length - 4} more
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                <span className="text-gray-500">
                    {trainee.availability || "Not specified"}
                </span>
                {filterBonus > 0 && (
                    <span className="text-green-600 font-medium">
                        +{filterBonus}% bonus
                    </span>
                )}
            </div>
        </div>
    );
};

export default TraineeCard;
