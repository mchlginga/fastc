import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Award, Menu, X, User, Mail, Phone } from "react-feather";
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

    return (
        <div>
            {/* HEADER */}
            <header className="bg-white sticky top-0 mx-auto px-4 sm:px-6 lg:px-8 shadow-sm z-50">
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
                            to="/company/shortlist"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                    : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                            }
                        >
                            Shortlist
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
                                        to="/company/profile"
                                        onClick={closeDropdown}
                                        className="block px-4 py-2 text-gray-600 font-semibold hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                    >
                                        Profile
                                    </NavLink>
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
                                to="/company/shortlist"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                        : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                }
                            >
                                Shortlist
                            </NavLink>
                            <NavLink
                                to="/company/profile"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                        : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                                }
                            >
                                Profile
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
                <div className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-10 flex items-center justify-center z-50">
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
            <main className="container mx-auto px-4 py-8 min-h-screen">
                <Outlet />
            </main>

            {/* footer */}
            <footer className="bg-white shadow-md mt-12">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Award size={24} className="text-blue-600 mr-2" />
                            <span className="text-lg font-bold text-gray-800">
                                FAST-C
                            </span>
                        </div>
                        <div className="flex space-x-6">
                            <a
                                href="mailto:cpesocsfp2023@gmail.com"
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <Mail size={24} />
                            </a>
                            <a
                                href="tel:0905-404-2950"
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <Phone size={24} />
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-gray-400 mt-8 pt-8 text-center text-gray-500 text-sm">
                        <p>© 2025 FAST-C. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CompanyHeaderFooter;
