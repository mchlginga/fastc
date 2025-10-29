import { FileText } from "react-feather";

function CertificatesInfoBanner() {
    return (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <FileText size={20} className="text-blue-600 mt-1" />
                </div>
                <div className="ml-4">
                    <h4 className="text-blue-800 font-semibold mb-2">
                        About Your Certificates
                    </h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                        <li>
                            • Certificates are automatically generated when you
                            complete a course
                        </li>
                        <li>
                            • Each certificate includes a unique verification
                            code
                        </li>
                        <li>
                            • Certificates are valid for 1 year from completion
                            date
                        </li>
                        <li>
                            • Download and share your certificates with
                            employers
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CertificatesInfoBanner;
