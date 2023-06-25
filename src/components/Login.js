import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/users", {
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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form
        className="flex flex-col justify-center items-center w-116 p-8 bg-white rounded shadow"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full p-2 mb-6 text-primary border-b-2 border-primary outline-none focus:bg-gray-300"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-6 text-primary border-b-2 border-primary outline-none focus:bg-gray-300"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 bg-primary text-white rounded hover:bg-secondary"
          type="submit"
          value="Login"
        />
        <button
          className="flex-grow w-1/3 transform transition-transform duration-100 ease-in-out py-2 text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded"
          type="submit"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
