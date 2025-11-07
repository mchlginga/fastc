import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    UserPlus,
    Eye,
    FileText,
    Shield,
    Search,
    Cpu,
    Users,
} from "react-feather";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Skeleton Component for loading states
const IndexSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section Skeleton */}
            <section className="gradient-bg text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="h-12 bg-white/20 rounded-lg animate-pulse mb-6 mx-auto max-w-2xl"></div>
                    <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-xl"></div>
                    <div className="h-12 bg-white/20 rounded-lg animate-pulse w-48 mx-auto"></div>
                </div>
            </section>

            {/* About Section Skeleton */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex items-center gap-12 bg-white rounded-xl shadow-sm p-8">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="rounded-xl bg-gray-200 w-full h-96 animate-pulse"></div>
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section Skeleton */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 mx-auto w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision Section Skeleton */}
            <section className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="h-10 bg-white/20 rounded animate-pulse mb-6 mx-auto w-48"></div>
                        <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-2xl"></div>
                        <div className="h-12 bg-white/20 rounded-lg animate-pulse w-40 mx-auto"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Features Grid Component
const FeatureCard = ({ icon, title, description, loading = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm transform hover:scale-105 transition duration-300 border border-gray-100">
        {loading ? (
            <>
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </>
        ) : (
            <>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    {icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </>
        )}
    </div>
);

// Image Component with Fallback
const AboutImage = () => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="rounded-xl bg-gray-100 w-full h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-4" />
                    <p>FAST-C Training Center</p>
                </div>
            </div>
        );
    }

    return (
        <img
            src="/pic.png"
            alt="Training session at FAST-C"
            className="rounded-xl shadow-lg object-cover w-full h-96"
            onError={() => setImageError(true)}
            loading="lazy"
        />
    );
};

const Index = () => {
    const [loading, setLoading] = useState(true);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: <UserPlus size={24} />,
            title: "Digital Registration & Profiling",
            desc: "Streamlined online registration and comprehensive digital profiles for trainees.",
        },
        {
            icon: <Eye size={24} />,
            title: "Facial Recognition Attendance",
            desc: "Secure and automated attendance tracking using facial recognition technology.",
        },
        {
            icon: <FileText size={24} />,
            title: "Automated Certificate Generation",
            desc: "Instant digital certificates upon course completion with verification capabilities.",
        },
        {
            icon: <Shield size={24} />,
            title: "Role-Based Access",
            desc: "Secure access for Admins, Companies, and Trainees with appropriate permissions.",
        },
        {
            icon: <Search size={24} />,
            title: "Searchable Trainee Profiles",
            desc: "Comprehensive profiles with skills, certifications, and training history for employers.",
        },
        {
            icon: <Cpu size={24} />,
            title: "AI-Powered Job Matching",
            desc: "Intelligent matching of trainees with relevant job opportunities based on skills.",
        },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <IndexSkeleton />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <section className="gradient-bg text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Fernandino Assessment & Skills Training
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Empowering Fernandinos with modern digital access,
                            verified certificates, and smarter job
                            opportunities.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center py-3 px-6 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-xs hover:shadow-sm"
                        >
                            Get Started{" "}
                            <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="md:flex items-center gap-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <AboutImage />
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                    About FAST-C
                                </h2>
                                <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        FAST-C (Fernandino Assessment and Skills
                                        Training Center) provides accessible,
                                        community-based training in fields like
                                        Dressmaking, Welding, Pastry, IT, and
                                        more. Every course completed earns a
                                        verified digital certificate — a gateway
                                        for employment and career growth.
                                    </p>
                                    <p>
                                        A City of San Fernando initiative via
                                        PESO, we support returning OFWs,
                                        low-income job seekers, and local
                                        trainees with skills development and
                                        certificates as proof of competence.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Core Features
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Discover how FAST-C transforms skills training
                                with modern technology and industry-focused
                                solutions.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard
                                    key={index}
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.desc}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="py-16 bg-green-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6">
                                Our Vision
                            </h2>
                            <p className="text-xl opacity-90 mb-8 leading-relaxed">
                                Bridging the gap between training and
                                employment, giving every Fernandino trainee a
                                digital identity and connecting them with job
                                opportunities through AI.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-medium bg-white text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-600 transition-all duration-300 shadow-xs hover:shadow-sm"
                            >
                                Join Now <UserPlus size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Index;
