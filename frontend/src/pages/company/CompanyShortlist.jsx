import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2, Bookmark, Download } from "react-feather";

const CompanyShortlist = () => {
    const [shortlist, setShortlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Simulate fetching shortlist (replace with GET /company/shortlist)
        setIsLoading(true);
        setTimeout(() => {
            const mockShortlist = [
                {
                    id: "maria-santos",
                    name: "Maria Santos",
                    skills: ["Welding NC II"],
                    dateAdded: "Sep 18, 2025",
                },
                {
                    id: "pedro-lim",
                    name: "Pedro Lim",
                    skills: ["Electrical NC II"],
                    dateAdded: "Sep 17, 2025",
                },
            ];
            setShortlist(mockShortlist);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleRemove = (id, name) => {
        if (
            window.confirm(
                `Are you sure you want to remove ${name} from the shortlist?`
            )
        ) {
            // Simulate DELETE /company/shortlist/:id
            setIsLoading(true);
            setTimeout(() => {
                setShortlist(shortlist.filter((trainee) => trainee.id !== id));
                setMessage(`${name} removed from shortlist successfully!`);
                setIsLoading(false);
                setTimeout(() => setMessage(""), 3000);
            }, 1000);
        }
    };

    const handleDownloadPDF = () => {
        alert("Download as PDF feature coming soon!");
    };

    return (
        <div className="space-y-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Shortlist
                    </h1>
                    <p className="text-gray-600">
                        View and manage your shortlisted trainees
                    </p>
                </div>

                {/* Download PDF Button (UI Only) */}
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Download size={16} />
                    <span className="text-sm font-medium">Download as PDF</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 card-hover transition">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Shortlisted Candidates
                    </h2>
                </div>
                {message && (
                    <p className="text-sm text-green-600 mb-4">{message}</p>
                )}
                {isLoading ? (
                    <p className="text-sm text-gray-600">Loading...</p>
                ) : shortlist.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left font-medium">
                                        Trainee Name
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Skills
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Date Added
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shortlist.map((trainee) => (
                                    <tr
                                        key={trainee.id}
                                        className="hover:bg-gray-100"
                                    >
                                        <td className="py-3 px-4">
                                            {trainee.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            {trainee.skills.map(
                                                (skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {trainee.dateAdded}
                                        </td>
                                        <td className="py-3 px-4 flex space-x-2">
                                            <Link
                                                to={`/company/trainee/${trainee.id}`}
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleRemove(
                                                        trainee.id,
                                                        trainee.name
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-4">
                        <p className="text-sm font-medium">
                            No trainees in your shortlist.
                        </p>
                        <p className="text-sm mt-2">
                            Start adding trainees from{" "}
                            <Link
                                to="/company/search"
                                className="text-blue-600 hover:text-blue-500"
                            >
                                Search Trainees
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyShortlist;
