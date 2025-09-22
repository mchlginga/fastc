import { Routes, Route } from "react-router-dom";

import PersonalInfo from "../../components/profileSetup/PersonalInfo";
import EducBackground from "../../components/profileSetup/EducBackground";
import Certificates from "../../components/profileSetup/Certificates";
import Review from "../../components/profileSetup/Review";
import { ProfileProvider } from "../../context/ProfileContext";
import { Award } from "react-feather";

function ProfileSetup() {
  return (
    <ProfileProvider>
        <div className="flex min-h-screen">
            {/* left side branding */}
            <div className="gradient-bg text-white w-full lg:w-1/3 flex-col items-center justify-center p-8 text-center hidden lg:flex">
                <div className="relative z-10">
                    <div className="flex items-center justify-center mb-8">
                        <Award size={48} className="mr-4"/>
                        <h1 className="text-3xl font-bold tracking-tight">FAST-C</h1>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Profile Setup</h2>
                    <p className="text-base opacity-90 max-w-sm leading-relaxed">
                    Complete your profile to start your journey with Fernandino Assessment & Skills Training Center.
                </p>
                </div>
            </div>

            <div className="w-full lg:w-2/3 flex items-center justify-center p-6">
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