import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const PostLogin = () => {
  const navigate = useNavigate();
  const handleLoginSubmit = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-gray">
      <div className="flex-1 flex items-center justify-end bg-cover bg-prelogin_login">
        <div
          className="rounded-lg p-4 max-w-xs w-full bg-blue mx-4 cursor-pointer transform transition-all duration-500 ease-in-out hover:bg-gray-700 flex items-center justify-center"
          onClick={() => handleLoginSubmit()}
        >
          <button className="text-xl font-semibold rounded text-white">
            Playground
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-start bg-cover bg-prelogin_signup">
        <div
          className="rounded-lg p-4 max-w-xs w-full bg-blue mx-4 cursor-pointer transform transition-all duration-500 ease-in-out hover:bg-gray-700 flex items-center justify-center"
          onClick={() => handleLoginSubmit()}
        >
          <button className="text-xl font-semibold rounded text-white">
            AI teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostLogin;
