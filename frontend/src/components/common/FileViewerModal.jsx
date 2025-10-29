import { X, Download, Award } from "react-feather";

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName }) => {
    if (!isOpen) return null;

    const isImage = fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    const isPDF = fileName?.match(/\.pdf$/i);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || "document";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {fileName || "Document Preview"}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Download"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center bg-gray-100 p-4 h-full max-h-[calc(90vh-80px)]">
                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : isPDF ? (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full min-h-[500px] border-0"
                            title={fileName}
                        />
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-gray-200 rounded-full p-4 inline-flex mb-4">
                                <Award size={48} className="text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-4">
                                Document preview not available
                            </p>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center cursor-pointer transition-colors"
                                >
                                    View File
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileViewerModal;
