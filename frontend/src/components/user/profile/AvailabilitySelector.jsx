import { useState } from "react";
import { ChevronDown } from "react-feather";

function AvailabilitySelector({ currentAvailability, onUpdate, loading }) {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        {
            value: "N/A",
            label: "Not Available",
            description: "Not currently available for work",
        },
        {
            value: "Full-time",
            label: "Full Time",
            description: "Available for full-time positions",
        },
        {
            value: "Part-time",
            label: "Part Time",
            description: "Available for part-time positions",
        },
    ];

    const currentOption =
        options.find((opt) => opt.value === currentAvailability) || options[0];

    const handleSelect = async (option) => {
        if (option.value === currentAvailability) {
            setIsOpen(false);
            return;
        }

        try {
            await onUpdate(option.value);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update availability:", error);
        }
    };

    return (
        <div className="relative">
            <p className="text-gray-500 text-sm mb-2">Availability</p>

            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className={`w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-blue-500 transition-colors text-left ${
                    loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${isOpen ? "border-blue-500 ring-2 ring-blue-100" : ""}`}
            >
                <div>
                    <p className="font-medium text-gray-800">
                        {currentOption.label}
                    </p>
                    <p className="text-sm text-gray-500">
                        {currentOption.description}
                    </p>
                </div>
                {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                    <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className={`w-full p-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                option.value === currentAvailability
                                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                                    : ""
                            }`}
                        >
                            <p
                                className={`font-medium ${
                                    option.value === currentAvailability
                                        ? "text-blue-600"
                                        : "text-gray-800"
                                }`}
                            >
                                {option.label}
                            </p>
                            <p className="text-sm text-gray-500">
                                {option.description}
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AvailabilitySelector;
