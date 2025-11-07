import { User, Book, Award, Shield } from "react-feather";

const SettingsNavigation = ({ activeSection, onSectionChange }) => {
    const navItems = [
        { id: "profile", label: "Profile Information", icon: User },
        { id: "education", label: "Education", icon: Book },
        { id: "certificates", label: "Certificates", icon: Award },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <nav className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 sticky top-6">
            <ul className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => onSectionChange(item.id)}
                                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer text-sm ${
                                    activeSection === item.id
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <Icon size={16} className="mr-3" />
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default SettingsNavigation;
