import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div>
            <p>HOMEPAGE</p>
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Homepage;