import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as inputHandlers from "../utils/inputHandlers";
import PgMain from "../components/PgMain";
import PgNavBar from "../components/PgNavBar";

const Playground = () => {
  const navigate = useNavigate();
  const handleLogoutSubmit = () => {
    inputHandlers.handleLogout(navigate);
  };
  return (
    <div className="flex items-center min-h-screen bg-gray">
      <PgNavBar />
      <div className="flex-grow"></div>
      <PgMain />
      <div className="flex-grow">
        <button
          onClick={handleLogoutSubmit}
          className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Playground;
