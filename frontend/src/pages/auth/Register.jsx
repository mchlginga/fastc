import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Register = () => {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
    emailConfirm: "",
    firstName: "",
    surname: "",
    city: "",
    country: "Philippines",
    privacyAgreement: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Register.jsx mounted: Checking AOS and Feather");
    if (window.AOS) window.AOS.refresh();
    if (window.feather) window.feather.replace();
  }, []);

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

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (form.email !== form.emailConfirm) {
      setError("Email addresses do not match.");
      setLoading(false);
      return;
    }

    if (!form.privacyAgreement) {
      setError("You must agree to the privacy policy to continue.");
      setLoading(false);
      return;
    }

    try {
      const userData = await register({
        username: form.username,
        firstName: form.firstName,
        surname: form.surname,
        email: form.email,
        password: form.password,
        city: form.city,
        country: form.country,
        privacyAgreement: form.privacyAgreement
      });
      setUser(userData);
      const redirectPath = getRedirectPath(userData.role);
      navigate(redirectPath);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

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
            Join our platform to access digital profiling, certification, and job matching opportunities.
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
            <p className="text-gray-600">Join the FAST-C community</p>
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your username"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your email"
            />
            <Input
              label="Confirm Email"
              type="email"
              name="emailConfirm"
              value={form.emailConfirm}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Confirm your email"
            />
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your first name"
            />
            <Input
              label="Surname"
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your surname"
            />
            <Input
              label="City"
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your city"
            />
            <Input
              label="Country"
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your country"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your password"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
              className="input-focus w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Confirm your password"
            />
            <div className="flex items-center space-x-2">
              <input
                id="privacyAgreement"
                name="privacyAgreement"
                type="checkbox"
                checked={form.privacyAgreement}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="privacyAgreement" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500 underline font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              disabled={loading || !form.privacyAgreement}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 FAST-C Digital Profiling System. All rights reserved.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;