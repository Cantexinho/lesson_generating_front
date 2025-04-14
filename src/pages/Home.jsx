import React from "react";
import NavBar from "../components/common/NavBar";
import CustomFooter from "../components/common/CustomFooter";
import TopSection from "../components/Sections/TopSection";
import ToolsSection from "../components/Sections/ToolsSection";
import NewsSection from "../components/Sections/NewsSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary dark:bg-secondary-dark">
      <NavBar />
      <div className="flex-grow flex flex-col">
        <TopSection />
        <NewsSection />
        <ToolsSection />
      </div>
      <CustomFooter />
    </div>
  );
};

export default Home;