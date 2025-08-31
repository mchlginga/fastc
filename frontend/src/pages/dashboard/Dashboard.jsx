import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/Button";

export default function Dashboard() {
    const { user, handleLogout } = useContext(AuthContext);
    
    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Your role: {user?.role}</p>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};