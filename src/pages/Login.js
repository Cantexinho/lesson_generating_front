import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../components/Global/ThemeButton";
import CustomFooter from "../components/Global/CustomFooter";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";
import logo from "../assets/images/logo.png";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const theme = useSelector(selectTheme);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/users/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      navigate("/playground");
    } else {
      console.log("Failed to login");
      setLoginFailed(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen w-screen ${
        theme.isDarkTheme ? "dark-primary-bg" : "light-primary-bg"
      }`}
    >
      <a className="flex flex-col items-center justify-center" href="/">
        <img
          className="mt-2 w-28 h-28 rounded-2xl"
          src={logo}
          alt="Your Logo Alt Text"
        />
        <p
          className={`text-xl font-semibold mt-2 mb-4 ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          Legatus AI
        </p>
      </a>
      <form
        className={`flex flex-col justify-center items-center w-96 p-8 pb-4 rounded-xl shadow ${
          theme.isDarkTheme
            ? "dark-second-bg border border-gray-700"
            : "light-second-bg"
        }`}
      >
        <div className="mb-3 w-full">
          <label
            className={`text-primary  ${
              theme.isDarkTheme ? "text-white" : "text-black"
            }`}
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            } ${theme.isDarkTheme ? "dark-field-cl" : "light-field-cl"}`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6 w-full">
          <label
            className={`text-primary  ${
              theme.isDarkTheme ? "text-white" : "text-black"
            }`}
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            className={`w-full p-1 mt-1 text- outline-none focus:outline-blue-600 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            } ${theme.isDarkTheme ? "dark-field-cl" : "light-field-cl"}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="flex-grow m-1 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded"
          onClick={handleLogin}
        >
          Log in
        </button>
        <button
          className="flex-grow mt-5 transform transition-transform duration-100 ease-in-out py-1 text-base text-blue-600 hover:text-blue-800 active:scale-95 rounded"
          onClick={handleRegister}
        >
          Don`t have and account? Sign up here!
        </button>
      </form>
      <ThemeButton passed_props={"mt-4"} />
    </div>
  );
};

export default Login;
