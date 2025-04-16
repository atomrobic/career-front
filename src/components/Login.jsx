import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JobSeaLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",    // Add email to login form
    phone_number: "",
    password1: "",
    password2: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Animation state for the waves
  const [wavePosition, setWavePosition] = useState(0);

  // Animation effect
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setWavePosition((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(animationInterval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && formData.password1 !== formData.password2) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const url = isLogin ? "/api/api/login/" : "/api/api/register/";
    const requestData = isLogin
      ? { 
          username: formData.username, 
          email: formData.email,     // Include email in login request
          password: formData.password1 
        }
      : formData;

    try {
      const response = await fetch(`https://career-backend-production.up.railway.app${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        if (isLogin) {
          if (!data.access || !data.refresh) {
            setError("Invalid response from server: Missing tokens");
            return;
          }

          // Store JWT tokens
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);

          // Decode token to get user info
          try {
            const tokenPayload = JSON.parse(atob(data.access.split(".")[1]));
            localStorage.setItem("user_id", tokenPayload.user_id);
            localStorage.setItem("username", tokenPayload.username);
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }

        navigate("/home"); // Redirect to home page after login/signup
      } else {
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(" "));
        } else if (typeof data === "object") {
          setError(Object.values(data).flat().join(" "));
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Panel - Logo and Animation */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-700 w-full md:w-2/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[40vh] md:min-h-screen md:sticky md:top-0">
        {/* Animated Wave Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,186.7C672,192,768,224,864,224C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: `${wavePosition}% bottom`,
            backgroundSize: '100% 50%',
          }}
        />
        
        {/* Animated Floating Elements */}
        <div className="absolute h-full w-full">
          <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-white opacity-10 animate-pulse"></div>
          <div className="absolute top-3/4 left-1/3 w-16 h-16 rounded-full bg-white opacity-5 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white opacity-5 animate-pulse" style={{ animationDuration: '4s' }}></div>
        </div>
        
        {/* Logo and Text */}
        <div className="z-10 text-center px-6">
          <div className="mb-8 transform transition-all duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <svg className="w-16 h-16 text-blue-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V8z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">JobSea</h1>
            <p className="text-blue-100 mt-2 text-xl">Navigate Your Career Journey</p>
          </div>
          
          <div className="bg-blue-800 bg-opacity-30 p-6 rounded-xl backdrop-blur-sm border border-blue-700 max-w-md">
            <p className="text-blue-50 mb-4">
              {isLogin 
                ? "Access thousands of job opportunities tailored to your skills and preferences."
                : "Join our community of professionals and connect with top employers worldwide."
              }
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">10k+</span>
                <span className="text-blue-200 text-sm">Jobs</span>
              </div>
              <div className="w-px bg-blue-600"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">5k+</span>
                <span className="text-blue-200 text-sm">Companies</span>
              </div>
              <div className="w-px bg-blue-600"></div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white">15k+</span>
                <span className="text-blue-200 text-sm">Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-full md:w-3/5 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-600 text-lg">
              {isLogin
                ? "Please enter your details to access your account"
                : "Fill in your information to get started"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
            {/* Username Field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Email Field (Always show) */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Rest of the form fields */}
            {!isLogin && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number Field (Only for Signup) */}
            {!isLogin && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Role Selection (Only for Signup) */}
            {!isLogin && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="company_staff">Company Staff</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password1"
                  value={formData.password1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field (Only for Signup) */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-lg shadow-md transition-all duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "login"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Switch Between Login and Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-blue-600 font-medium ml-2 hover:text-blue-800 focus:outline-none"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </form>

          {/* Additional Help Text */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact support</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeaLogin;