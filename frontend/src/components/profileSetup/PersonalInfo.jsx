import { useNavigate } from "react-router-dom" 

function PersonalInfo() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/profile-setup/step2");
    };

    return (
        <div className="w-full max-w-lg">
            <div className="form-container rounded-xl p-8 border border-gray-100">
                {/* progress indicator */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">1</div>
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
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">4</div>
                            <p className="text-xs mt-2">Review</p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-1/4"></div>
                    </div>
                </div>

                {/* information form */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label for="full-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            id=""
                            name=""
                            type="text"
                            /* required */
                            defaultValue=""
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div>
                        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                        <input
                            id=""
                            name=""
                            type="date"
                            /* required */
                            defaultValue=""
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            id=""
                            name=""
                            /* required */
                            defaultValue=""
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="contact-number" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                        <input
                            id=""
                            name=""
                            type="tel"
                            /* required */
                            /* defaultValue={} */
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                            placeholder="+63 912 345 6789"
                        />
                    </div>
                    <div className="pt-4">
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

export default PersonalInfo;