import { Link } from "react-router-dom";
import { Award, TrendingUp } from "react-feather";

const CertificateCard = ({ certificate }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Award size={48} className="text-blue-300" />
        </div>
        <div className="p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                {certificate.title || "Certificate"}
            </h4>
            <p className="text-gray-600 text-xs">
                Completed:{" "}
                {certificate.completionDate
                    ? new Date(certificate.completionDate).toLocaleDateString()
                    : "Unknown date"}
            </p>
            {certificate.expirationDate && (
                <p className="text-gray-500 text-xs mt-1">
                    Expires:{" "}
                    {new Date(certificate.expirationDate).toLocaleDateString()}
                </p>
            )}
        </div>
    </div>
);

function RecentCertificates({ certificates }) {
    const recentCertificates = certificates.slice(0, 3);

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Recent Certificates
                </h3>
                {recentCertificates.length > 0 && (
                    <Link
                        to="/user/certificates"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        View All
                        <TrendingUp size={16} className="ml-1" />
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCertificates.map((cert, idx) => (
                    <CertificateCard
                        key={cert.id || cert._id || idx}
                        certificate={cert}
                    />
                ))}
                {recentCertificates.length === 0 && (
                    <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center border border-gray-100">
                        <Award
                            size={48}
                            className="mx-auto text-gray-300 mb-3"
                        />
                        <p className="text-gray-600 text-sm mb-2">
                            No certificates yet.
                        </p>
                        <p className="text-gray-500 text-xs">
                            Complete courses to earn certificates.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RecentCertificates;
