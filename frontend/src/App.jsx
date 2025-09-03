import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/errors/Unauthorized";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={ <Login /> } />

                <Route path="/unauthorized" element={ <Unauthorized /> } />

                
                {/* Trainee-only Routes */}
                <Route 
                    path="/dashboard" 
                    element={ 
                        <ProtectedRoute allowedRoles={["user", "admin"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Admin-only Routes */}

                {/* Company-only Routes */}

            </Routes>
        </BrowserRouter>
    );
};

export default App;