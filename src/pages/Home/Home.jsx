import React from "react";
import TopSection from "shared/components/Sections/TopSection";
import ToolsSection from "shared/components/Sections/ToolsSection";
import NewsSection from "shared/components/Sections/NewsSection";

const Home = () => {
  return (
    <>
      <TopSection />
      <NewsSection />
      <ToolsSection />
    </>
  );
};

export default Home;