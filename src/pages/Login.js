import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
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
    <div className="flex flex-col items-center justify-top h-screen bg-gray p-10">
      <img
        className="mt-2 w-28 h-28 rounded-2xl"
        src={require("C:/Users/karolispakalnis/Desktop/lesson_generating_front/src/assets/images/logo.png")}
        alt="Your Logo Alt Text"
      />
      <p className="text-white text-xl font-semibold mb-10">Cyber Learn</p>
      <form className="flex flex-col justify-center items-center border border-gray-700 w-96 p-8 pb-4 second-bg-gray rounded-xl shadow">
        <div className="mb-3 w-full">
          <label className="text-primary text-gray-300" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={`w-full p-1 mt-1 text-gray-200 outline-none border border-gray-800 namefield-bg-gray focus:outline-blue-700 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            }`}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6 w-full">
          <label className="text-primary text-gray-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`w-full p-1 mt-1 text-gray-200 outline-none border border-gray-800 namefield-bg-gray focus:outline-blue-700 ${
              loginFailed
                ? "border-b-2 border-red-600"
                : "border-b-2 border-primary"
            }`}
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
          className="flex-grow mt-5 transform transition-transform duration-100 ease-in-out py-1 text-base text-blue-700 hover:text-blue-800 active:scale-95 rounded"
          onClick={handleRegister}
        >
          Don`t have and account? Sign up here!
        </button>
      </form>
    </div>
  );
};

export default Login;
