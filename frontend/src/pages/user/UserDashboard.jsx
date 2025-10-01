import { useState, useEffect, useRef } from "react";
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
import {
    NavLink,
    Outlet,
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const onLogout = async () => {
        try {
            await handleLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const closeSidebar = () => setIsSidebarOpen(false);

    // Close sidebar on navigation
    useEffect(() => {
        closeSidebar();
    }, [location]);

    // Close sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                closeSidebar();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`sidebar bg-white w-64 shadow-sm fixed inset-y-0 left-0 z-30 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award size={32} className="text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-gray-800">
                            FAST-C
                        </span>
                    </div>
                </div>
                <nav className="p-4 space-y-1">
                    {[
                        {
                            to: "/user",
                            icon: Home,
                            label: "Dashboard",
                            end: true,
                        },
                        { to: "/user/courses", icon: Book, label: "Courses" },
                        {
                            to: "/user/certificates",
                            icon: FileText,
                            label: "Certificates",
                        },
                        { to: "/user/profile", icon: User, label: "Profile" },
                    ].map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                                    isActive
                                        ? "bg-blue-100 text-blue-600"
                                        : "text-gray-600 hover:bg-blue-50"
                                }`
                            }
                        >
                            <Icon size={20} className="mr-3" />
                            {label}
                        </NavLink>
                    ))}
                    <button
                        onClick={onLogout}
                        className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 rounded-lg w-full text-left"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-6 py-4">
                        <button
                            className="text-gray-600 md:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center space-x-4">
                            <img
                                src={user.profilePic || "/pic.png"}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-800">
                                {user.name}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div className="md:col-span-2">
                            <Outlet />
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={user.profilePic || "/pic.png"}
                                        alt="Profile"
                                        className="w-12 h-12 md:w-16 md:h-16 rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h2 className="font-semibold text-gray-800 text-base md:text-lg">
                                            {user.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center">
                                        <MapPin
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>
                                            {user.address || "Not provided"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>
                                            {user.contactNumber ||
                                                "Not provided"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar
                                            size={16}
                                            className="text-gray-500 mr-2"
                                        />
                                        <span>
                                            Joined:{" "}
                                            {new Date(
                                                user.createdAt
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to="/user/profile"
                                    className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={16} className="mr-2" />
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-200 py-4 px-4 md:px-6 text-center">
                    <p className="text-xs text-gray-500">
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
