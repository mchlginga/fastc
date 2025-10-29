import { useState } from "react";
import { Save, Plus, X, Book, Upload, Eye } from "react-feather";
import { updateEducation } from "../../../services/userService";

const EducationSection = ({
    educations,
    loading,
    onEducationsChange,
    onToastNotification,
    onUserUpdate,
    onViewFile,
    isFiltered = false,
}) => {
    const [saving, setSaving] = useState(false);

    const handleEducationChange = (id, field, value) => {
        onEducationsChange((prev) =>
            prev.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        );
    };

    const handleAddEducation = () => {
        onEducationsChange((prev) => [
            ...prev,
            {
                id: Date.now(),
                educationLevel: "",
                schoolName: "",
                yearGraduated: "",
                proof: null,
                existingProof: null,
            },
        ]);
    };

    const handleRemoveEducation = (id) => {
        if (educations.length > 1) {
            onEducationsChange((prev) => prev.filter((edu) => edu.id !== id));
        }
    };

    const handleEducationFileChange = (id, file) => {
        onEducationsChange((prev) =>
            prev.map((edu) =>
                edu.id === id
                    ? { ...edu, proof: file, existingProof: null }
                    : edu
            )
        );
    };

    const handleRemoveEducationFile = (id) => {
        onEducationsChange((prev) =>
            prev.map((edu) =>
                edu.id === id
                    ? { ...edu, proof: null, existingProof: null }
                    : edu
            )
        );
    };

    const handleSaveEducation = async () => {
        setSaving(true);
        try {
            const educationData = educations.map((edu) => {
                const educationItem = {
                    educationLevel: edu.educationLevel,
                    schoolName: edu.schoolName,
                    yearGraduated: edu.yearGraduated,
                    existingProof: edu.existingProof || null,
                };

                if (edu.proof) {
                    educationItem.proof = "new";
                } else if (edu.existingProof && !edu.proof) {
                    educationItem.proof = "existing";
                } else {
                    educationItem.proof = "remove";
                }

                return educationItem;
            });

            const files = educations
                .filter((edu) => edu.proof)
                .map((edu) => edu.proof);

            const response = await updateEducation({
                education: educationData,
                files: files,
            });

            // FIX: Handle response properly
            if (response.success) {
                const updatedUser = response.user || response;
                onUserUpdate(updatedUser);
                onToastNotification({
                    message: "Education information saved successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            onToastNotification({
                message:
                    error.message || "Failed to save education information.",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    if (isFiltered && educations.length === 0) {
        return (
            <section>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Education Background
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Add your educational qualifications
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
                        <Book size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                        No education records found
                    </h3>
                    <p className="text-gray-600 text-sm">
                        No education records match your search criteria. Try
                        adjusting your search terms.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Education Background
                </h3>
                <p className="text-gray-600 text-sm">
                    Add your educational qualifications
                </p>
            </div>

            <div className="space-y-6">
                {educations.map((edu, index) => (
                    <div
                        key={edu.id}
                        className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-800">
                                Education {index + 1}
                            </h4>
                            {educations.length > 1 && (
                                <button
                                    onClick={() =>
                                        handleRemoveEducation(edu.id)
                                    }
                                    className="text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Education Level
                                </label>
                                <select
                                    value={edu.educationLevel}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            edu.id,
                                            "educationLevel",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                >
                                    <option value="">Select Level</option>
                                    <option value="High School">
                                        High School
                                    </option>
                                    <option value="Senior High School">
                                        Senior High School
                                    </option>
                                    <option value="College">College</option>
                                    <option value="Vocational">
                                        Vocational
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    School Name
                                </label>
                                <input
                                    type="text"
                                    value={edu.schoolName}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            edu.id,
                                            "schoolName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    placeholder="Enter school name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Year Graduated
                                </label>
                                <input
                                    type="text"
                                    value={edu.yearGraduated}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            edu.id,
                                            "yearGraduated",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600 transition"
                                    placeholder="Graduation year"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm font-medium mb-2">
                                    Proof Document
                                </label>
                                <div className="space-y-2">
                                    {edu.existingProof && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center">
                                                <Book
                                                    size={16}
                                                    className="text-green-600 mr-2"
                                                />
                                                <span className="text-sm text-green-800">
                                                    Existing file uploaded
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        onViewFile(
                                                            edu.existingProof,
                                                            `Education Proof ${
                                                                index + 1
                                                            }`
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                                                    title="View file"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveEducationFile(
                                                            edu.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                                                    title="Remove file"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {!edu.existingProof && (
                                        <div className="flex items-center">
                                            <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex-1 truncate">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) =>
                                                        handleEducationFileChange(
                                                            edu.id,
                                                            e.target.files[0]
                                                        )
                                                    }
                                                />
                                                <div className="flex items-center">
                                                    <Upload
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    <span className="truncate">
                                                        {edu.proof
                                                            ? edu.proof.name
                                                            : "Upload Document"}
                                                    </span>
                                                </div>
                                            </label>
                                            {edu.proof && (
                                                <button
                                                    onClick={() =>
                                                        handleRemoveEducationFile(
                                                            edu.id
                                                        )
                                                    }
                                                    className="ml-2 text-red-600 hover:text-red-700 p-2 rounded-lg cursor-pointer"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddEducation}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition duration-200 cursor-pointer mt-6"
            >
                + Add Another Education
            </button>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSaveEducation}
                    disabled={saving}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center cursor-pointer ${
                        saving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving Education...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Save Education
                        </>
                    )}
                </button>
            </div>
        </section>
    );
};

export default EducationSection;
