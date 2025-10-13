import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Award, Menu, X } from "react-feather";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    return (
        <header className="bg-white sticky top-0 mx-auto shadow-sm z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center cursor-pointer">
                    <Award size={32} className="text-blue-600 mr-2" />
                    <h1 className="text-xl font-bold text-gray-800">FAST-C</h1>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                        }
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/courses"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                        }
                    >
                        Courses
                    </NavLink>
                    <NavLink
                        to="/how-to"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
                        }
                    >
                        How To
                    </NavLink>
                    <NavLink
                        to="/login"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                                : "text-gray-600 font-semibold hover:text-blue-600 transition duration-200"
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

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-xl absolute top-16 left-0 w-full z-50">
                    <div className="flex flex-col items-center space-y-3 py-6">
                        <NavLink
                            to="/"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
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
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
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
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            Courses
                        </NavLink>
                        <NavLink
                            to="/how-to"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            How To
                        </NavLink>
                        <NavLink
                            to="/login"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                isActive
                                    ? "text-blue-600 font-semibold text-lg w-full text-center py-2 bg-blue-50"
                                    : "text-gray-600 font-semibold text-lg w-full text-center py-2 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                            }
                        >
                            Login
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
