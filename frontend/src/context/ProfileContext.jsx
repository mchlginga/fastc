import { createContext, useState } from "react";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        personal: {
            fullName: "",
            birthDate: "",
            gender: "",
            address: "",
            contactNumber: ""
        },

        education: {
            educationLevel: "",
            schoolName: "",
            yearGraduated: "",
            educationProof: ""
        },

        certificate: {
            certificateFile: "",
            certificateTitle: "",
            certificateId: "",
            certificateExpiry: ""
        }
    });

    return (
        <ProfileContext.Provider value={{ profileData, setProfileData }}>
            {children}
        </ProfileContext.Provider>
    );
};