import { User, Book, Award, Shield } from "react-feather";

const SettingsNavigation = ({ activeSection, onSectionChange }) => {
    const navItems = [
        { id: "profile", label: "Profile Information", icon: User },
        { id: "education", label: "Education", icon: Book },
        { id: "certificates", label: "Certificates", icon: Award },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <nav className="bg-white rounded-2xl shadow-md p-4 sticky top-6">
            <ul className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => onSectionChange(item.id)}
                                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                                    activeSection === item.id
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Icon size={18} className="mr-3" />
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
