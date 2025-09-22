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
} from "react-feather";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();

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
            {/* side bar */}
            <div className="sidebar bg-white w-64 shadow-sm hidden md:block">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-800">
                            FAST-C
                        </span>
                    </div>
                </div>
                {/* navigation */}
                <nav className="p-4 space-y-1">
                    <NavLink
                        to="/user"
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
                        to="/user/courses"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <Book size={20} className="mr-3" />
                        Courses
                    </NavLink>
                    <NavLink
                        to="/user/certificates"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-active flex items-center px-4 py-3 text-sm font-medium rounded-lg"
                                : "flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg"
                        }
                    >
                        <FileText size={20} className="mr-3" />
                        Certificates
                    </NavLink>
                    <NavLink
                        to="/user/profile"
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

            {/* main content */}
            <div className="flex-1 overflow-auto">
                {/* top navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4">
                        <div className="md:hidden">
                            <button className="text-gray-600">
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
                                    Juan Dela Cruz
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* main content area */}
                <main className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* left column */}
                        <div className="lg:col-span-2">
                            <Outlet />
                        </div>

                        {/* right columnb */}
                        <div className="space-y-6">
                            {/* profile overview */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="/pic.png"
                                        alt="Profile"
                                        className="w-16 h-16 rounded-full"
                                    />

                                    <div className="ml-4">
                                        <h2 className="font-semibold text-gray-800">
                                            Juan Dela Cruz
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            juandelacruz@email.com
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center">
                                        <MapPin
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>San Fernando, Pampanga</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>63 912 345 6789</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>Joined: January 2025</span>
                                    </div>
                                </div>

                                <Link
                                    to="/user/profile"
                                    className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={16} className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* footer */}
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

export default UserDashboard;
