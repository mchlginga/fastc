import { api } from "./api";

export const getUserProfile = async () => {
    try {
        const response = await api.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error(
            error.response?.data?.message || "Failed to fetch user profile"
        );
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put("/user/profile", profileData);
        // FIX: Return the entire response data, not just user object
        return response.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error(
            error.response?.data?.message || "Failed to update profile"
        );
    }
};

export const uploadProfilePic = async (formData) => {
    try {
        const response = await api.post("/user/upload/profile-pic", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading profile picture:", error);

        if (error.response?.status === 413) {
            throw new Error("File too large. Please select a smaller image.");
        } else if (error.response?.status === 415) {
            throw new Error(
                "Unsupported file type. Please use JPEG, PNG, or WebP."
            );
        }

        throw new Error(
            error.response?.data?.message || "Failed to upload profile picture"
        );
    }
};

export const removeProfilePic = async () => {
    try {
        const response = await api.delete("/user/remove/profile-pic");
        return response.data;
    } catch (error) {
        console.error("Error removing profile picture:", error);
        throw new Error(
            error.response?.data?.message || "Failed to remove profile picture"
        );
    }
};

export const updateEducation = async ({ education, files = [] }) => {
    try {
        const formData = new FormData();

        // Append education data as JSON
        formData.append("education", JSON.stringify(education));

        // Append files
        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await api.patch("/user/education", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating education:", error);
        throw new Error(
            error.response?.data?.message || "Failed to update education"
        );
    }
};

export const updateCertificates = async ({ certificates, files = [] }) => {
    try {
        const formData = new FormData();

        // Append certificates data as JSON
        formData.append("certificates", JSON.stringify(certificates));

        // Append files
        files.forEach((file) => {
            formData.append("files", file);
        });

        const response = await api.patch("/user/certificates", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating certificates:", error);
        throw new Error(
            error.response?.data?.message || "Failed to update certificates"
        );
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.put("/user/change-password", passwordData);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to change password"
        );
    }
};

export const adminUserService = {
    // Get all users with filters
    getUsers: async (filters = {}) => {
        try {
            const response = await api.get("/admin/users", { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    },

    // Create new user (Add User function)
    createUser: async (userData) => {
        try {
            const response = await api.post("/admin/users", userData);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error(
                error.response?.data?.message || "Failed to create user"
            );
        }
    },

    // Update user status
    updateUserStatus: async (userId, status) => {
        try {
            const response = await api.patch(`/admin/users/${userId}/status`, {
                status,
            });
            return response.data;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update user status"
            );
        }
    },

    // Bulk update user status
    bulkUpdateUserStatus: async (userIds, status) => {
        try {
            const response = await api.patch("/admin/users/bulk/status", {
                userIds,
                status,
            });
            return response.data;
        } catch (error) {
            console.error("Error bulk updating user status:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update users"
            );
        }
    },

    // Update user details
    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update user"
            );
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error(
                error.response?.data?.message || "Failed to delete user"
            );
        }
    },

    // Upload user profile picture (admin)
    uploadUserProfilePic: async (userId, formData) => {
        try {
            const response = await api.post(
                `/admin/users/${userId}/profile-pic`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error uploading user profile picture:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to upload profile picture"
            );
        }
    },

    // Remove user profile picture (admin)
    removeUserProfilePic: async (userId) => {
        try {
            const response = await api.delete(
                `/admin/users/${userId}/profile-pic`
            );
            return response.data;
        } catch (error) {
            console.error("Error removing user profile picture:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to remove profile picture"
            );
        }
    },
};

export const adminCourseService = {
    // Get all courses with filters
    getCourses: async (filters = {}) => {
        try {
            const response = await api.get("/admin/courses", {
                params: filters,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching courses:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch courses"
            );
        }
    },

    // Get course by ID
    getCourseById: async (courseId) => {
        try {
            const response = await api.get(`/admin/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching course:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch course"
            );
        }
    },

    // Create new course
    createCourse: async (courseData) => {
        try {
            const response = await api.post("/admin/courses", courseData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating course:", error);
            throw new Error(
                error.response?.data?.message || "Failed to create course"
            );
        }
    },

    // Update course status
    updateCourseStatus: async (courseId, status) => {
        try {
            const response = await api.patch(
                `/admin/courses/${courseId}/status`,
                {
                    status,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating course status:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to update course status"
            );
        }
    },

    // Bulk update course status
    bulkUpdateCourseStatus: async (courseIds, status) => {
        try {
            console.log("📤 Sending bulk update request:", {
                courseIds,
                status,
            });
            const response = await api.patch("/admin/courses/bulk/status", {
                courseIds,
                status,
            });
            console.log("✅ Bulk update response:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error bulk updating course status:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update courses"
            );
        }
    },

    // Update course details
    updateCourse: async (courseId, courseData) => {
        try {
            const response = await api.put(
                `/admin/courses/${courseId}`,
                courseData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating course:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update course"
            );
        }
    },

    // Delete course
    deleteCourse: async (courseId) => {
        try {
            const response = await api.delete(`/admin/courses/${courseId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting course:", error);
            throw new Error(
                error.response?.data?.message || "Failed to delete course"
            );
        }
    },

    // Upload course image
    uploadCourseImage: async (courseId, formData) => {
        try {
            const response = await api.post(
                `/admin/courses/${courseId}/image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error uploading course image:", error);
            throw new Error(
                error.response?.data?.message || "Failed to upload course image"
            );
        }
    },

    // Remove course image
    removeCourseImage: async (courseId) => {
        try {
            const response = await api.delete(
                `/admin/courses/${courseId}/image`
            );
            return response.data;
        } catch (error) {
            console.error("Error removing course image:", error);
            throw new Error(
                error.response?.data?.message || "Failed to remove course image"
            );
        }
    },

    // Get course statistics
    getCourseStats: async () => {
        try {
            const response = await api.get("/admin/courses/stats");
            return response.data;
        } catch (error) {
            console.error("Error fetching course stats:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to fetch course statistics"
            );
        }
    },
};

export const adminEnrollmentService = {
    // Get all enrollments with filters
    getEnrollments: async (filters = {}) => {
        try {
            const response = await api.get("/admin/enrollments", {
                params: filters,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch enrollments"
            );
        }
    },

    // Get enrollment by ID
    getEnrollmentById: async (enrollmentId) => {
        try {
            const response = await api.get(
                `/admin/enrollments/${enrollmentId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching enrollment:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch enrollment"
            );
        }
    },

    // Create new enrollment (manual enrollment by admin)
    createEnrollment: async (enrollmentData) => {
        try {
            const response = await api.post(
                "/admin/enrollments",
                enrollmentData
            );
            return response.data;
        } catch (error) {
            console.error("Error creating enrollment:", error);
            throw new Error(
                error.response?.data?.message || "Failed to create enrollment"
            );
        }
    },

    updateEnrollment: async (enrollmentId, enrollmentData) => {
        try {
            const response = await api.put(
                `/admin/enrollments/${enrollmentId}`,
                enrollmentData
            );
            return response.data;
        } catch (error) {
            console.error("Error updating enrollment:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update enrollment"
            );
        }
    },

    // Update enrollment status
    updateEnrollmentStatus: async (enrollmentId, status) => {
        try {
            const response = await api.patch(
                `/admin/enrollments/${enrollmentId}/status`,
                {
                    status,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating enrollment status:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to update enrollment status"
            );
        }
    },

    // Bulk update enrollment status
    bulkUpdateEnrollmentStatus: async (enrollmentIds, status) => {
        try {
            const response = await api.patch("/admin/enrollments/bulk/status", {
                enrollmentIds,
                status,
            });
            return response.data;
        } catch (error) {
            console.error("Error bulk updating enrollment status:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update enrollments"
            );
        }
    },

    // Update enrollment progress
    updateEnrollmentProgress: async (enrollmentId, progressData) => {
        try {
            const response = await api.patch(
                `/admin/enrollments/${enrollmentId}/progress`,
                progressData
            );
            return response.data;
        } catch (error) {
            console.error("Error updating enrollment progress:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to update enrollment progress"
            );
        }
    },

    // Delete enrollment
    deleteEnrollment: async (enrollmentId) => {
        try {
            const response = await api.delete(
                `/admin/enrollments/${enrollmentId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            throw new Error(
                error.response?.data?.message || "Failed to delete enrollment"
            );
        }
    },

    // Get enrollment statistics
    getEnrollmentStats: async () => {
        try {
            const response = await api.get("/admin/enrollments/stats");
            return response.data;
        } catch (error) {
            console.error("Error fetching enrollment stats:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to fetch enrollment statistics"
            );
        }
    },

    // Get course enrollments
    getCourseEnrollments: async (courseId, filters = {}) => {
        try {
            const response = await api.get(
                `/admin/courses/${courseId}/enrollments`,
                { params: filters }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching course enrollments:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to fetch course enrollments"
            );
        }
    },

    // Get user enrollments
    getUserEnrollments: async (userId, filters = {}) => {
        try {
            const response = await api.get(
                `/admin/users/${userId}/enrollments`,
                { params: filters }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user enrollments:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to fetch user enrollments"
            );
        }
    },
};

export const adminCertificateService = {
    // Get all certificates with filters
    getCertificates: async (filters = {}) => {
        try {
            const response = await api.get("/admin/certificates", {
                params: filters,
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching certificates:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch certificates"
            );
        }
    },

    // Get certificate by ID
    getCertificateById: async (certificateId) => {
        try {
            const response = await api.get(
                `/admin/certificates/${certificateId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching certificate:", error);
            throw new Error(
                error.response?.data?.message || "Failed to fetch certificate"
            );
        }
    },

    createCertificate: async (certificateData) => {
        try {
            const response = await api.post(
                "/admin/certificates",
                certificateData
            );
            return response.data;
        } catch (error) {
            console.error("Error creating certificate:", error);
            throw new Error(
                error.response?.data?.message || "Failed to create certificate"
            );
        }
    },

    // Update certificate status
    updateCertificateStatus: async (certificateId, status) => {
        try {
            const response = await api.patch(
                `/admin/certificates/${certificateId}/status`,
                {
                    status,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating certificate status:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to update certificate status"
            );
        }
    },

    // Bulk update certificate status
    bulkUpdateCertificateStatus: async (certificateIds, status) => {
        try {
            const response = await api.patch(
                "/admin/certificates/bulk/status",
                {
                    certificateIds,
                    status,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error bulk updating certificate status:", error);
            throw new Error(
                error.response?.data?.message || "Failed to update certificates"
            );
        }
    },

    bulkRegenerateCertificates: async (certificateIds) => {
        try {
            const response = await api.post(
                "/admin/certificates/bulk/regenerate",
                {
                    certificateIds,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error bulk regenerating certificates:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to bulk regenerate certificates"
            );
        }
    },

    bulkExpireCertificates: async (certificateIds) => {
        try {
            const response = await api.patch(
                "/admin/certificates/bulk/expire",
                {
                    certificateIds,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error bulk expiring certificates:", error);
            throw new Error(
                error.response?.data?.message || "Failed to expire certificates"
            );
        }
    },

    // Revoke certificate
    revokeCertificate: async (certificateId) => {
        try {
            const response = await api.patch(
                `/admin/certificates/${certificateId}/revoke`
            );
            return response.data;
        } catch (error) {
            console.error("Error revoking certificate:", error);
            throw new Error(
                error.response?.data?.message || "Failed to revoke certificate"
            );
        }
    },

    // Regenerate certificate
    regenerateCertificate: async (certificateId) => {
        try {
            const response = await api.post(
                `/admin/certificates/${certificateId}/regenerate`
            );
            return response.data;
        } catch (error) {
            console.error("Error regenerating certificate:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to regenerate certificate"
            );
        }
    },

    // Delete certificate
    deleteCertificate: async (certificateId) => {
        try {
            const response = await api.delete(
                `/admin/certificates/${certificateId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting certificate:", error);
            throw new Error(
                error.response?.data?.message || "Failed to delete certificate"
            );
        }
    },

    // Get certificate statistics
    getCertificateStats: async () => {
        try {
            const response = await api.get("/admin/certificates/stats");
            return response.data;
        } catch (error) {
            console.error("Error fetching certificate stats:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to fetch certificate statistics"
            );
        }
    },

    // Download certificate
    downloadCertificate: async (certificateId) => {
        try {
            const response = await api.get(
                `/admin/certificates/${certificateId}/download`,
                {
                    responseType: "blob", // Important for file downloads
                }
            );

            // Create a blob from the PDF data
            const blob = new Blob([response.data], { type: "application/pdf" });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element
            const link = document.createElement("a");
            link.href = url;

            // Get filename from response headers or use default
            const contentDisposition = response.headers["content-disposition"];
            let filename = `FAST-C_Certificate_${certificateId}.pdf`;

            if (contentDisposition) {
                const filenameMatch =
                    contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute("download", filename);
            document.body.appendChild(link);

            // Trigger the download
            link.click();

            // Clean up
            link.remove();
            window.URL.revokeObjectURL(url);

            return { success: true, filename };
        } catch (error) {
            console.error("Download certificate error:", error);
            throw new Error(
                error.response?.data?.message ||
                    "Failed to download certificate"
            );
        }
    },

    // Verify certificate
    verifyCertificate: async (verificationCode) => {
        try {
            const response = await api.get("/admin/certificates/verify", {
                params: { verificationCode },
            });
            return response.data;
        } catch (error) {
            console.error("Error verifying certificate:", error);
            throw new Error(
                error.response?.data?.message || "Failed to verify certificate"
            );
        }
    },
};
