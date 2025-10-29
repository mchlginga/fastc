import { Settings, Search } from "react-feather";

const SettingsHeader = ({ searchQuery, onSearchChange }) => {
    return (
        <section className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Settings size={26} className="text-blue-600 mr-3" />
                        <h2 className="text-3xl font-bold text-gray-800">
                            Settings
                        </h2>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Manage your account settings and personal information
                    </p>
                </div>

                {/* Search Bar - Always visible like in Certificates */}
                {searchQuery !== undefined && (
                    <div className="relative w-full lg:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search settings..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SettingsHeader;
