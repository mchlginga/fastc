import { useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import Button from "../../components/Button";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return(
        <div>
            <h1>Hello, World!</h1>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default Dashboard;