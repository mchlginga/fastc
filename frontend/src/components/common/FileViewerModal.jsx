import { X, Download, File, Image, FileText } from "react-feather";

const FileViewerModal = ({ isOpen, onClose, fileUrl, fileName }) => {
    if (!isOpen) return null;

    const isImage = fileName?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
    const isPDF = fileName?.match(/\.pdf$/i);
    const isDocument = fileName?.match(/\.(doc|docx|txt|rtf)$/i);

    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName || "document";
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getFileIcon = () => {
        if (isImage) return <Image size={48} className="text-blue-500" />;
        if (isPDF) return <FileText size={48} className="text-red-500" />;
        return <File size={48} className="text-gray-400" />;
    };

    const getFileTypeText = () => {
        if (isImage) return "Image";
        if (isPDF) return "PDF Document";
        if (isDocument) return "Text Document";
        return "File";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 cursor-pointer"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0">{getFileIcon()}</div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {fileName || "Document Preview"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {getFileTypeText()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {fileUrl && (
                            <button
                                onClick={handleDownload}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Download file"
                            >
                                <Download size={20} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 min-h-[400px]">
                    {fileUrl ? (
                        isImage ? (
                            <div className="max-w-full max-h-full flex items-center justify-center">
                                <img
                                    src={fileUrl}
                                    alt={fileName}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>
                        ) : isPDF ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <iframe
                                    src={fileUrl}
                                    className="w-full h-full min-h-[500px] border-0 rounded-lg bg-white shadow-sm"
                                    title={fileName}
                                />
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                    {/* Centered Icon */}
                                    <div className="flex justify-center mb-4">
                                        {getFileIcon()}
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        Preview not available for this file type
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        You can download the file to view it.
                                    </p>
                                    <button
                                        onClick={handleDownload}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                                    >
                                        <Download size={16} />
                                        Download File
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                                {/* Centered Icon */}
                                <div className="flex justify-center mb-4">
                                    <File size={48} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 mb-2">
                                    File not available
                                </p>
                                <p className="text-sm text-gray-500">
                                    The file could not be loaded or does not
                                    exist.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileViewerModal;
