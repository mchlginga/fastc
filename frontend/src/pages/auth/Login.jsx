import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Login = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRedirectPath = (role) => {
    const rolePaths = {
      admin: "/admin",
      company: "/company",
      user: "/user"
    };
    return rolePaths[role] || "/user";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userData = await login(form.email, form.password, form.rememberMe);
      setUser(userData);
      const redirectPath = getRedirectPath(userData.role);
      navigate(redirectPath);
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true
      });
    } else {
      console.warn("AOS not loaded");
    }
    if (window.feather) {
      window.feather.replace();
    } else {
      console.warn("Feather icons not loaded");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="gradient-bg text-white w-full lg:w-1/2 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div data-aos="fade-up" className="relative z-10">
          <div className="flex items-center justify-center mb-8">
            <i data-feather="award" className="w-16 h-16 mr-4"></i>
            <h1 className="text-4xl font-bold">FAST-C</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Fernandino Assessment & Skills Training</h2>
          <p className="text-lg opacity-90 max-w-md">
            Empowering trainees with digital profiling and AI-powered job matching for better opportunities.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
            <p className="text-gray-600">Sign in to access your FAST-C account</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-focus"
              placeholder="Enter your email"
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-focus"
              placeholder="Enter your password"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Logging in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to FAST-C?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Fernandino Assessment and Skills Training Center. All rights reserved.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;