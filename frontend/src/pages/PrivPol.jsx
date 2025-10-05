import { Link } from "react-router-dom";
import { Award } from "react-feather";

const PrivPol = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Privacy Policy
                </h2>

                {/* Content */}
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-5">
                    <p>
                        At{" "}
                        <strong>
                            Fernandino Assessment & Skills Training (FAST-C)
                        </strong>
                        , we are committed to protecting your privacy. This
                        Privacy Policy explains how we collect, use, disclose,
                        and safeguard your personal information when you use our
                        platform.
                    </p>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            1. Information We Collect
                        </h3>
                        <p>
                            We collect information you provide, such as your
                            name, email address, and profile details, to offer
                            AI-powered job matching and training services. We
                            also collect usage data (like browsing activity) to
                            improve our platform.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            2. How We Use Your Information
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
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
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            3. Sharing Your Information
                        </h3>
                        <p>
                            We may share your information with trusted partners
                            (e.g., employers or training providers) for job
                            matching, but only with your consent. We do not sell
                            your data to third parties.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            4. Data Security
                        </h3>
                        <p>
                            We use industry-standard measures to protect your
                            data, including encryption and secure storage.
                            However, no system is completely secure, and we
                            cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            5. Your Rights
                        </h3>
                        <p>
                            You have the right to access, update, or delete your
                            personal information. Contact us at{" "}
                            <span className="text-blue-600">
                                support@fastc.com
                            </span>
                            to exercise these rights.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            6. Changes to This Policy
                        </h3>
                        <p>
                            We may update this Privacy Policy from time to time.
                            Changes will be posted on this page, and we will
                            notify you of significant updates.
                        </p>
                        <p>
                            For questions, contact us at{" "}
                            <span className="text-blue-600">
                                support@fastc.com
                            </span>
                            .
                        </p>
                    </section>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-600">
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
