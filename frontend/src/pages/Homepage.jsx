import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Menu, ArrowRight, UserPlus, Eye, FileText, Shield, Search, Cpu, Facebook, Mail, Linkedin, Twitter } from "react-feather";

const Homepage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        <div className="flex items-center">
                            <Award size={32} className="mr-2 text-blue-600"/>
                            <span className="text-xl font-bold text-gray-800">FAST-C</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-blue-600 font-medium">Home</Link>
                            <Link to="/" className="text-blue-600 font-medium">About</Link>
                            <Link to="/" className="text-blue-600 font-medium">Courses</Link>
                            <Link to="/" className="text-blue-600 font-medium">How To</Link>
                            <Link to="/login" className="text-blue-600 font-medium">Login</Link>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-gray-600 hover:cursor-pointer">
                                <Menu size={24}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobie Menu */}
                {isMenuOpen && ( 
                    <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-50">
                        <div className="flex flex-col items-center space-y-4 py-4">
                            <Link to="/" className="text-blue-600 font-medium" onClick={closeMenu}>Home</Link>
                            <Link to="/about" className="text-blue-600 font-medium" onClick={closeMenu}>About</Link>
                            <Link to="/courses" className="text-blue-600 font-medium" onClick={closeMenu}>Courses</Link>
                            <Link to="/how-to" className="text-blue-600 font-medium" onClick={closeMenu}>How To</Link>
                            <Link to="/login" className="text-blue-600 font-medium" onClick={closeMenu}>Login</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* hero section */}
            <section className="gradient-bg text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Fernandino Assessment & Skills Training</h1>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Empowering Fernandino trainees through modern digital access, verified certificates, and smarter job opportunities.</p>
                        <Link to="/register" className="inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-lg font-medium text-gray-700 btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-white hover:cursor-pointer">
                        Get Started<ArrowRight size={20} className="ml-2"/>
                        </Link>
                    </div>
                </div>
            </section>

            {/* about section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex items-center gap-12">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <img src="pic.png" alt="Training session" class="rounded-lg shadow-lg"></img>
                        </div>

                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">About FAST-C</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                FAST-C (Fernandino Assessment and Skills Training Center) provides accessible, community-based training in fields like Dressmaking, Welding, Pastry, IT, and more. Every course completed earns a verified digital certificate — a gateway for employment and career growth.
                            </p>
                            <p className="text-lg text-gray-600">
                                A City of San Fernando initiative via PESO, we support returning OFWs, low-income job seekers, and local trainees with skills development and certificates as proof of competence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Core Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <UserPlus size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Digital Registration & Profiling</h3>
                            <p className="text-gray-600">Streamlined online registration and comprehensive digital profiles for trainees.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <Eye size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Facial Recognition Attendance</h3>
                            <p className="text-gray-600">Secure and automated attendance tracking using facial recognition technology.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <FileText size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Automated Certificate Generation</h3>
                            <p className="text-gray-600">Instant digital certificates upon course completion with verification capabilities.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <Shield size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Role-Based Access</h3>
                            <p className="text-gray-600">Secure access for Admins, Companies, and Trainees with appropriate permissions.</p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <Search size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">Searchable Trainee Profiles</h3>
                            <p className="text-gray-600">Comprehensive profiles with skills, certifications, and training history for employers.</p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-6 rounded-xl shadow-sm feature-card transition duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <Cpu size={24}/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">AI-Powered Job Matching</h3>
                            <p className="text-gray-600">Intelligent matching of trainees with relevant job opportunities based on skills.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* vision section */}
            <section className="py-16 bg-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                        <p className="text-xl opacity-90">
                            "Our goal is to bridge the gap between training and employment — giving every Fernandino trainee a digital identity, and connecting them with job opportunities through AI."
                        </p>
                        <Link to="/register" className="btn-tertiary inline-flex items-center px-6 py-3 rounded-lg text-white font-medium mt-8">
                            Join Now
                            <UserPlus size={20} className="ml-2"/>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm opacity-80">
                            Developed for Fernandino Assessment and Skills Training Center (FAST-C), City of San Fernando, Pampanga — in partnership with PESO and local companies.
                        </p>  

                        <div className="mt-4 flex justify-center space-x-6">
                            <Link to="" className="text-gray-400 hover:text-white">
                                <Facebook size={20}/>
                            </Link>
                            <Link to="" className="text-gray-400 hover:text-white">
                                <Mail size={20}/>
                            </Link>
                            <Link to="" className="text-gray-400 hover:text-white">
                                <Linkedin size={20}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Homepage;