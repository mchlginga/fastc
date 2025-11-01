import { api } from "./api";

export const generateCertificate = async (enrollmentId) => {
    try {
        const response = await api.post("/certificate/generate", {
            enrollmentId,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error generating certificate for enrollment ${enrollmentId}:`,
            error
        );

        if (error.response?.status === 404) {
            throw new Error("Completed enrollment not found");
        } else if (error.response?.status === 400) {
            throw new Error("Certificate already exists for this enrollment");
        }

        throw error;
    }
};

export const verifyCertificate = async (verificationCode) => {
    try {
        const response = await api.get("/certificate/verify", {
            params: { verificationCode },
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error verifying certificate ${verificationCode}:`,
            error
        );

        if (error.response?.status === 400) {
            throw new Error("Verification code is required");
        } else if (error.response?.status === 404) {
            throw new Error(
                "Certificate not found or invalid verification code"
            );
        }

        throw error;
    }
};

export const getUserCertificates = async () => {
    try {
        const response = await api.get("/certificate/my-certificates");
        return response.data;
    } catch (error) {
        console.error("Error fetching user certificates:", error);
        throw error;
    }
};

// 🆕 UPDATED: Main download function with better error handling
export const downloadCertificate = async (
    certificateId,
    title = "Certificate"
) => {
    try {
        console.log(`📥 Downloading certificate: ${certificateId}`);

        const response = await api.get(
            `/certificate/${certificateId}/download`,
            {
                responseType: "blob",
                timeout: 30000, // 30 second timeout
                withCredentials: true,
            }
        );

        // 🆕 FIX: Check if response is actually a blob
        if (!(response.data instanceof Blob)) {
            throw new Error("Server returned invalid file data");
        }

        // 🆕 FIX: Check blob type and size
        if (response.data.type !== "application/pdf") {
            console.warn("⚠️ Response is not PDF, type:", response.data.type);

            // Try to parse as JSON error message
            const text = await response.data.text();
            try {
                const errorData = JSON.parse(text);
                throw new Error(
                    errorData.message || "Server returned error instead of PDF"
                );
            } catch {
                throw new Error("Server returned invalid file format");
            }
        }

        if (response.data.size === 0) {
            throw new Error("Certificate file is empty");
        }

        console.log(
            `✅ Received valid PDF blob, size: ${response.data.size} bytes`
        );
        return response.data;
    } catch (error) {
        console.error("❌ Certificate download error:", error);

        // 🆕 FIX: Enhanced error handling
        if (error.code === "ERR_NETWORK") {
            throw new Error(
                "Network error: Unable to download certificate. Please check your connection and try again."
            );
        }

        if (error.response?.status === 404) {
            throw new Error(
                "Certificate not found. It may have been deleted or is unavailable."
            );
        }

        if (error.response?.status === 401) {
            throw new Error("Authentication required. Please log in again.");
        }

        throw new Error(
            error.response?.data?.message ||
                error.message ||
                "Failed to download certificate. Please try again later."
        );
    }
};

// 🆕 UPDATED: Enhanced download handler with fallback
export const downloadCertificateEnhanced = async (
    certificateId,
    title = "Certificate"
) => {
    try {
        // First try the direct download method
        return await downloadCertificate(certificateId, title);
    } catch (error) {
        console.warn(
            "⚠️ Primary download failed, trying fallback:",
            error.message
        );

        // Fallback: Try direct Cloudinary download
        try {
            await downloadCertificateDirect(certificateId, title);
            return new Blob([]); // Return empty blob since direct download handles the file
        } catch (fallbackError) {
            console.error("❌ All download methods failed:", fallbackError);
            throw error; // Throw the original error
        }
    }
};

// 🆕 UPDATED: Direct download function
export const downloadCertificateDirect = async (
    certificateId,
    title = "Certificate"
) => {
    try {
        console.log(`📥 Direct download for certificate: ${certificateId}`);

        // Use the new direct download endpoint
        const directUrl = `${api.defaults.baseURL}/certificate/${certificateId}/direct-download`;

        // Create a temporary anchor tag to trigger download
        const link = document.createElement("a");
        link.href = directUrl;
        link.setAttribute(
            "download",
            `FAST-C_Certificate_${title.replace(/\s+/g, "_")}.pdf`
        );
        link.setAttribute("target", "_blank"); // Open in new tab for Cloudinary

        // Add authentication token if available
        const token = localStorage.getItem("token");
        if (token) {
            link.setAttribute("Authorization", `Bearer ${token}`);
        }

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return true;
    } catch (error) {
        console.error("❌ Direct download error:", error);
        throw new Error("Failed to initiate direct download");
    }
};

export const viewCertificate = async (certificateId) => {
    try {
        const response = await api.get(`/certificate/${certificateId}/view`);
        return response.data;
    } catch (error) {
        console.error(`Error viewing certificate ${certificateId}:`, error);
        throw error;
    }
};

// 🆕 ADD: Get certificate URL for preview
export const getCertificateUrl = async (certificateId) => {
    try {
        const response = await api.get(`/certificate/${certificateId}/url`);
        return response.data;
    } catch (error) {
        console.error(`Error getting certificate URL ${certificateId}:`, error);
        throw error;
    }
};
