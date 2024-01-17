import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as inputHandlers from "../utils/inputHandlers";
import PgMain from "../components/Playground/PgMain";
import PgNavBar from "../components/Playground/PgNavBar";

const Playground = () => {
  const [parts, setParts] = useState([]);
  const [pgMainState, setPgMainState] = useState([]);

  const navigate = useNavigate();

  const handleLogoutSubmit = () => {
    inputHandlers.handleLogout(navigate);
  };

  useEffect(() => {
    setPgMainState(parts);
  }, [parts]);

  return (
    <div className="flex min-h-screen bg-gray">
      <PgNavBar pgMainState={pgMainState} />
      <PgMain parts={parts} setParts={setParts} />
    </div>
  );
};

export default Playground;
{
  /* <button
        onClick={handleLogoutSubmit}
        className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        Logout
      </button> */
}
