import { Link } from "react-router-dom";
import { Award } from "react-feather";

const PrivPol = () => {
    return (
        <div className="min-h-screen  flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Privacy Policy
                </h2>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>
                        At Fernandino Assessment & Skills Training (FAST-C), we
                        are committed to protecting your privacy. This Privacy
                        Policy explains how we collect, use, disclose, and
                        safeguard your personal information when you use our
                        platform.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        1. Information We Collect
                    </h3>
                    <p>
                        We collect information you provide, such as your name,
                        email address, and profile details, to offer AI-powered
                        job matching and training services. We also collect
                        usage data, like browsing activity, to improve our
                        platform.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        2. How We Use Your Information
                    </h3>
                    <p>
                        Your information is used to:
                        <ul className="list-disc pl-5">
                            <li>
                                Facilitate account creation and authentication.
                            </li>
                            <li>
                                Provide personalized job and training
                                recommendations.
                            </li>
                            <li>Communicate updates and notifications.</li>
                            <li>Improve our services and ensure security.</li>
                        </ul>
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        3. Sharing Your Information
                    </h3>
                    <p>
                        We may share your information with trusted partners
                        (e.g., employers or training providers) for job
                        matching, but only with your consent. We do not sell
                        your data to third parties.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        4. Data Security
                    </h3>
                    <p>
                        We use industry-standard measures to protect your data,
                        including encryption and secure storage. However, no
                        system is completely secure, and we cannot guarantee
                        absolute security.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        5. Your Rights
                    </h3>
                    <p>
                        You have the right to access, update, or delete your
                        personal information. Contact us at support@fastc.com to
                        exercise these rights.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        6. Changes to This Policy
                    </h3>
                    <p>
                        We may update this Privacy Policy from time to time.
                        Changes will be posted on this page, and we will notify
                        you of significant updates.
                    </p>
                    <p>For questions, contact us at support@fastc.com.</p>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Back to{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default PrivPol;
