import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, LogIn, Book, FileText, ArrowRight } from "react-feather";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Skeleton Component for loading states
const HowToSkeleton = () => {
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

            {/* Steps Section Skeleton */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 bg-gray-200 rounded animate-pulse mb-12 mx-auto w-64"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                                <div className="h-7 bg-gray-200 rounded animate-pulse mb-3 w-32 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section Skeleton */}
            <section className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto">
                        <div className="h-10 bg-white/20 rounded animate-pulse mb-6 mx-auto w-80"></div>
                        <div className="h-6 bg-white/20 rounded animate-pulse mb-8 mx-auto max-w-2xl"></div>
                        <div className="h-12 bg-white/20 rounded-lg animate-pulse w-48 mx-auto"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Step Card Component
const StepCard = ({ icon, title, description, loading = false }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105">
        {loading ? (
            <>
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                <div className="h-7 bg-gray-200 rounded animate-pulse mb-3 w-32 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
            </>
        ) : (
            <>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </>
        )}
    </div>
);

const HowTo = () => {
    const [loading, setLoading] = useState(true);

    // Simulate data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const steps = [
        {
            icon: <UserPlus size={24} />,
            title: "Register for an Account",
            desc: "Sign up to create your digital profile and explore our range of vocational courses tailored for your career goals.",
        },
        {
            icon: <LogIn size={24} />,
            title: "Log In to Your Dashboard",
            desc: "Access your trainee dashboard to manage courses, track progress, and view your digital certificates.",
        },
        {
            icon: <Book size={24} />,
            title: "Enroll in a Course",
            desc: "Choose from hands-on courses like Welding, IT, or Dressmaking to gain practical skills for employment.",
        },
        {
            icon: <FileText size={24} />,
            title: "Earn Your Certificate",
            desc: "Complete your course and receive a verified digital certificate to boost your employability.",
        },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <HowToSkeleton />
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
                            How to Get Started
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Follow these simple steps to join FAST-C, enroll in
                            courses, and earn verified digital certificates to
                            kickstart your career.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center py-3 px-6 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-xs hover:shadow-sm"
                        >
                            Start Now <ArrowRight size={20} className="ml-2" />
                        </Link>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-16 ">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Your Path to Success
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Follow these simple steps to begin your skills
                                training journey with FAST-C
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={index}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.desc}
                                    loading={loading}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call-to-Action Section */}
                <section className="py-16 bg-green-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6">
                                Ready to Take the First Step?
                            </h2>
                            <p className="text-xl opacity-90 mb-8 leading-relaxed max-w-2xl mx-auto">
                                Join FAST-C today and start your journey toward
                                new skills and career opportunities with our
                                seamless digital platform.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-medium bg-white text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-600 transition-all duration-300 shadow-xs hover:shadow-sm"
                            >
                                Get Started{" "}
                                <ArrowRight size={20} className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default HowTo;
