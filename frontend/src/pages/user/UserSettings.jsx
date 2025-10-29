import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    ProfileSection,
    EducationSection,
    CertificatesSection,
    SecuritySection,
    SettingsNavigation,
    SettingsHeader,
    SettingsSkeleton,
    PasswordChangeModal,
    DeleteAccountModal,
} from "../../components/user/settings";
import { ToastNotification, FileViewerModal } from "../../components/common";
import {
    updateUserProfile,
    uploadProfilePic,
    removeProfilePic,
    updateEducation,
    updateCertificates,
    changePassword,
} from "../../services/userService";

function UserSettings() {
    const { user, setUser } = useAuth();
    const [activeSection, setActiveSection] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // State for different sections
    const [profileData, setProfileData] = useState({
        firstName: "",
        surname: "",
        email: "",
        birthdate: "",
        gender: "",
        contactNumber: "",
        address: "",
    });
    const [educations, setEducations] = useState([]);
    const [certificates, setCertificates] = useState([]);

    // UI State
    const [errors, setErrors] = useState({});
    const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);
    const [fileViewer, setFileViewer] = useState({
        isOpen: false,
        fileUrl: null,
        fileName: null,
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    useEffect(() => {
        if (user) {
            initializeUserData();
            // Simulate loading delay for better UX
            setTimeout(() => setLoading(false), 800);
        }
    }, [user]);

    const initializeUserData = () => {
        const formatBirthdate = (date) => {
            if (!date) return "";
            if (typeof date === "string" && date.includes("-"))
                return date.split("T")[0];
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) return "";
            return dateObj.toISOString().split("T")[0];
        };

        setProfileData({
            firstName: user.firstName || "",
            surname: user.surname || "",
            email: user.email || "",
            birthdate: formatBirthdate(user.birthdate),
            gender: user.gender || "",
            contactNumber: user.contactNumber || "",
            address: user.address || "",
        });

        setEducations(
            user.education?.length > 0
                ? user.education.map((edu) => ({
                      id: edu._id || Date.now() + Math.random(),
                      educationLevel: edu.educationLevel || "",
                      schoolName: edu.schoolName || "",
                      yearGraduated: edu.yearGraduated || "",
                      proof: edu.proof || null,
                      existingProof: edu.proof || null,
                  }))
                : [
                      {
                          id: Date.now(),
                          educationLevel: "",
                          schoolName: "",
                          yearGraduated: "",
                          proof: null,
                          existingProof: null,
                      },
                  ]
        );

        setCertificates(
            user.certificates?.length > 0
                ? user.certificates.map((cert) => ({
                      id: cert._id || Date.now() + Math.random(),
                      name: cert.name || "",
                      issuer: cert.issuer || "",
                      date: cert.date ? formatBirthdate(cert.date) : "",
                      expiration: cert.expiration
                          ? formatBirthdate(cert.expiration)
                          : "",
                      proof: cert.proof || null,
                      existingProof: cert.proof || null,
                  }))
                : [
                      {
                          id: Date.now(),
                          name: "",
                          issuer: "",
                          date: "",
                          expiration: "",
                          proof: null,
                          existingProof: null,
                      },
                  ]
        );
    };

    // FIXED: Enhanced file URL generation for different file types
    const getFileUrl = (filePath, fileType = "education") => {
        if (!filePath) {
            console.log(`❌ No file path provided for ${fileType}`);
            return null;
        }

        // If it's already a full URL, return as is
        if (filePath.startsWith("http")) {
            console.log(`✅ Using full URL for ${fileType}:`, filePath);
            return filePath;
        }

        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        // Check if the filePath is already a full path from backend
        if (filePath.startsWith("/uploads/")) {
            const fullUrl = `${backendUrl}${filePath}`;
            console.log(`✅ Using absolute path for ${fileType}:`, fullUrl);
            return fullUrl;
        }

        // Handle different file types with different upload directories
        let uploadPath;
        switch (fileType) {
            case "education":
                uploadPath = "/uploads/education/";
                break;
            case "certificate":
                uploadPath = "/uploads/certificates/";
                break;
            case "profile":
            default:
                uploadPath = "/uploads/profiles/";
                break;
        }

        const fullUrl = `${backendUrl}${uploadPath}${filePath}`;
        console.log(`✅ Generated URL for ${fileType}:`, fullUrl);
        return fullUrl;
    };

    // Profile picture URL generation
    const getProfilePicUrl = (profilePicPath) => {
        return getFileUrl(profilePicPath, "profile");
    };

    // Common handlers
    const handleViewFile = (filePath, fileName, fileType = "education") => {
        console.log("📁 Viewing file:", { filePath, fileName, fileType });

        const fileUrl = getFileUrl(filePath, fileType);
        console.log("🔗 Generated file URL:", fileUrl);

        if (fileUrl) {
            setFileViewer({
                isOpen: true,
                fileUrl,
                fileName: fileName || "Document",
            });
        } else {
            setToastNotification({
                message: "File not found or unavailable.",
                type: "error",
            });
        }
    };

    // Filter data based on search query for education and certificates
    const filterDataBySearch = (data, fields) => {
        if (!searchQuery.trim()) return data;

        const query = searchQuery.toLowerCase().trim();
        return data.filter((item) =>
            fields.some((field) =>
                item[field]?.toString().toLowerCase().includes(query)
            )
        );
    };

    // Filter profile data based on search query
    const filterProfileData = (data) => {
        if (!searchQuery.trim()) return data;

        const query = searchQuery.toLowerCase().trim();
        return Object.values(data).some((value) =>
            value?.toString().toLowerCase().includes(query)
        )
            ? data
            : null;
    };

    if (loading) {
        return <SettingsSkeleton />;
    }

    // Get filtered data based on active section
    const getFilteredData = () => {
        switch (activeSection) {
            case "education":
                return filterDataBySearch(educations, [
                    "educationLevel",
                    "schoolName",
                    "yearGraduated",
                ]);
            case "certificates":
                return filterDataBySearch(certificates, ["name", "issuer"]);
            case "profile":
                const filteredProfile = filterProfileData(profileData);
                return filteredProfile ? profileData : null;
            default:
                return null;
        }
    };

    const filteredData = getFilteredData();

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Status Alert */}
                {user?.profileStatus === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                        <p className="text-sm">
                            Your profile is under review. You cannot enroll in
                            courses until approved.
                        </p>
                    </div>
                )}

                {/* Header with Search Bar - Always visible like in Certificates */}
                <SettingsHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <SettingsNavigation
                            activeSection={activeSection}
                            onSectionChange={setActiveSection}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Results Info - Show when searching */}
                        {searchQuery && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    {filteredData === null
                                        ? `No results found for "${searchQuery}" in ${activeSection}`
                                        : `Showing results for "${searchQuery}" in ${activeSection}`}
                                </p>
                            </div>
                        )}

                        {/* Sections */}
                        {activeSection === "profile" && (
                            <ProfileSection
                                profileData={profileData}
                                user={user}
                                errors={errors}
                                loading={loading}
                                uploadingProfilePic={uploadingProfilePic}
                                onProfileDataChange={setProfileData}
                                onErrorsChange={setErrors}
                                onUploadingProfilePicChange={
                                    setUploadingProfilePic
                                }
                                onToastNotification={setToastNotification}
                                onUserUpdate={setUser}
                                getProfilePicUrl={getProfilePicUrl}
                                isFiltered={
                                    filteredData === null && searchQuery !== ""
                                }
                            />
                        )}

                        {activeSection === "education" && (
                            <EducationSection
                                educations={filteredData || []}
                                loading={loading}
                                onEducationsChange={setEducations}
                                onToastNotification={setToastNotification}
                                onUserUpdate={setUser}
                                onViewFile={(filePath, fileName) =>
                                    handleViewFile(
                                        filePath,
                                        fileName,
                                        "education"
                                    )
                                }
                                isFiltered={
                                    filteredData === null && searchQuery !== ""
                                }
                            />
                        )}

                        {activeSection === "certificates" && (
                            <CertificatesSection
                                certificates={filteredData || []}
                                loading={loading}
                                onCertificatesChange={setCertificates}
                                onToastNotification={setToastNotification}
                                onUserUpdate={setUser}
                                onViewFile={(filePath, fileName) =>
                                    handleViewFile(
                                        filePath,
                                        fileName,
                                        "certificate"
                                    )
                                }
                                isFiltered={
                                    filteredData === null && searchQuery !== ""
                                }
                            />
                        )}

                        {activeSection === "security" && (
                            <SecuritySection
                                showPasswordModal={showPasswordModal}
                                showDeleteModal={showDeleteModal}
                                onPasswordModalChange={setShowPasswordModal}
                                onDeleteModalChange={setShowDeleteModal}
                                searchQuery={searchQuery}
                                isFiltered={searchQuery !== ""}
                            />
                        )}
                    </div>
                </div>

                {/* Modals */}
                <PasswordChangeModal
                    isOpen={showPasswordModal}
                    onClose={() => {
                        setShowPasswordModal(false);
                        setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                        });
                        setPasswordErrors({});
                        setShowPasswords({
                            currentPassword: false,
                            newPassword: false,
                            confirmPassword: false,
                        });
                    }}
                    passwordData={passwordData}
                    passwordErrors={passwordErrors}
                    changingPassword={changingPassword}
                    showPasswords={showPasswords}
                    onPasswordDataChange={setPasswordData}
                    onPasswordErrorsChange={setPasswordErrors}
                    onChangingPasswordChange={setChangingPassword}
                    onShowPasswordsChange={setShowPasswords}
                    onToastNotification={setToastNotification}
                />

                <DeleteAccountModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                />

                {/* File Viewer */}
                <FileViewerModal
                    isOpen={fileViewer.isOpen}
                    onClose={() =>
                        setFileViewer({
                            isOpen: false,
                            fileUrl: null,
                            fileName: null,
                        })
                    }
                    fileUrl={fileViewer.fileUrl}
                    fileName={fileViewer.fileName}
                />

                {/* Toast Notification */}
                {toastNotification && (
                    <ToastNotification
                        message={toastNotification.message}
                        type={toastNotification.type}
                        onClose={() => setToastNotification(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default UserSettings;
