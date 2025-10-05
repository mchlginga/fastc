import { Link } from "react-router-dom";
import { Award } from "react-feather";

const TermSer = () => {
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
                    Terms of Service
                </h2>

                {/* Content */}
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-5">
                    <p>
                        Welcome to{" "}
                        <strong>
                            Fernandino Assessment & Skills Training (FAST-C)
                        </strong>
                        . By using our platform, you agree to these Terms of
                        Service. Please read them carefully.
                    </p>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            1. Acceptance of Terms
                        </h3>
                        <p>
                            By accessing or using FAST-C, you agree to be bound
                            by these Terms of Service and our Privacy Policy. If
                            you do not agree, you may not use our services.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            2. Use of Services
                        </h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                Provide accurate information during
                                registration.
                            </li>
                            <li>Use the platform for lawful purposes only.</li>
                            <li>
                                Do not share your account credentials with
                                others.
                            </li>
                            <li>Do not attempt to bypass security measures.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            3. Account Responsibilities
                        </h3>
                        <p>
                            You are responsible for maintaining the
                            confidentiality of your account and password. Notify
                            us immediately of any unauthorized use at
                            <span className="text-blue-600">
                                {" "}
                                support@fastc.com
                            </span>
                            .
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            4. Intellectual Property
                        </h3>
                        <p>
                            All content on FAST-C, including text, graphics, and
                            software, is owned by or licensed to us and is
                            protected by copyright laws. You may not reproduce
                            or distribute content without permission.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            5. Termination
                        </h3>
                        <p>
                            We may suspend or terminate your account if you
                            violate these Terms. You may close your account at
                            any time by contacting support.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            6. Limitation of Liability
                        </h3>
                        <p>
                            FAST-C is provided “as is.” We are not liable for
                            any damages arising from your use of the platform,
                            including job matching or training outcomes.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            7. Changes to Terms
                        </h3>
                        <p>
                            We may update these Terms from time to time. Changes
                            will be posted here, and continued use of the
                            platform constitutes acceptance.
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

export default TermSer;
