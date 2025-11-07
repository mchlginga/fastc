import { NavLink, Link } from "react-router-dom";
import { Facebook, Mail, Phone, ArrowUp, MapPin, Award } from "react-feather";

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-gray-800 text-white mt-auto relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <Link
                            to="/"
                            className="flex items-center justify-center md:justify-start mb-4 cursor-pointer group"
                        >
                            <Award
                                size={28}
                                className="text-blue-400 mr-2 group-hover:scale-110 transition-transform"
                            />
                            <h2 className="text-xl font-bold text-white">
                                FAST-C
                            </h2>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Empowering Fernandinos with modern digital access,
                            verified certificates, and smarter job
                            opportunities.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-white mb-4 text-lg">
                            Quick Links
                        </h3>
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                to="/about"
                                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                            >
                                About Us
                            </NavLink>
                            <NavLink
                                to="/courses"
                                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                            >
                                Our Courses
                            </NavLink>
                            <NavLink
                                to="/how-to"
                                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                            >
                                How to Get Started
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                            >
                                Login
                            </NavLink>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="text-center md:text-left">
                        <h3 className="font-semibold text-white mb-4 text-lg">
                            Contact Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start text-gray-300 text-sm">
                                <MapPin
                                    size={16}
                                    className="mr-2 text-blue-400 shrink-0"
                                />
                                <span>
                                    City College Building, San Fernando,
                                    Pampanga
                                </span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start text-gray-300 text-sm">
                                <Phone
                                    size={16}
                                    className="mr-2 text-blue-400 shrink-0"
                                />
                                <span>0905-404-2950</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start text-gray-300 text-sm">
                                <Mail
                                    size={16}
                                    className="mr-2 text-blue-400 shrink-0"
                                />
                                <span>cpesocsfp2023@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} FAST-C. All rights
                            reserved.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="mailto:cpesocsfp2023@gmail.com"
                                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                            <a
                                href="tel:0905-404-2950"
                                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                                aria-label="Phone"
                            >
                                <Phone size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer hover:scale-110"
                aria-label="Back to Top"
            >
                <ArrowUp size={20} />
            </button>
        </footer>
    );
};

export default Footer;
