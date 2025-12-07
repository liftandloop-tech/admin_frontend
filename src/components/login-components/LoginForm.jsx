import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setError, setLoading } from "../../features/auth/authSlice";
import {
  useLoginSuperAdminMutation,
  useLoginResellerMutation,
} from "../../store/api/endpoints/authApi";
import { selectIsAuthenticated } from "../../features/auth/authSlice";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [userType, setUserType] = useState("super_admin"); // Default to super_admin

  const [loginSuperAdmin, { isLoading: isSuperAdminLoading }] = useLoginSuperAdminMutation();
  const [loginReseller, { isLoading: isResellerLoading }] = useLoginResellerMutation();

  const isLoading = isSuperAdminLoading || isResellerLoading;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!emailOrMobile || !password) {
      setLoginError("Please enter both email/mobile and password");
      return;
    }

    dispatch(setLoading(true));

    try {
      const credentials = {
        email: emailOrMobile.includes("@") ? emailOrMobile : undefined,
        mobile: emailOrMobile.includes("@") ? undefined : emailOrMobile,
        password,
      };

      let response;
      
      if (userType === "super_admin") {
        response = await loginSuperAdmin(credentials).unwrap();
      } else {
        response = await loginReseller(credentials).unwrap();
      }

      // Set credentials in Redux store
      dispatch(setCredentials(response));

      // Navigate to dashboard or intended destination
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      
      // Extract error message from various possible error structures
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error?.data) {
        // Check for validation errors (array format)
        if (error.data.errors && Array.isArray(error.data.errors) && error.data.errors.length > 0) {
          errorMessage = error.data.errors[0].msg || error.data.message || errorMessage;
        } 
        // Check for standard error message
        else if (error.data.message) {
          errorMessage = error.data.message;
        }
        // Check for error object with message
        else if (error.data.error && typeof error.data.error === 'string') {
          errorMessage = error.data.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-600 text-base">
            Sign in to manage your business operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="super_admin"
                  checked={userType === "super_admin"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Super Admin</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="reseller"
                  checked={userType === "reseller"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Reseller</span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{loginError}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="emailOrMobile"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email / Mobile Number
            </label>
            <input
              type="text"
              id="emailOrMobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder="Enter your email or mobile number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
              required
              disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015.12 5.12m3.17 1.17L3 3m0 0l18 18m-3.29-3.29a9.97 9.97 0 01-1.563 3.029M12 12l-4.242-4.242M12 12l3.29 3.29"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
