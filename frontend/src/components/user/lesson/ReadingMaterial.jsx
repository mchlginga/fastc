const ReadingMaterialComponent = ({ attachmentUrl, attachmentName }) => {
    const getFileIcon = (filename) => {
        if (filename?.includes(".pdf")) return "📕";
        if (filename?.includes(".doc")) return "📘";
        return "📄";
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="text-2xl mr-3">
                        {getFileIcon(attachmentName)}
                    </span>
                    <div>
                        <h3 className="font-semibold text-blue-800">
                            Reading Material
                        </h3>
                        <p className="text-blue-600 text-sm">
                            {attachmentName || "Study Material"}
                        </p>
                    </div>
                </div>
                <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    Download
                </a>
            </div>
        </div>
    );
};

export default ReadingMaterialComponent;
