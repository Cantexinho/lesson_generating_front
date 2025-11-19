import React, { useState, useEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import ThemeButton from "features/theme/components/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "features/theme/themeSlice";
import { LOGO_TEXT } from "shared/constants/logoText";
import { authService } from "features/auth/services/authService";

const Login = memo(() => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useSelector(selectTheme);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for registration success message
  useEffect(() => {
    if (location.state?.message) {
      // You could display a success notification here
      console.log(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setLoginFailed(true);
      setErrorMessage("Username and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.login(username, password);
      navigate("/playground");
    } catch (error) {
      setLoginFailed(true);
      setErrorMessage(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await authService.googleLogin(credentialResponse);
      navigate("/playground");
    } catch (error) {
      setLoginFailed(true);
      setErrorMessage(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleError = () => {
    setLoginFailed(true);
    setErrorMessage("Google login was canceled or failed");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-secondary dark:bg-secondary-dark">
      <a className="flex flex-col items-center justify-center" href="/">
        <img
          className="mt-2 w-28 h-28 rounded-2xl"
          src={
            theme.isDarkTheme
              ? require("assets/images/legatus-logo-white.png")
              : require("assets/images/legatus-logo-black.png")
          }
          alt="Your Logo Alt Text"
        />
        <p className="text-xl font-semibold mt-2 mb-4 text-black dark:text-white">
          {LOGO_TEXT.logo}
        </p>
      </a>
      <form className="flex flex-col justify-center items-center w-96 p-8 pb-4 rounded-xl shadow bg-transparent-light dark:bg-transparent-dark dark:border dark:border-gray-700">
        {loginFailed && (
          <div className="w-full p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errorMessage}
          </div>
        )}
        <div className="mb-3 w-full">
          <label className="text-black dark:text-white" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed && !username
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            }`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6 w-full">
          <label className="text-black dark:text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed && !password
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            }`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className={`flex-grow m-1 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        
        {/* Google Login Button */}
        <div className="w-5/6 my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <div className="w-5/6 flex justify-center mb-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme={theme.isDarkTheme ? "filled_black" : "outline"}
            text="signin_with"
            shape="pill"
          />
        </div>
        
        <button
          className="flex-grow mt-4 transform transition-transform duration-100 ease-in-out py-1 text-base text-blue-600 hover:text-blue-800 active:scale-95 rounded"
          onClick={handleRegister}
          disabled={isLoading}
        >
          Don't have an account? Sign up here!
        </button>
      </form>
      <ThemeButton passed_props={"mt-4"} />
    </div>
  );
});

export default Login;