import { createContext, useState } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        personal: {
            username: "",
            birthDate: "",
            gender: "",
            contactNumber: "",
        },
        address: "",
        education: [],
        certificates: [],
        position: "", // Added for admin
        idProof: "", // Added for admin
        profileStatus: "pending",
    });

    return (
        <ProfileContext.Provider value={{ profileData, setProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};
