import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import {
    Award,
    Home,
    Book,
    FileText,
    User,
    LogOut,
    Menu,
    MapPin,
    Phone,
    Calendar,
    Edit,
    Users,
    Search,
    X,
    Bookmark,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        closeMobileMenu();
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const confirmLogout = async () => {
        try {
            await handleLogout();
            closeLogoutModal();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="sidebar bg-white w-64 shadow-lg hidden md:block border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <Link to="/admin" className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-800">
                            FAST-C
                        </span>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    <NavLink
                        to="/company"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                        }
                    >
                        <Home size={20} className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/company/trainees"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                        }
                    >
                        <Search size={20} className="mr-3" />
                        Search Trainees
                    </NavLink>
                    <NavLink
                        to="/company/shortlist"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                        }
                    >
                        <Bookmark size={20} className="mr-3" />
                        Shortlist
                    </NavLink>
                    <NavLink
                        to="/company/profile"
                        className={({ isActive }) =>
                            isActive
                                ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                        }
                    >
                        <User size={20} className="mr-3" />
                        Profile
                    </NavLink>
                    <button
                        onClick={openLogoutModal}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg w-full text-left transition duration-200 cursor-pointer"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-gray-600 hover:text-blue-600 transition duration-200 cursor-pointer"
                                aria-label={
                                    isMobileMenuOpen
                                        ? "Close Menu"
                                        : "Open Menu"
                                }
                            >
                                {isMobileMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                        <div className="hidden md:block"></div>
                        <div className="flex items-center space-x-3"></div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-white shadow-xl border-t border-gray-200">
                            <div className="flex flex-col space-y-1 py-4 px-4">
                                <NavLink
                                    to="/admin"
                                    end
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <Home size={20} className="mr-3" />
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/admin/users"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <Users size={20} className="mr-3" />
                                    Users
                                </NavLink>
                                <NavLink
                                    to="/admin/courses"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <Book size={20} className="mr-3" />
                                    Courses
                                </NavLink>
                                <NavLink
                                    to="/admin/certificates"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <FileText size={20} className="mr-3" />
                                    Certificates
                                </NavLink>
                                <NavLink
                                    to="/admin/job-match"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <Search size={20} className="mr-3" />
                                    Job Matching
                                </NavLink>
                                <NavLink
                                    to="/admin/profile"
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "flex items-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg transition duration-200"
                                            : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition duration-200"
                                    }
                                >
                                    <User size={20} className="mr-3" />
                                    Profile
                                </NavLink>
                                <button
                                    onClick={openLogoutModal}
                                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg w-full text-left transition duration-200 cursor-pointer"
                                >
                                    <LogOut size={20} className="mr-3 " />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                <main className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2">
                            <Outlet />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <img
                                        src="/pic.png"
                                        alt="Profile"
                                        className="h-16 w-16 rounded-full object-cover shadow-lg border-2 border-blue-100"
                                    />
                                    <div className="ml-4">
                                        <h2 className="font-semibold text-lg text-gray-800"></h2>
                                        <p className="font-semibold text-md text-gray-800">
                                            {user?.email}
                                        </p>
                                        <span className="inline-block mt-1 px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                            {user?.role === "superAdmin"
                                                ? "Super Admin"
                                                : "Admin"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition duration-200">
                                        <MapPin
                                            size={18}
                                            className="text-blue-600 mr-3"
                                        />
                                        <span className="text-gray-700">
                                            {user?.city || "San Fernando"},{" "}
                                            {user?.country || "Philippines"}
                                        </span>
                                    </div>
                                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition duration-200">
                                        <Phone
                                            size={18}
                                            className="text-blue-600 mr-3"
                                        />
                                        <span className="text-gray-700">
                                            {user?.phone || "+63 912 345 6789"}
                                        </span>
                                    </div>
                                    <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition duration-200">
                                        <Calendar
                                            size={18}
                                            className="text-blue-600 mr-3"
                                        />
                                        <span className="text-gray-700">
                                            Joined: January 2025
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to="/admin/profile"
                                    className="mt-6 w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 shadow-sm"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t border-gray-200 py-6 px-6 mt-8">
                    <p className="text-xs text-center text-gray-500">
                        Developed for Fernandino Assessment and Skills Training
                        Center (FAST-C), City of San Fernando, Pampanga — in
                        partnership with PESO and local companies.
                    </p>
                </footer>
            </div>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirm Logout
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to sign out?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeLogoutModal}
                                className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition duration-200 cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
