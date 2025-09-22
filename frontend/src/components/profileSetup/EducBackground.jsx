import { useNavigate, Link } from "react-router-dom" 

function EducBackground() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/profile-setup/step3");
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
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">2</div>
                            <p className="text-xs mt-2">Education</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">3</div>
                            <p className="text-xs mt-2">Certificates</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">4</div>
                            <p className="text-xs mt-2">Review</p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-1/2"></div>
                    </div>
                </div>

                {/* information form */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Educational Background</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="education-level" className="block text-sm font-medium text-gray-700 mb-1">Highest Educational Attainment</label>
                        <select
                        id=""
                        name=""
                        /* required */
                        /* defaultValue={} */
                        className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        >
                        <option value="">Select Level</option>
                        <option value="high-school">High School</option>
                        <option value="vocational">Vocational</option>
                        <option value="college">College</option>
                        <option value="post-graduate">Post-Graduate</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="school-name" className="block text-sm font-medium text-gray-700 mb-1">School / Institution Name</label>
                        <input
                        id=""
                        name=""
                        type="text"
                        /* required */
                        /* defaultValue={} */
                        className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        placeholder="Enter school name"
                        />
                    </div>
                    <div>
                        <label htmlFor="year-graduated" className="block text-sm font-medium text-gray-700 mb-1">Year Graduated</label>
                        <input
                        id=""
                        name=""
                        type="number"
                        /* required */
                        d/* efaultValue={} */
                        className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        placeholder="e.g., 2020"
                        min="1900"
                        max="2025"
                        />
                    </div>
                    <div>
                        <label htmlFor="education-proof" className="block text-sm font-medium text-gray-700 mb-1">Upload Proof (Diploma/Certificate)</label>
                        <input
                            id=""
                            name=""
                            type="file"
                            /* required */
                            accept="image/*,.pdf"
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200
                            
                            file:mr-3 file:border file:py-1 file:px-2 file:bg-gray-100
                            "
                            />
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <Link 
                            to="/profile-setup/step1"
                            className="w-full btn-secondary flex justify-center py-3 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            className="w-full btn-primary flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>© 2025 FAST-C Digital Profiling System. All rights reserved.</p>
            </div>
        </div>
    );

};

export default EducBackground;