import { useAuth } from "../../context/AuthContext";
// import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function CompanyDashboard() {
    const { user, handleLogout } = useAuth();
    
    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Your role: {user?.role}</p>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};