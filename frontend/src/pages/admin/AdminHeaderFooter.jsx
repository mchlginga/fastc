import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Award,
    Menu,
    X,
    User,
    Mail,
    Phone,
    ArrowUp,
    Settings,
    LogOut,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";

// Simple Profile Avatar Component
const ProfileAvatar = ({ size = "md", onClick }) => {
    const { user } = useAuth();
    const [imageError, setImageError] = useState(false);

    const profilePicUrl = user?.profilePic || null;

    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleClick = (e) => {
        if (imageError) {
            e.preventDefault();
            setImageError(false); // Retry loading
        }
        onClick?.(e);
    };

    return (
        <div
            className={`
                relative rounded-full flex items-center justify-center 
                cursor-pointer transition-all duration-200 
                border-2 border-blue-400 shadow-md
                hover:shadow-lg hover:scale-105
                ${sizeClasses[size]}
                ${profilePicUrl && !imageError ? "bg-gray-100" : "bg-gray-200"}
                overflow-hidden
            `}
            onClick={handleClick}
            role="button"
            aria-label="Admin profile menu"
            tabIndex={0}
        >
            {/* Profile Image or Fallback */}
            {profilePicUrl && !imageError ? (
                <img
                    src={profilePicUrl}
                    alt="Admin profile"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <User
                        size={size === "sm" ? 14 : 20}
                        className="text-gray-600"
                    />
                </div>
            )}
        </div>
    );
};

const AdminHeaderFooter = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        closeDropdown();
        closeMenu();
    };

    const closeLogoutModal = () => setIsLogoutModalOpen(false);

    const confirmLogout = async () => {
        await handleLogout();
        closeLogoutModal();
        navigate("/login");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* HEADER */}
            <header className="bg-white sticky top-0 shadow-sm z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo - Left Side */}
                        <Link
                            to="/admin"
                            className="flex items-center cursor-pointer group"
                        >
                            <Award
                                size={28}
                                className="text-blue-600 mr-2 group-hover:scale-110 transition-transform"
                            />
                            <h1 className="text-xl font-bold text-gray-800">
                                FAST-C Admin
                            </h1>
                        </Link>

                        {/* Desktop Navigation & Profile - Right Side (hidden on lg and below) */}
                        <div className="hidden xl:flex items-center space-x-8">
                            <NavLink
                                to="/admin/users"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Users
                            </NavLink>
                            <NavLink
                                to="/admin/courses"
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
                                to="/admin/enrollments"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Enrollments
                            </NavLink>
                            <NavLink
                                to="/admin/certificates"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Certificates
                            </NavLink>
                            <NavLink
                                to="/admin/job-match"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Job Matching
                            </NavLink>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <ProfileAvatar onClick={toggleDropdown} />

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2">
                                        {/* Admin Info */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <ProfileAvatar size="sm" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {user?.firstName}{" "}
                                                        {user?.surname}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                                        Administrator
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <div className="p-2">
                                            <NavLink
                                                to="/admin/profile"
                                                onClick={closeDropdown}
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <User
                                                    size={16}
                                                    className="mr-3"
                                                />
                                                My Profile
                                            </NavLink>
                                            <NavLink
                                                to="/admin/settings"
                                                onClick={closeDropdown}
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Settings
                                                    size={16}
                                                    className="mr-3"
                                                />
                                                Settings
                                            </NavLink>
                                            <div className="my-1 border-t border-gray-100"></div>
                                            <button
                                                onClick={openLogoutModal}
                                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <LogOut
                                                    size={16}
                                                    className="mr-3"
                                                />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hamburger Menu Button (shown on lg and below) */}
                        <div className="xl:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                aria-label={
                                    isMenuOpen ? "Close Menu" : "Open Menu"
                                }
                            >
                                {isMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu (shown on lg and below) */}
                {isMenuOpen && (
                    <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 w-full z-50 animate-in slide-in-from-top">
                        <div className="container mx-auto px-4 py-4 space-y-1">
                            <NavLink
                                to="/admin/users"
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
                                Users
                            </NavLink>
                            <NavLink
                                to="/admin/courses"
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
                                to="/admin/enrollments"
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
                                Enrollments
                            </NavLink>
                            <NavLink
                                to="/admin/certificates"
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
                                Certificates
                            </NavLink>
                            <NavLink
                                to="/admin/job-match"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Job Matching
                            </NavLink>
                            <NavLink
                                to="/admin/profile"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                My Profile
                            </NavLink>
                            <NavLink
                                to="/admin/settings"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Settings
                            </NavLink>
                            <div className="border-t border-gray-100 my-2"></div>
                            <button
                                onClick={openLogoutModal}
                                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 container mx-auto px-4 ">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="bg-gray-800 text-white mt-auto">
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
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href="tel:0905-404-2950"
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="Phone"
                            >
                                <Phone size={20} />
                            </a>
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

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">
                            Confirm Logout
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Are you sure you want to logout of your admin
                            account?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeLogoutModal}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHeaderFooter;
