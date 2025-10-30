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

// Enhanced helper function to get full profile picture URL
const getProfilePicUrl = (profilePicPath) => {
    if (!profilePicPath) return null;

    // If it's already a full URL (http or https), return as is
    if (profilePicPath.startsWith("http")) {
        return profilePicPath;
    }

    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    // Remove leading slash if present to avoid double slashes
    const cleanPath = profilePicPath.startsWith("/")
        ? profilePicPath.slice(1)
        : profilePicPath;

    // Handle different path formats
    if (cleanPath.includes("profiles/")) {
        return `${backendUrl}/uploads/${cleanPath}`;
    }

    // Default path for profile pictures
    return `${backendUrl}/uploads/profiles/${cleanPath}`;
};

// Enhanced Profile Avatar Component with better error handling
const ProfileAvatar = ({ size = "md", onClick }) => {
    const { user } = useAuth();
    const [imageError, setImageError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 2;

    const profilePicUrl = user?.profilePic
        ? getProfilePicUrl(user.profilePic)
        : null;

    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-12 w-12 text-base",
    };

    const handleImageError = () => {
        console.warn("Failed to load profile image:", profilePicUrl);
        if (retryCount < maxRetries) {
            // Retry with a small delay
            setTimeout(() => {
                setRetryCount((prev) => prev + 1);
                setImageError(false);
            }, 300);
        } else {
            setImageError(true);
        }
    };

    const handleImageLoad = () => {
        setImageError(false);
        setRetryCount(0);
    };

    const handleClick = (e) => {
        if (imageError && retryCount >= maxRetries) {
            e.preventDefault();
            // Reset and retry on click if image previously failed
            setRetryCount(0);
            setImageError(false);
        }
        onClick?.(e);
    };

    // Reset error state when user or profilePic changes
    useEffect(() => {
        setImageError(false);
        setRetryCount(0);
    }, [user?.profilePic]);

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
            aria-label="User profile menu"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick(e);
                }
            }}
        >
            {/* Profile Image or Fallback */}
            {profilePicUrl && !imageError ? (
                <img
                    src={profilePicUrl}
                    alt="User profile"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    onLoad={handleImageLoad}
                    crossOrigin="anonymous"
                    loading="lazy"
                    key={`${profilePicUrl}-${retryCount}`} // Force re-render on retry
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-300 to-gray-400">
                    <User
                        size={size === "sm" ? 14 : size === "md" ? 18 : 24}
                        className="text-gray-600"
                    />
                </div>
            )}

            {/* Loading indicator for retries */}
            {retryCount > 0 && retryCount <= maxRetries && !imageError && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
};

const UserHeaderFooter = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const menuButtonRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsDropdownOpen(false);
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
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
        try {
            await handleLogout();
            closeLogoutModal();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            closeLogoutModal();
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* HEADER */}
            <header className="bg-white sticky top-0 shadow-sm z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link
                            to="/user"
                            className="flex items-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
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
                        <nav
                            className="hidden md:flex items-center space-x-8"
                            aria-label="Main navigation"
                        >
                            <NavLink
                                to="/user"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/user/courses"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Courses
                            </NavLink>
                            <NavLink
                                to="/user/certificates"
                                end
                                className={({ isActive }) =>
                                    `font-medium transition-all duration-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Certificates
                            </NavLink>

                            {/* Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <ProfileAvatar onClick={toggleDropdown} />

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2">
                                        {/* User Info */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <ProfileAvatar size="md" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                        {user?.firstName}{" "}
                                                        {user?.surname}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {user?.email}
                                                    </p>
                                                    <p className="text-xs text-blue-600 font-medium mt-1">
                                                        User Account
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <div className="p-2">
                                            <NavLink
                                                to="/user/profile"
                                                onClick={closeDropdown}
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer focus:outline-none focus:bg-blue-50"
                                            >
                                                <User
                                                    size={16}
                                                    className="mr-3"
                                                />
                                                My Profile
                                            </NavLink>
                                            <NavLink
                                                to="/user/settings"
                                                onClick={closeDropdown}
                                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer focus:outline-none focus:bg-blue-50"
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
                                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus:bg-red-50"
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
                        </nav>

                        {/* Mobile Menu Button */}
                        <div
                            className="md:hidden flex items-center"
                            ref={menuButtonRef}
                        >
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label={
                                    isMenuOpen ? "Close Menu" : "Open Menu"
                                }
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
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

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 w-full z-50 animate-in slide-in-from-top"
                    >
                        <nav
                            className="container mx-auto px-4 py-4 space-y-1"
                            aria-label="Mobile navigation"
                        >
                            <NavLink
                                to="/user"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/user/courses"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Courses
                            </NavLink>
                            <NavLink
                                to="/user/certificates"
                                end
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Certificates
                            </NavLink>
                            <NavLink
                                to="/user/profile"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                My Profile
                            </NavLink>
                            <NavLink
                                to="/user/settings"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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
                                className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Logout
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 container mx-auto px-4 py-6">
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
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full p-1"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href="tel:0905-404-2950"
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full p-1"
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
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer hover:scale-110"
                    aria-label="Back to Top"
                >
                    <ArrowUp size={20} />
                </button>
            </footer>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
                    <div
                        className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95"
                        role="dialog"
                        aria-labelledby="logout-modal-title"
                        aria-describedby="logout-modal-description"
                    >
                        <h2
                            id="logout-modal-title"
                            className="text-lg font-semibold text-gray-800 mb-3"
                        >
                            Confirm Logout
                        </h2>
                        <p
                            id="logout-modal-description"
                            className="text-gray-600 mb-6 text-sm"
                        >
                            Are you sure you want to logout of your account?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeLogoutModal}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

export default UserHeaderFooter;
