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

export const downloadCertificate = async (certificateId) => {
    try {
        const response = await api.get(
            `/certificate/${certificateId}/download`,
            {
                responseType: "blob", // Important for file downloads
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error downloading certificate ${certificateId}:`, error);

        if (error.response?.status === 404) {
            throw new Error("Certificate not found");
        }

        throw error;
    }
};
