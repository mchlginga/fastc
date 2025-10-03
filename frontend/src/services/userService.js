import { api } from "./api";

export const updateProfile = async ({
    username,
    birthdate,
    gender,
    contactNumber,
    address,
    education,
    certificates,
    proofs,
    profileStatus,
}) => {
    try {
        const formData = new FormData();
        if (username) formData.append("username", username);
        if (birthdate) formData.append("birthdate", birthdate);
        if (gender) formData.append("gender", gender);
        if (contactNumber) formData.append("contactNumber", contactNumber);
        if (address) formData.append("address", address);
        if (education) formData.append("education", JSON.stringify(education));
        if (certificates)
            formData.append("certificates", JSON.stringify(certificates));
        if (proofs && proofs.length) {
            proofs.forEach((proof) => formData.append("proofs", proof));
        }
        if (profileStatus !== undefined)
            formData.append("profileStatus", profileStatus);

        const { data } = await api.patch("/user/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to update profile."
        );
    }
};
