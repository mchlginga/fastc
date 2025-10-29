import { api } from "./api";

export const updateProfile = async ({
    birthdate,
    gender,
    contactNumber,
    address,
    education,
    certificates,
    representative,
    files = [],
}) => {
    try {
        console.log("Debug: Starting profile update...");
        console.log(
            "Debug: Token in localStorage:",
            localStorage.getItem("token")
        );
        console.log("Debug: Cookies:", document.cookie);

        const formData = new FormData();

        // Append basic profile fields
        if (birthdate) formData.append("birthdate", birthdate);
        if (gender) formData.append("gender", gender);
        if (contactNumber) formData.append("contactNumber", contactNumber);
        if (address) formData.append("address", address);

        // Append array fields as JSON strings
        if (education) formData.append("education", JSON.stringify(education));
        if (certificates)
            formData.append("certificates", JSON.stringify(certificates));
        if (representative)
            formData.append("representative", JSON.stringify(representative));

        // Append files with field name "files"
        if (files && files.length) {
            files.forEach((file) => formData.append("files", file));
        }

        console.log("Debug: Sending request to /user/profile/setup");

        const { data } = await api.patch("/user/profile/setup", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Debug: Profile update successful");
        return data;
    } catch (error) {
        console.error("Debug: Profile update failed:", error);
        console.error("Debug: Error response:", error.response);
        throw new Error(
            error.response?.data?.message || "Failed to update profile."
        );
    }
};
