import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Award, Menu, X } from "react-feather";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white sticky top-0 shadow-sm z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center cursor-pointer group"
                    >
                        <Award
                            size={28}
                            className="text-blue-600 mr-2 group-hover:scale-110 transition-transform"
                        />
                        <h1 className="text-xl font-bold text-gray-800">
                            FAST-C
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/courses"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            Courses
                        </NavLink>
                        <NavLink
                            to="/how-to"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            How To
                        </NavLink>
                        <NavLink
                            to="/login"
                            end
                            className={({ isActive }) =>
                                `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            Login
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 w-full z-50 animate-in slide-in-from-top"
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
                        <NavLink
                            to="/"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/courses"
                            end
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            Courses
                        </NavLink>
                        <NavLink
                            to="/how-to"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
                            }
                        >
                            How To
                        </NavLink>
                        <NavLink
                            to="/login"
                            onClick={closeMenu}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                }`
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
