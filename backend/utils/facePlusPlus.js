const axios = require("axios");

class FacePlusPlusService {
    constructor() {
        this.apiKey = process.env.FACEPP_API_KEY;
        this.apiSecret = process.env.FACEPP_API_SECRET;
        this.baseURL = "https://api-us.faceplusplus.com/facepp/v3";

        console.log("🔑 Face++ Configuration:", {
            hasApiKey: !!this.apiKey,
            hasApiSecret: !!this.apiSecret,
            baseURL: this.baseURL,
        });
    }

    async detectFace(imageBase64) {
        try {
            console.log("🔍 Starting face detection...");

            // Validate API credentials
            if (!this.apiKey || !this.apiSecret) {
                throw new Error("Face++ API credentials not configured.");
            }

            // Validate image data
            if (!imageBase64 || typeof imageBase64 !== "string") {
                throw new Error(
                    "Invalid image data: No base64 string provided"
                );
            }

            // Check image size before sending
            if (imageBase64.length > 2000000) {
                // ~2MB limit
                console.log(
                    `⚠️ Image too large: ${imageBase64.length} bytes, compressing...`
                );
                throw new Error(
                    "Image size too large. Please use a smaller image."
                );
            }

            let cleanBase64;
            if (imageBase64.startsWith("data:image")) {
                cleanBase64 = imageBase64.replace(
                    /^data:image\/\w+;base64,/,
                    ""
                );
            } else {
                cleanBase64 = imageBase64;
            }

            console.log(
                `📊 Sending image to Face++: ${cleanBase64.length} bytes`
            );

            const requestParams = {
                api_key: this.apiKey,
                api_secret: this.apiSecret,
                image_base64: cleanBase64,
                return_landmark: 0,
                return_attributes: "none",
            };

            console.log("🚀 Sending to Face++ API...");

            // Use form-data to avoid URL length limits
            const formData = new URLSearchParams();
            for (const [key, value] of Object.entries(requestParams)) {
                formData.append(key, value);
            }

            const response = await axios.post(
                `${this.baseURL}/detect`,
                formData,
                {
                    timeout: 30000,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            console.log("✅ Face++ Response:", {
                faceCount: response.data.faces?.length,
                requestId: response.data.request_id,
            });

            if (!response.data.faces || response.data.faces.length === 0) {
                throw new Error("No face detected in the image");
            }

            if (response.data.faces.length > 1) {
                throw new Error("Multiple faces detected");
            }

            return response.data.faces[0].face_token;
        } catch (error) {
            console.error("❌ Face++ Detection Error:");

            if (error.response) {
                console.error("   Status:", error.response.status);
                console.error("   Data:", error.response.data);

                const errorMsg = error.response.data?.error_message;

                if (errorMsg) {
                    // Handle specific Face++ errors
                    if (errorMsg.includes("IMAGE_ERROR")) {
                        throw new Error(
                            "Invalid image format. Please use JPEG format."
                        );
                    } else if (errorMsg.includes("INVALID_IMAGE_SIZE")) {
                        throw new Error(
                            "Image size is too small or too large. Please try with a clearer image."
                        );
                    } else if (errorMsg.includes("AUTHENTICATION_FAILED")) {
                        throw new Error(
                            "Face recognition service configuration error."
                        );
                    } else {
                        throw new Error(`Face detection failed: ${errorMsg}`);
                    }
                }

                // Handle HTTP errors
                if (error.response.status === 414) {
                    throw new Error(
                        "Image data too large. Please try again with better lighting."
                    );
                }
            }

            throw new Error(error.message || "Face detection failed");
        }
    }

    async compareFaces(faceToken1, faceToken2) {
        try {
            console.log("🔍 Comparing faces...");
            console.log(`   Face Token 1: ${faceToken1}`);
            console.log(`   Face Token 2: ${faceToken2}`);

            // ⚠️ CRITICAL FIX: Add 3-second delay for free tier
            console.log("⏳ Free tier protection: waiting 3 seconds...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
            console.log("✅ Delay complete, making API call...");

            const response = await axios.post(`${this.baseURL}/compare`, null, {
                params: {
                    api_key: this.apiKey,
                    api_secret: this.apiSecret,
                    face_token1: faceToken1,
                    face_token2: faceToken2,
                },
                timeout: 30000,
            });

            console.log(
                "✅ Face comparison confidence:",
                response.data.confidence
            );

            if (!response.data.confidence) {
                throw new Error("No confidence score returned from Face++");
            }

            return response.data;
        } catch (error) {
            console.error("❌ Face compare error:");

            if (
                error.response?.data?.error_message ===
                "CONCURRENCY_LIMIT_EXCEEDED"
            ) {
                throw new Error(
                    "CONCURRENCY_LIMIT: Too many requests. Please wait 5 seconds and try again."
                );
            }

            if (error.response) {
                console.error("   Status:", error.response.status);
                console.error("   Data:", error.response.data);

                const errorMsg = error.response.data?.error_message;
                if (errorMsg) {
                    if (errorMsg.includes("INVALID_FACE_TOKEN")) {
                        throw new Error(
                            "Invalid face token - face enrollment may be corrupted"
                        );
                    } else {
                        throw new Error(`Face comparison failed: ${errorMsg}`);
                    }
                }
            }

            throw new Error("Face comparison service unavailable");
        }
    }
}

module.exports = new FacePlusPlusService();
