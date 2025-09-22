import { useNavigate, Link } from "react-router-dom" 

function Certificates() {
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/profile-setup/step4");
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
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">3</div>
                            <p className="text-xs mt-2">Certificates</p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">4</div>
                            <p className="text-xs mt-2">Review</p>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div className="bg-blue-600 h-1 rounded-full w-3/4"></div>
                    </div>
                </div>

                {/* information form */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Certificates (Optional)</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="certificate-file" className="block text-sm font-medium text-gray-700 mb-1">Upload FAST-C Certificate</label>
                        <input
                            id=""
                            name=""
                            type="file"
                            accept="image/*,.pdf"
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="certificate-title" className="block text-sm font-medium text-gray-700 mb-1">Certificate Title</label>
                        <input
                            id=""
                            name=""
                            type="text"
                            /* defaultValue={} */
                            className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                            placeholder="e.g., Welding NC II"
                        />
                    </div>
                    <div>
                    <label htmlFor="certificate-expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                    <input
                        id=""
                        name=""
                        type="date"
                        /* defaultValue={} */
                        className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none transition duration-200"
                    />
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <Link
                            to="/profile-setup/step2"
                            className="w-full btn-secondary flex justify-center py-3 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                        >
                            Back
                        </Link>
                        <button
                            type="button"
                            onClick={navigate("/user")}
                            className="w-full btn-secondary flex justify-center py-3 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700"
                        >
                            Skip
                        </button>
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

export default Certificates;