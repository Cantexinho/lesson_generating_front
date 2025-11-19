import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeButton from "features/theme/components/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "features/theme/themeSlice";
import { LOGO_TEXT } from "shared/constants/logoText";
import { authService } from "features/auth/services/authService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordRepeatError, setPasswordRepeatError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const theme = useSelector(selectTheme);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setPasswordRepeatError("");
    setGeneralError("");

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!regexEmail.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    const regexUsername = /^[a-zA-Z0-9_]{3,20}$/;
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (!regexUsername.test(username)) {
      setUsernameError("Username must be 3-20 characters and contain only letters, numbers and underscore");
      isValid = false;
    }

    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.]).{8,}$/;
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!regexPassword.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      isValid = false;
    }

    if (!passwordRepeat) {
      setPasswordRepeatError("Please confirm your password");
      isValid = false;
    } else if (password !== passwordRepeat) {
      setPasswordRepeatError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          username, 
          password 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.message) {
          setGeneralError(data.message);
        } else if (data.errors) {
          if (data.errors.email) setEmailError(data.errors.email);
          if (data.errors.username) setUsernameError(data.errors.username);
          if (data.errors.password) setPasswordError(data.errors.password);
        } else {
          setGeneralError("Registration failed. Please try again.");
        }
        return;
      }
      
      try {
        await authService.login(username, password);
        navigate("/playground");
      } catch (loginError) {
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please log in with your new account."
          }
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setGeneralError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
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
        {generalError && (
          <div className="w-full p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {generalError}
          </div>
        )}
        
        <div className="mb-4 w-full">
          <label className="text-black dark:text-white" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              emailError ? "border-b-2 border-red-600" : "border-b-2 border-primary"
            }`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <p className="text-sm text-red-600 mt-1">{emailError}</p>
          )}
        </div>
        
        <div className="mb-4 w-full">
          <label className="text-black dark:text-white" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              usernameError ? "border-b-2 border-red-600" : "border-b-2 border-primary"
            }`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && (
            <p className="text-sm text-red-600 mt-1">{usernameError}</p>
          )}
        </div>
        
        <div className="mb-4 w-full">
          <label className="text-black dark:text-white" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              passwordError ? "border-b-2 border-red-600" : "border-b-2 border-primary"
            }`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-sm text-red-600 mt-1">{passwordError}</p>
          )}
        </div>
        
        <div className="mb-6 w-full">
          <label className="text-black dark:text-white" htmlFor="repeat_password">
            Repeat Password
          </label>
          <input
            id="repeat_password"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              passwordRepeatError ? "border-b-2 border-red-600" : "border-b-2 border-primary"
            }`}
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
          {passwordRepeatError && (
            <p className="text-sm text-red-600 mt-1">{passwordRepeatError}</p>
          )}
        </div>
        
        <button
          className={`flex-grow m-1 mt-2 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create an account"}
        </button>
        
        <button
          className="flex-grow mt-5 transform transition-transform duration-100 ease-in-out py-1 text-base text-blue-700 hover:text-blue-800 active:scale-95 rounded"
          onClick={handleLogin}
          disabled={isLoading}
        >
          Have an account? Log in here!
        </button>
      </form>
      <ThemeButton passed_props={"mt-4"} />
    </div>
  );
};

export default Register;