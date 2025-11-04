import { api } from "./api";

// Enhanced image compression function
export const compressImage = async (
    base64data,
    quality = 0.6,
    maxWidth = 400
) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64data;
        img.onload = () => {
            const canvas = document.createElement("canvas");

            // Calculate new dimensions to reduce size
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");

            // Draw image with reduced quality
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG with compression
            const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

            console.log(
                `📷 Image compressed: ${img.width}x${img.height} -> ${width}x${height}, Quality: ${quality}`
            );
            console.log(
                `📊 Size reduced: ${base64data.length} -> ${compressedBase64.length} bytes`
            );

            resolve(compressedBase64);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image for compression"));
        };
    });
};

export const verifyAttendance = async (courseId, lessonId, imageData) => {
    try {
        // Compress image before sending
        const compressedImage = await compressImage(imageData);

        const response = await api.post("/attendance/verify", {
            courseId,
            lessonId,
            imageData: compressedImage,
        });
        return response.data;
    } catch (error) {
        console.error("Attendance verification error:", error);

        // Handle "already marked" as a soft success - user can still proceed to lesson
        if (error.response?.status === 409) {
            return {
                success: true,
                message: error.response.data.message,
                alreadyMarked: true, // Add flag to indicate attendance was already marked
            };
        }

        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const markAttendance = async (courseId, lessonId) => {
    try {
        const response = await api.post("/attendance/mark", {
            courseId,
            lessonId,
        });
        return response.data;
    } catch (error) {
        console.error("Mark attendance error:", error);
        throw error;
    }
};

export const enrollFace = async (imageData) => {
    try {
        console.log("🔄 Compressing image before enrollment...");

        // Compress image to prevent 414 error
        const compressedImage = await compressImage(imageData, 0.5, 320); // Lower quality, smaller size

        console.log(
            `📦 Sending compressed image: ${compressedImage.length} bytes`
        );

        const response = await api.post("/attendance/enroll", {
            imageData: compressedImage,
        });
        return response.data;
    } catch (error) {
        console.error("Face enrollment error:", error);

        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const getFaceStatus = async () => {
    try {
        const response = await api.get("/attendance/status");
        return response.data;
    } catch (error) {
        console.error("Get face status error:", error);
        throw error;
    }
};

export const getAttendanceHistory = async (enrollmentId) => {
    try {
        const response = await api.get(`/attendance/history/${enrollmentId}`);
        return response.data;
    } catch (error) {
        console.error("Get attendance history error:", error);
        throw error;
    }
};

export const getTodayAttendance = async (courseId) => {
    try {
        const response = await api.get(`/attendance/today/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Get today attendance error:", error);
        // If endpoint doesn't exist yet, return false
        if (error.response?.status === 404) {
            return { success: true, hasAttendanceToday: false };
        }
        throw error;
    }
};

export const isFaceDetectionSupported = () => {
    return (
        typeof window !== "undefined" &&
        "getUserMedia" in navigator.mediaDevices &&
        typeof WebGLRenderingContext !== "undefined"
    );
};
