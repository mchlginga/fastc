import { Link } from "react-router-dom";
import * as Icons from "react-feather";

function StatsCard({ card }) {
    const IconComponent = Icons[card.icon];

    return (
        <Link
            to={card.link}
            className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between hover:-translate-y-1 hover:shadow-lg transition transform cursor-pointer border border-gray-100"
        >
            <div className={`${card.bg} p-3 rounded-xl mr-4`}>
                <IconComponent size={26} className={getIconColor(card.icon)} />
            </div>
            <div className="text-right">
                <h3 className="text-3xl font-bold text-gray-800">
                    {card.value}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                    {card.title}
                </p>
                <p className="text-gray-400 text-xs">{card.description}</p>
            </div>
        </Link>
    );
}

const getIconColor = (iconName) => {
    const colors = {
        Book: "text-blue-600",
        Award: "text-green-600",
        Clock: "text-yellow-600",
        FileText: "text-purple-600",
    };
    return colors[iconName] || "text-gray-600";
};

export default StatsCard;
