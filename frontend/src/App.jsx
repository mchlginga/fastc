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
import AdminProfileSetup from "./pages/auth/AdminProfileSetup";
import CompanyProfileSetup from "./pages/auth/CompanyProfileSetup";
import VerifyEmail from "./pages/auth/VerifyEmail";

/* user or trainees */
import UserDashboard from "./pages/user/UserDashboard";
import UserHome from "./pages/user/UserHome";
import UserCourses from "./pages/user/UserCourses";
import UserCertificates from "./pages/user/UserCertificates";
import UserProfile from "./pages/user/UserProfile";
import UserSettings from "./pages/user/UserSettings";
import CourseDetail from "./pages/user/CourseDetail";
import Lesson from "./pages/user/Lesson";

/* admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfileReview from "./pages/admin/AdminProfileReview";
import AdminHome from "./pages/admin/Home";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminCertificates from "./pages/admin/Certificates";
import AdminJob from "./pages/admin/JobMatching";
import AdminProfile from "./pages/admin/Profile";

/* company */
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyHome from "./pages/company/Home";
import CompanyTrainees from "./pages/company/Trainees";
import CompanyShortlist from "./pages/company/Shortlist";
import CompanyProfile from "./pages/company/Profile";

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

                {/* profile profile setup route */}
                {/* Profile setup routes */}
                <Route
                    path="/profile-setup"
                    element={
                        <ProtectedRoute
                            allowedRoles={["user"]}
                            condition={(user) =>
                                user && !user.isProfileComplete
                            }
                            redirectTo="/user"
                        >
                            <ProfileSetup />
                        </ProtectedRoute>
                    }
                />

                {/* admin profile setup route */}
                <Route
                    path="/admin-profile-setup"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                            condition={(user) =>
                                user && !user.isProfileComplete
                            }
                            redirectTo="/admin"
                        >
                            <AdminProfileSetup />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/company-profile-setup"
                    element={
                        <ProtectedRoute
                            allowedRoles={["company"]}
                            condition={(user) =>
                                user && !user.isProfileComplete
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
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<UserHome />} />
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
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<AdminHome />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route
                        path="certificates"
                        element={<AdminCertificates />}
                    />
                    <Route path="job-match" element={<AdminJob />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route
                        path="profile-review"
                        element={<AdminProfileReview />}
                    />
                </Route>

                {/* Company Routes */}
                <Route
                    path="/company/*"
                    element={
                        <ProtectedRoute allowedRoles={["company", "admin"]}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route path="" element={<CompanyHome />} />
                    <Route path="trainees" element={<CompanyTrainees />} />
                    <Route path="shortlist" element={<CompanyShortlist />} />
                    <Route path="profile" element={<CompanyProfile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
