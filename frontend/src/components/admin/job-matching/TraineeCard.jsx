const TraineeCard = ({ trainee, getMatchBadgeClass, hasFilters }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-lg">
                            {trainee.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {trainee.name}
                        </h3>
                        <p className="text-sm text-gray-500">{trainee.email}</p>
                        {trainee.contactNumber && (
                            <p className="text-xs text-gray-400">
                                {trainee.contactNumber}
                            </p>
                        )}
                    </div>
                </div>
                <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getMatchBadgeClass(
                        trainee.match.matchLevel
                    )}`}
                >
                    {trainee.match.score}% Match
                </span>
            </div>

            <div className="space-y-4">
                {/* Skills Section */}
                <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                        Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {trainee.match.factors?.skillDetails
                            ?.slice(0, 4)
                            .map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        {trainee.match.factors?.skillDetails?.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{trainee.match.factors.skillDetails.length - 4}{" "}
                                more
                            </span>
                        )}
                        {(!trainee.match.factors?.skillDetails ||
                            trainee.match.factors.skillDetails.length ===
                                0) && (
                            <span className="text-xs text-gray-400">
                                No verified skills
                            </span>
                        )}
                    </div>
                </div>

                {/* Certifications Section */}
                <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                        Certifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {trainee.certificates?.slice(0, 3).map((cert, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                                {cert.title}{" "}
                                {/* ← Changed from cert.name to cert.title */}
                            </span>
                        ))}
                        {trainee.certificates?.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{trainee.certificates.length - 3} more
                            </span>
                        )}
                        {(!trainee.certificates ||
                            trainee.certificates.length === 0) && (
                            <span className="text-xs text-gray-400">
                                No certificates
                            </span>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-gray-500">Availability</p>
                        <p className="font-medium text-gray-900">
                            {trainee.availability || "Not specified"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Certificates</p>
                        <p className="font-medium text-gray-900">
                            {trainee.certificates?.length || 0}
                        </p>
                    </div>
                </div>

                {/* AI Recommendation */}
                <div className="pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                        {hasFilters
                            ? "AI Recommended Role"
                            : "Suggested Category"}
                    </h4>
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold text-gray-900">
                            {trainee.match.category}
                        </p>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Confidence</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {trainee.match.score}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TraineeCard;
