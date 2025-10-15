import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Award, Menu, X, User, Mail, Phone, ArrowUp } from "react-feather";
import { useAuth } from "../../context/AuthContext";

const CompanyHeaderFooter = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        closeDropdown();
        closeMenu();
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const confirmLogout = async () => {
        await handleLogout();
        closeLogoutModal();
        navigate("/login");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            {/* HEADER */}
            <header className="bg-white sticky top-0 mx-auto shadow-sm z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link
                        to="/company"
                        className="flex items-center cursor-pointer"
                    >
                        <Award size={32} className="text-blue-600 mr-2" />
                        <h1 className="text-xl font-bold text-gray-800">
                            FAST-C
                        </h1>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/company"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/company/profile"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                            }
                        >
                            Profile
                        </NavLink>
                        <div className="relative">
                            <div
                                className="h-8 w-8 ml-2 rounded-full bg-indigo-200 flex items-center justify-center cursor-pointer border-1 border-blue-600 hover:bg-indigo-300 transition duration-200"
                                onClick={toggleDropdown}
                            >
                                <User size={24} />
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md z-50">
                                    <NavLink
                                        to="/company/settings"
                                        onClick={closeDropdown}
                                        className="block px-4 py-2 text-gray-600 font-semibold hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                    >
                                        Settings
                                    </NavLink>
                                    <button
                                        onClick={openLogoutModal}
                                        className="block w-full text-left px-4 py-2 text-gray-600 font-semibold hover:bg-blue-50 hover:text-blue-600 transition duration-200 cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-blue-600 transition duration-200 cursor-pointer"
                            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-xl absolute top-16 left-0 w-full z-50">
                        <div className="flex flex-col items-center space-y-3 py-6">
                            <NavLink
                                to="/company"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                        : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                }
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/company/settings"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                        : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                }
                            >
                                Settings
                            </NavLink>
                            <button
                                onClick={openLogoutModal}
                                className="text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200 cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 backdrop-blur-lg bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Logout
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to sign out?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeLogoutModal}
                                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-md transition duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer transition duration-200"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* main content */}
            <main className="container mx-auto px-4 py-6 min-h-screen">
                <Outlet />
            </main>

            {/* footer */}
            <footer className="bg-gray-800 text-white shadow-md mt-6 relative">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-sm opacity-80">
                            Developed for Fernandino Assessment and Skills
                            Training Center (FAST-C), City of San Fernando,
                            Pampanga.
                        </p>
                        <div className="mt-4 flex justify-center space-x-6">
                            <a
                                href="mailto:cpesocsfp2023@gmail.com"
                                className="text-gray-400 hover:text-white transition duration-200"
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href="tel:0905-404-2950"
                                className="text-gray-400 hover:text-white transition duration-200"
                            >
                                <Phone size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 cursor-pointer"
                    aria-label="Back to Top"
                >
                    <ArrowUp size={20} />
                </button>
            </footer>
        </div>
    );
};

export default CompanyHeaderFooter;
