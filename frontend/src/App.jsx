import { BrowserRouter, Routes, Route } from "react-router-dom";

/* public */
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Course";
import HowTo from "./pages/HowTo";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivPol";
import TermSer from "./pages/TermSer";
import PendingApproval from "./pages/PendingApproval";

/* auth */
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfileSetup from "./pages/auth/ProfileSetup";
import CompanyProfileSetup from "./pages/auth/CompanyProfileSetup";
import VerifyEmail from "./pages/auth/VerifyEmail";

/* user or trainees */
import UserHeaderFooter from "./pages/user/UserHeaderFooter";
import UserDashboard from "./pages/user/UserDashboard";
import UserCourses from "./pages/user/UserCourses";
import UserCertificates from "./pages/user/UserCertificates";
import UserProfile from "./pages/user/UserProfile";
import UserSettings from "./pages/user/UserSettings";
import CourseDetail from "./pages/user/CourseDetail";
import Lesson from "./pages/user/Lesson";

/* admin */
import AdminHeaderFooter from "./pages/admin/AdminHeaderFooter";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminJob from "./pages/admin/AdminJobMatching";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";

/* company */
import CompanyHeaderFooter from "./pages/company/CompanyHeaderFooter";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanySettings from "./pages/company/CompanySettings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/how-to" element={<HowTo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route
                    path="/reset-password/:token?"
                    element={<ResetPassword />}
                />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermSer />} />
                <Route path="pending-approval" element={<PendingApproval />} />

                {/* profile setup route */}
                <Route
                    path="/profile-setup"
                    element={
                        <ProtectedRoute
                            allowedRoles={["user", "superAdmin"]}
                            condition={(user) =>
                                user &&
                                (user.role === "superAdmin" ||
                                    !user.isProfileComplete)
                            }
                            redirectTo="/user"
                        >
                            <ProfileSetup />
                        </ProtectedRoute>
                    }
                />

                {/* company profile setup route */}
                <Route
                    path="/company-profile-setup"
                    element={
                        <ProtectedRoute
                            allowedRoles={["company", "superAdmin"]}
                            condition={(user) =>
                                user &&
                                (user.role === "superAdmin" ||
                                    !user.isProfileComplete)
                            }
                            redirectTo="/company"
                        >
                            <CompanyProfileSetup />
                        </ProtectedRoute>
                    }
                />

                {/* User or Trainee Routes */}
                <Route
                    path="/user/*"
                    element={
                        <ProtectedRoute allowedRoles={["user", "superAdmin"]}>
                            <UserHeaderFooter />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<UserDashboard />} />
                    <Route path="courses" element={<UserCourses />} />
                    <Route path="certificates" element={<UserCertificates />} />
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route
                        path="courses/:courseId"
                        element={<CourseDetail />}
                    />
                    <Route
                        path="courses/:courseId/lesson/:lessonId"
                        element={<Lesson />}
                    />
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
                            <AdminHeaderFooter />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route
                        path="certificates"
                        element={<AdminCertificates />}
                    />
                    <Route path="job-match" element={<AdminJob />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Company Routes */}
                <Route
                    path="/company/*"
                    element={
                        <ProtectedRoute
                            allowedRoles={["company", "superAdmin"]}
                        >
                            <CompanyHeaderFooter />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<CompanyDashboard />} />
                    <Route path="profile" element={<CompanyProfile />} />
                    <Route path="settings" element={<CompanySettings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
