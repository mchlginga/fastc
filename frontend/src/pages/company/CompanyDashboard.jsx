import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    Award,
    Home,
    Search,
    Bookmark,
    User,
    LogOut,
    Menu,
    Edit,
    ChevronRight,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const CompanyDashboard = () => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const onLogout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`sidebar bg-white w-64 shadow-sm ${
                    isSidebarOpen ? "block" : "hidden md:block"
                }`}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-800">
                            FAST-C Company
                        </span>
                    </div>
                </div>
                <nav className="p-4 space-y-1">
                    <NavLink
                        to="/company"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <Home size={20} className="mr-3" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/company/trainees"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <Search size={20} className="mr-3" />
                        Search Trainees
                    </NavLink>
                    <NavLink
                        to="/company/shortlist"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <Bookmark size={20} className="mr-3" />
                        Shortlist
                    </NavLink>
                    <NavLink
                        to="/company/profile"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <User size={20} className="mr-3" />
                        Profile
                    </NavLink>
                    <button
                        onClick={onLogout}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg w-full text-left"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="md:hidden">
                            <button
                                className="text-gray-600"
                                onClick={toggleSidebar}
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <img
                                    src="/pic.png"
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="ml-2 text-sm font-medium">
                                    {user?.companyName || "Juan Company"}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Outlet />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="/pic.png"
                                        alt="Company Profile"
                                        className="w-16 h-16 rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h2 className="font-semibold text-gray-800">
                                            {user?.companyName ||
                                                "Juan Construction"}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {user?.email ||
                                                "juanconstruction@gmail.com"}
                                        </p>
                                    </div>
                                </div>
                                <NavLink
                                    to="/company/profile"
                                    className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Profile
                                </NavLink>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Recent Shortlists
                                    </h2>
                                    <NavLink
                                        to="/company/shortlist"
                                        className="text-sm text-blue-600 flex items-center"
                                    >
                                        View All
                                        <ChevronRight
                                            size={16}
                                            className="ml-1"
                                        />
                                    </NavLink>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                            <User
                                                size={24}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">
                                                Maria Santos
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Welding NC II • Added Sep 18,
                                                2025
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3">
                                            <User
                                                size={24}
                                                className="text-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">
                                                Pedro Lim
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Electrical NC II • Added Sep 17,
                                                2025
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
                    <p className="text-xs text-center text-gray-500">
                        Developed for Fernandino Assessment and Skills Training
                        Center (FAST-C), City of San Fernando, Pampanga — in
                        partnership with PESO and local companies.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default CompanyDashboard;
