import { useNavigate, Link } from "react-router-dom"
import { Edit } from "react-feather";

function Review() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/user");
    };

    return (
        <div className="w-full max-w-lg">
            <div className="form-container rounded-xl p-8 border border-gray-100">
                {/* progress indicator */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">1</div>
                            <p className="text-xs mt-2">Personal Info</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">2</div>
                            <p className="text-xs mt-2">Education</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">3</div>
                            <p className="text-xs mt-2">Certificates</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">4</div>
                            <p className="text-xs mt-2">Review</p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-full"></div>
                    </div>
                </div>

                {/* section dito */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Review & Finish</h3>
                <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
                            
                            <Link to="/profile-setup/step1" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                <Edit size={16} className="mr-1" />
                                Edit
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Full Name:</span> {/* profileData.personal.fullName || */ 'N/A'}</p>
                            <p><span className="font-medium">Birthdate:</span> {/* profileData.personal.birthdate || */ 'N/A'}</p>
                            <p><span className="font-medium">Gender:</span> {/* profileData.personal.gender || */ 'N/A'}</p>
                            <p><span className="font-medium">Address:</span> {/* profileData.personal.address || */ 'N/A'}</p>
                            <p><span className="font-medium">Contact Number:</span> {/* profileData.personal.contactNumber || */ 'N/A'}</p>
                        </div>
                    </div> 
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Educational Background</h4>
                            
                            <Link to="/profile-setup/step2" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                <Edit size={16} className="mr-1" />
                                Edit
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Highest Educational Attainment:</span> {/* profileData.personal.fullName || */ 'N/A'}</p>
                            <p><span className="font-medium">School Name:</span> {/* profileData.personal.birthdate || */ 'N/A'}</p>
                            <p><span className="font-medium">Year Graduated:</span> {/* profileData.personal.gender || */ 'N/A'}</p>
                            <p><span className="font-medium">Proof Uploaded:</span> {/* profileData.personal.address || */ 'N/A'}</p>
                        </div>
                    </div> 
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">Certificates</h4>
                            
                            <Link to="/profile-setup/step3" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
                                <Edit size={16} className="mr-1" />
                                Edit
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Certificate:</span> {/* profileData.personal.fullName || */ 'N/A'}</p>
                            <p><span className="font-medium">Certificate Title:</span> {/* profileData.personal.birthdate || */ 'N/A'}</p>
                            <p><span className="font-medium">Expiry Date:</span> {/* profileData.personal.gender || */ 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <Link
                            to="/profile-setup/step3"
                            className="w-full btn-secondary flex justify-center py-3 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                        >
                            Back
                        </Link>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full btn-primary flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Finish Setup
                        </button>
                    </div>
                </div>

                
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>© 2025 FAST-C Digital Profiling System. All rights reserved.</p>
            </div>
        </div>
    );

};

export default Review;