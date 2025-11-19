import React, { memo } from "react";
import NavBar from "shared/components/NavBar";
import CustomFooter from "shared/components/Footer";
import { Outlet } from "react-router-dom";

const Layout = memo(() => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary dark:bg-secondary-dark">
      <NavBar />
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
      <CustomFooter />
    </div>
  );
});

export default Layout;

