import { Routes, Route } from "react-router-dom";
import { Award } from "react-feather";
import PersonalInfo from "../../components/profileSetup/PersonalInfo";
import EducBackground from "../../components/profileSetup/EducBackground";
import Certificates from "../../components/profileSetup/Certificates";
import Review from "../../components/profileSetup/Review";
import { ProfileProvider } from "../../context/ProfileContext";

function ProfileSetup() {
    return (
        <ProfileProvider>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-sm p-8">
                    <div className="flex items-center justify-center mb-6">
                        <Award size={40} className="text-blue-600 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">
                            FAST-C
                        </h1>
                    </div>
                    <Routes>
                        <Route path="/step1" element={<PersonalInfo />} />
                        <Route path="/step2" element={<EducBackground />} />
                        <Route path="/step3" element={<Certificates />} />
                        <Route path="/step4" element={<Review />} />
                        <Route path="*" element={<PersonalInfo />} />
                    </Routes>
                </div>
            </div>
        </ProfileProvider>
    );
}

export default ProfileSetup;
