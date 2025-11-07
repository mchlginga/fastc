import { FileText, Shield, Download, Clock } from "react-feather";

function CertificatesInfoBanner() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
                <div className="shrink-0">
                    <FileText size={20} className="text-blue-600 mt-1" />
                </div>
                <div className="ml-4 flex-1">
                    <h4 className="text-blue-800 font-semibold mb-3">
                        About Your Certificates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <Download size={12} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-blue-700 text-sm font-medium mb-1">
                                    Download & Share
                                </p>
                                <p className="text-blue-600 text-xs">
                                    Download and share your certificates with
                                    employers and colleagues
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <Shield size={12} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-blue-700 text-sm font-medium mb-1">
                                    Verification
                                </p>
                                <p className="text-blue-600 text-xs">
                                    Each certificate includes a unique
                                    verification code for authenticity
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <Clock size={12} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-blue-700 text-sm font-medium mb-1">
                                    Validity Period
                                </p>
                                <p className="text-blue-600 text-xs">
                                    Certificates are valid for 1 year from
                                    completion date
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                <FileText size={12} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-blue-700 text-sm font-medium mb-1">
                                    Automatic Generation
                                </p>
                                <p className="text-blue-600 text-xs">
                                    Certificates are automatically generated
                                    when you complete a course
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CertificatesInfoBanner;
