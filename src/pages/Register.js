import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeButton from "../components/Global/ThemeButton";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";
import logo from "../assets/images/logo.png";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const theme = useSelector(selectTheme);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
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
      navigate("/home");
    } else {
      console.log("Failed to login");
      setLoginFailed(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div
      className={`flex flex-col items-center justify-top h-screen p-8 ${
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
          CyberLearn
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
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            } ${theme.isDarkTheme ? "dark-field-cl" : "light-field-cl"}`}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
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
        <div className="mb-3 w-full">
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
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            } ${theme.isDarkTheme ? "dark-field-cl" : "light-field-cl"}`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 w-full">
          <label
            className={`text-primary  ${
              theme.isDarkTheme ? "text-white" : "text-black"
            }`}
            htmlFor="password"
          >
            Repeat Password
          </label>
          <input
            id="repeat_password"
            className={`w-full p-1 mt-1 text-black outline-none focus:outline-blue-600 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            } ${theme.isDarkTheme ? "dark-field-cl" : "light-field-cl"}`}
            type="password"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
        </div>
        <button
          className="flex-grow m-1 mt-4 w-5/6 transform transition-transform duration-100 ease-in-out py-1 text-white bg-blue-700 hover:bg-blue-800 active:scale-95 rounded"
          onClick={handleRegister}
        >
          Create an account
        </button>
        <button
          className="flex-grow mt-5 transform transition-transform duration-100 ease-in-out py-1 text-base text-blue-700 hover:text-blue-800 active:scale-95 rounded"
          onClick={handleLogin}
        >
          Have and account? Log in here!
        </button>
      </form>
      <ThemeButton passed_props={"mt-4"} />
    </div>
  );
};

export default Register;
