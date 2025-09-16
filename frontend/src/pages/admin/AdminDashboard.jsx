import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { getCompletions } from "../../services/authService";
import Button from "../../components/Button";
import Input from "../../components/Input";

const AdminDashboard = () => {
    const {user, handleLogout } = useAuth();
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [courseForm, setCourseForm] = useState({
        name: "",
        description: "",
        duration: ""
    });
    const [completionForm, setCompletionForm] = useState({
        user: "",
        course: ""
    });
    const [editUserForm, setEditUserForm] = useState({
        id: "",
        username: "",
        firstName: "",
        surname: "",
        city: "",
        country: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect( () => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [courseData, userData, completionData] = await Promise.all([
                    api.get("/course"),
                    api.get("/user"),
                    getCompletions(user._id, user.role === "admin")
                ]);

                setCourses(courseData.data);
                setUsers(userData.data);
                setCompletions(completionData);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
        if (user && user.role === "admin") fetchData();
        else navigate("/login");
    }, [user, navigate]);

    const handleCourseChange = (e) => {
        const { name, value } = e.target;
        setCourseForm({ ...courseForm, [name]: value });
    };

    const handleCompletionChange = (e) => {
        const { name, value } = e.target;
        setCompletionForm({ ...completionForm, [name]: value });
    };

    const handleEditUserChange = (e) => {
        const { name, value } = e.target;
        setEditUserForm({ ...editUserForm, [name]: value });
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/course", courseForm);
            setCourses([...courses, data]);
            setCourseForm({
                name: "",
                description: "",
                duration: ""
            });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create course.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompletionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/completion", completionForm);
            setCompletions([...completions, data]);
            setCompletionForm({ user: "", course: "" });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to assign completion.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.put(`/user/${editUserForm.id}`, {
                username: editUserForm.username,
                firstName: editUserForm.firstName,
                surname: editUserForm.surname,
                name: `${editUserForm.firstName} ${editUserForm.surname}`,
                city: editUserForm.city,
                country: editUserForm.country
            });
            setUsers(users.map((u) => (u._id === data._id? data : u)));
            const completionData = await getCompletions(user._id, user.role === "admin");
            setCompletions(completionData);
            setEditUserForm({
                id: "",
                username: "",
                firstName: "",
                surname: "",
                city: "",
                country: ""
            });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        setLoading(true);
        setError("");

        try {
            await api.delete(`/user/${id}`);
            setUsers(users.filter((u) => u._id !== id));
            const completionData = await getCompletions(user._id, user.role === "admin");
            setCompletions(completionData);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to delete user.");
        } finally {
            setLoading(false);
        }
    };

    const startEditUser = (user) => {
        setEditUserForm({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            surname: user.surname,
            city: user.city,
            country: user.country
        });
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-4">Welcome, {user?.name}! Your role: {user?.role}</p>

            {/* Create Course */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Create Course</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleCourseSubmit}>
                    <Input
                        label="Course Name"
                        type="text"
                        name="name"
                        value={courseForm.name}
                        onChange={handleCourseChange}
                        required
                    />
                    <Input
                        label="Description"
                        type="text"
                        name="description"
                        value={courseForm.description}
                        onChange={handleCourseChange}
                        required
                    />
                    <Input
                        label="Duration (e.g., 4 weeks)"
                        type="text"
                        name="duration"
                        value={courseForm.duration}
                        onChange={handleCourseChange}
                        required
                    />
                    <Button
                        type="submit"
                        disabled={loading || !courseForm.name}
                    >
                        {loading ? "Creating..." : "Create Course"}
                    </Button>
                </form>
            </div>

            {/* User Management */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
                {editUserForm.id ? (
                    <form onSubmit={handleEditUserSubmit} className="mb-4">
                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={editUserForm.username}
                            onChange={handleEditUserChange}
                            required
                        />
                        <Input
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={editUserForm.firstName}
                            onChange={handleEditUserChange}
                            required
                        />
                        <Input
                            label="Surname"
                            type="text"
                            name="surname"
                            value={editUserForm.surname}
                            onChange={handleEditUserChange}
                            required
                        />
                        <Input
                            label="City"
                            type="text"
                            name="city"
                            value={editUserForm.city}
                            onChange={handleEditUserChange}
                            required
                        />
                        <Input
                            label="Country"
                            type="text"
                            name="country"
                            value={editUserForm.country}
                            onChange={handleEditUserChange}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-4"
                        >
                            {loading ? "Updating..." : "Update User"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setEditUserForm({ id: "", username: "", firstName: "", surname: "", city: "", country: "",})}
                            className="mt-4"
                        >
                            Cancel
                        </Button>
                    </form>
                ) : (
                    <>
                    {loading ? (
                        <p>Loading users...</p>
                    ) : users.length > 0 ? (
                        <ul className="border rounded p-4">
                            {users.map((u) => (
                                <li key={u._id} className="mb-2 flex justify-between">
                                    <div>
                                        <p>Username: {u.username}</p>
                                        <p>Name: {u.name}</p>
                                        <p>Email: {u.email}</p>
                                        <p>Location: {u.city}, {u.country}</p>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => startEditUser(u)}
                                            className="mr-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteUser(u._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ): (
                        <p>No users found.</p>
                    )}
                    </>
                )}
            </div>

            {/* Assign Completion */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Assign Course Completion</h2>
                <form onSubmit={handleCompletionSubmit}>
                    <select 
                        name="user" 
                        value={completionForm.user}
                        onChange={handleCompletionChange}
                        className="border p-2 mb-2 w-full"
                        required
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                    </select>
                    <select 
                        name="course" 
                        value={completionForm.course}
                        onChange={handleCompletionChange}
                        className="border p-2 mb-2 w-full"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map( (c) => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <Button type="submit" disabled={loading || !completionForm.user || !completionForm.course}>
                        {loading ? "Assignning..." : "Assign Completion"}
                    </Button>
                </form>
            </div>

            {/* Completions List */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Course Completions</h2>
                { loading ? (
                    <p>Loading completions...</p>
                ) : completions.length > 0 ? (
                    <ul className="border rounded p-4">
                        {completions.map( (c) => (
                            <li key={c._id} className="mb-2">
                                <p>User: {c.user?.name || "Unknown User"}</p>
                                <p>Course: {c.course?.name || "Unknown Course"}</p>
                                <p>Completed: {new Date(c.completedAt).toLocaleDateString()}</p>
                            </li>
                        ))}

                    </ul>
                ) : (
                    <p>No completions found.</p>
                )}
            </div>

            <Button onClick={handleLogout} className="mt-4">
                Logout
            </Button>
        </div>
    );
};

export default AdminDashboard;