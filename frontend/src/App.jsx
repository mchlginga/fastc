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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={ <Login /> } />
                <Route path="/register" element={ <Register /> } />
                <Route path="/unauthorized" element={ <Unauthorized /> } />
                <Route path="/reset-password/:token?" element={<ResetPassword />}/>
                
                {/* User or Trainee Routes */}
                <Route 
                    path="/user/*" 
                    element={ 
                        <ProtectedRoute allowedRoles={["user"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Admin Routes */}
                <Route 
                    path="/admin/*" 
                    element={ 
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Company Routes */}
                <Route 
                    path="/company/*" 
                    element={ 
                        <ProtectedRoute allowedRoles={["company", "admin"]}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    } 
                />

                <Route path="*" element={<NotFound /> }/>

            </Routes>
        </BrowserRouter>
    );
};

export default App;