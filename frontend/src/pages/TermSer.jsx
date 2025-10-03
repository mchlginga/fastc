import { Link } from "react-router-dom";
import { Award } from "react-feather";

const TermSer = () => {
    return (
        <div className="min-h-screen  flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center justify-center mb-6">
                    <Award size={40} className="text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-800">FAST-C</h1>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Terms of Service
                </h2>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed space-y-4">
                    <p>
                        Welcome to Fernandino Assessment & Skills Training
                        (FAST-C). By using our platform, you agree to these
                        Terms of Service. Please read them carefully.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        1. Acceptance of Terms
                    </h3>
                    <p>
                        By accessing or using FAST-C, you agree to be bound by
                        these Terms of Service and our Privacy Policy. If you do
                        not agree, you may not use our services.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        2. Use of Services
                    </h3>
                    <p>
                        You agree to:
                        <ul className="list-disc pl-5">
                            <li>
                                Provide accurate information during
                                registration.
                            </li>
                            <li>Use the platform for lawful purposes only.</li>
                            <li>
                                Not share your account credentials with others.
                            </li>
                            <li>Not attempt to bypass security measures.</li>
                        </ul>
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        3. Account Responsibilities
                    </h3>
                    <p>
                        You are responsible for maintaining the confidentiality
                        of your account and password. Notify us immediately of
                        any unauthorized use at support@fastc.com.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        4. Intellectual Property
                    </h3>
                    <p>
                        All content on FAST-C, including text, graphics, and
                        software, is owned by or licensed to us and is protected
                        by copyright laws. You may not reproduce or distribute
                        content without permission.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        5. Termination
                    </h3>
                    <p>
                        We may suspend or terminate your account if you violate
                        these Terms. You may close your account at any time by
                        contacting support.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        6. Limitation of Liability
                    </h3>
                    <p>
                        FAST-C is provided "as is." We are not liable for any
                        damages arising from your use of the platform, including
                        job matching or training outcomes.
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800">
                        7. Changes to Terms
                    </h3>
                    <p>
                        We may update these Terms from time to time. Changes
                        will be posted here, and continued use of the platform
                        constitutes acceptance.
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

export default TermSer;
