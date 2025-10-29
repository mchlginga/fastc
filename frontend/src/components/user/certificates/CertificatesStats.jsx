import { FileText, Check, Award } from "react-feather";

function CertificatesStats({ certificates, completedEnrollmentsCount }) {
    const activeCertificates = certificates.filter(
        (cert) => cert.status === "active"
    ).length;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100">
                <div className="bg-blue-100 p-3 rounded-xl mr-4">
                    <FileText size={24} className="text-blue-600" />
                </div>
                <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-800">
                        {certificates.length}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                        Total Certificates
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <Check size={24} className="text-green-600" />
                </div>
                <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-800">
                        {activeCertificates}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                        Active Certificates
                    </p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100">
                <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <Award size={24} className="text-purple-600" />
                </div>
                <div className="text-right">
                    <h3 className="text-3xl font-bold text-gray-800">
                        {completedEnrollmentsCount}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">
                        Completed Courses
                    </p>
                </div>
            </div>
        </section>
    );
}

export default CertificatesStats;
