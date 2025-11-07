import { Link } from "react-router-dom";
import { Award, Book, Search } from "react-feather";

function CertificatesEmptyState({ searchTerm = "" }) {
    if (searchTerm) {
        return (
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
                <Search size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Certificates Found
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    No certificates match your search criteria. Try adjusting
                    your search terms or filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-8 text-center">
            <Award size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Certificates Yet
            </h3>
            <p className="text-gray-600 text-sm mb-4">
                Complete courses to earn certificates that showcase your skills
                and achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                    to="/user/courses"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center shadow-xs hover:shadow-sm"
                >
                    <Book size={16} className="mr-2" />
                    Browse Courses
                </Link>
                <Link
                    to="/user/courses?status=completed"
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-6 py-2.5 rounded-lg text-sm font-medium transition inline-flex items-center justify-center"
                >
                    View Completed Courses
                </Link>
            </div>
        </div>
    );
}

export default CertificatesEmptyState;
