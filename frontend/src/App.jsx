import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Homepage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfileSetup from "./pages/auth/ProfileSetup";

import UserHome from "./pages/user/Home";
import UserCourses from "./pages/user/Courses";
import UserCertificates from "./pages/user/Certificates";
import UserProfile from "./pages/user/Profile";

import AdminHome from "./pages/admin/Home";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminCertificates from "./pages/admin/Certificates";
import AdminJob from "./pages/admin/JobMatching";
import AdminProfile from "./pages/admin/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route
                    path="/reset-password/:token?"
                    element={<ResetPassword />}
                />

                {/* profile setup route */}
                <Route
                    path="/profile-setup/*"
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
                    <Route path="jobMatch" element={<AdminJob />} />
                    <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* Company Routes */}
                <Route
                    path="/company/*"
                    element={
                        <ProtectedRoute allowedRoles={["company", "admin"]}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
