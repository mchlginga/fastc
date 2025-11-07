import { Link } from "react-router-dom";
import { Award, TrendingUp } from "react-feather";

// Format date to "June 2, 2023" format
const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const CertificateCard = ({ certificate }) => (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 overflow-hidden">
        <div className="h-32 bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Award size={32} className="text-blue-300" />
        </div>
        <div className="p-4">
            <h4 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2">
                {certificate.title || "Certificate"}
            </h4>
            <p className="text-gray-600 text-xs">
                Completed: {formatDate(certificate.completionDate)}
            </p>
            {certificate.expirationDate && (
                <p className="text-gray-500 text-xs mt-1">
                    Expires: {formatDate(certificate.expirationDate)}
                </p>
            )}
        </div>
    </div>
);

function RecentCertificates({ certificates }) {
    const recentCertificates = certificates.slice(0, 3);

    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Recent Certificates
                </h3>
                {recentCertificates.length > 0 && (
                    <Link
                        to="/user/certificates"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                        View All
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentCertificates.map((cert, idx) => (
                    <CertificateCard
                        key={cert.id || cert._id || idx}
                        certificate={cert}
                    />
                ))}
                {recentCertificates.length === 0 && (
                    <div className="col-span-full bg-white rounded-xl border border-gray-200 p-8 text-center">
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
