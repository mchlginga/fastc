import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Award, Menu, X } from "react-feather";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <Award size={32} className="text-blue-600" />
                        <span className="text-xl font-bold text-gray-800 tracking-tight">
                            FAST-C
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition duration-200"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition duration-200"
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/courses"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition duration-200"
                            }
                        >
                            Courses
                        </NavLink>
                        <NavLink
                            to="/how-to"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition duration-200"
                            }
                        >
                            How To
                        </NavLink>
                        <NavLink
                            to="/login"
                            end
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                                    : "text-gray-600 font-semibold hover:text-blue-600 hover:border-b-2 hover:border-blue-600 pb-1 transition duration-200"
                            }
                        >
                            Login
                        </NavLink>
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
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-xl absolute top-16 left-0 w-full z-50 animate-slide-in">
                    <div className="flex flex-col items-center space-y-3 py-6">
                        <NavLink
                            to="/"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/courses"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            Courses
                        </NavLink>
                        <NavLink
                            to="/how-to"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            How To
                        </NavLink>
                        <NavLink
                            to="/login"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            Login
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
