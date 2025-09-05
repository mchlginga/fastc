// TEMPORARY

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { setUser } = useAuth();

    const [form, setForm] = useState({
        // choose your username and password
        username: "",
        password: "",

        // more details
        email: "",
        emailConfirm: "",
        firstName: "",
        surname: "",
        city: "",
        country: "Philippines",

        // privacy agreement
        privacyAgreement: "false"
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { }
    };
};

export default Register;