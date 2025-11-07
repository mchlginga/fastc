import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    ArrowRight,
    Users,
    Target,
    Eye,
} from "react-feather";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Skeleton Component for loading states
const AboutSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section Skeleton */}
            <section className="gradient-bg text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="h-12 bg-white/20 rounded-lg animate-pulse mb-6 mx-auto max-w-2xl"></div>
                    <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-xl"></div>
                </div>
            </section>

            {/* About Section Skeleton */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex items-center gap-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="rounded-xl bg-gray-200 w-full h-96 animate-pulse"></div>
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-40 mt-4"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section Skeleton */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 mx-auto w-64"></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[...Array(2)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="h-7 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section Skeleton */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 mx-auto w-64"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section Skeleton */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 mx-auto w-48"></div>
                    <div className="md:flex gap-12">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mr-3"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="bg-gray-200 rounded-xl w-full h-96 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Card Components (consistent with AdminUsers patterns)
const MissionVisionCard = ({ title, content, icon, loading = false }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        {loading ? (
            <>
                <div className="h-7 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </>
        ) : (
            <>
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3 text-blue-600">
                        {icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{content}</p>
            </>
        )}
    </div>
);

const StepCard = ({ step, description, number, loading = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105">
        {loading ? (
            <>
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </>
        ) : (
            <>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-lg">
                    {number}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {step}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </p>
            </>
        )}
    </div>
);

// Image Component with Fallback
const AboutImage = ({ src, alt }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="rounded-xl bg-gray-100 w-full h-96 flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-4" />
                    <p>{alt}</p>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="rounded-xl shadow-lg object-cover w-full h-96"
            onError={() => setImageError(true)}
            loading="lazy"
        />
    );
};

const About = () => {
    const [loading, setLoading] = useState(true);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const missionVisionData = [
        {
            title: "Mission",
            content:
                "We commit to improve the quality of life of Fernandinos, regardless of their gender, age, or physical ability, through the judicious use of government resources, in partnership with the private sector and the active participation of the citizenry.",
            icon: <Target size={20} />,
        },
        {
            title: "Vision",
            content:
                "The City of San Fernando (P) will be a model city in social development where citizens live in a healthy, safe, and sustainable environment with sufficient economic opportunities and rich cultural heritage; with stronger public governance institutions, responsible citizenry, and a smart sustainable city.",
            icon: <Eye size={20} />,
        },
    ];

    const stepsData = [
        {
            step: "Register",
            description:
                "Create your account and complete your digital profile with essential information.",
        },
        {
            step: "Verify",
            description:
                "Complete identity verification for secure platform access and attendance tracking.",
        },
        {
            step: "Enroll Course",
            description:
                "Choose from a variety of vocational courses tailored to industry demands.",
        },
        {
            step: "Get Certificate",
            description:
                "Earn a verified digital certificate upon successful course completion.",
        },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <AboutSkeleton />
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
                            About FAST-C
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Empowering Fernandinos with skills and opportunities
                            through innovative training and digital
                            certification.
                        </p>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="md:flex items-center gap-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <AboutImage
                                    src="/picA.png"
                                    alt="FAST-C Training Center and Team"
                                />
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                    Our Story
                                </h2>
                                <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        The Fernandino Assessment and Skills
                                        Training Center (FAST-C), established by
                                        the City of San Fernando, Pampanga
                                        through its Public Employment Services
                                        Office (PESO), provides accessible
                                        technical and vocational training to
                                        empower local workers, particularly
                                        returning Overseas Filipino Workers
                                        (OFWs) and low-income job seekers.
                                    </p>
                                    <p>
                                        Offering courses in Dressmaking, Massage
                                        Therapy, Welding, IT, and more, FAST-C
                                        equips trainees with verified digital
                                        certificates to enhance employability.
                                        Our mission is to bridge the gap between
                                        training and employment with a modern
                                        digital platform.
                                    </p>
                                </div>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center mt-6 py-3 px-6 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-xs hover:shadow-sm"
                                >
                                    Join Now{" "}
                                    <ArrowRight size={20} className="ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Mission & Vision
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Guiding principles that drive our commitment to
                                community development and empowerment.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            {missionVisionData.map((item, index) => (
                                <MissionVisionCard
                                    key={index}
                                    title={item.title}
                                    content={item.content}
                                    icon={item.icon}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                How It Works
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Simple steps to start your skills training
                                journey with FAST-C
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stepsData.map((item, index) => (
                                <StepCard
                                    key={index}
                                    step={item.step}
                                    description={item.description}
                                    number={index + 1}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Us Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Contact Us
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Get in touch with us for inquiries, support, or
                                partnership opportunities
                            </p>
                        </div>
                        <div className="md:flex gap-12">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-start mb-6">
                                        <MapPin
                                            size={24}
                                            className="text-blue-600 mr-4 mt-1 shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                Address
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                City College Building, Magdalena
                                                Street, San Juan, City of San
                                                Fernando, Pampanga
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start mb-6">
                                        <Phone
                                            size={24}
                                            className="text-blue-600 mr-4 mt-1 shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                Phone
                                            </h3>
                                            <p className="text-gray-600">
                                                0905-404-2950
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Mail
                                            size={24}
                                            className="text-blue-600 mr-4 mt-1 shrink-0"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                Email
                                            </h3>
                                            <p className="text-gray-600">
                                                cpesocsfp2023@gmail.com
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3852.0422953762286!2d120.68331541478368!3d15.028441189463673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396f2e6e5e7b5d9%3A0x6b8b6b7e7f7b7b7b!2sCity%20College%20of%20San%20Fernando!5e0!3m2!1sen!2sph!4v1695701234567!5m2!1sen!2sph"
                                        className="w-full h-96"
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="FAST-C Location Map"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default About;
