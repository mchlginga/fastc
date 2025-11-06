import { Link } from "react-router-dom";
import * as Icons from "react-feather";

function StatsCard({ card }) {
    const IconComponent = Icons[card.icon];

    return (
        <Link
            to={card.link}
            className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                        {card.value}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        {card.title}
                    </p>
                    {card.description && (
                        <p className="text-xs text-gray-400 mt-1"></p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${card.bg}`}>
                    <IconComponent
                        size={20}
                        className={getIconColor(card.icon)}
                    />
                </div>
            </div>
        </Link>
    );
}

const getIconColor = (iconName) => {
    const colors = {
        Book: "text-blue-600",
        Award: "text-emerald-600",
        Clock: "text-amber-600",
        FileText: "text-purple-600",
    };
    return colors[iconName] || "text-gray-600";
};

export default StatsCard;
