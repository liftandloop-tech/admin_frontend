import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import LeftPanel from "./components/login-components/LeftPanel";
import LoginForm from "./components/login-components/LoginForm";
import Footer from "./components/login-components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex">
      <LeftPanel />
      <div className="flex-1 bg-white relative flex flex-col">
        <LoginForm />
        <Footer />
      </div>
    </div>
  );
};

export default Login;
