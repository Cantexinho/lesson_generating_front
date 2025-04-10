import React from "react";
import NavBar from "../components/Home/NavBar";
import ImageSection from "../components/Sections/ImageSection";
import CustomFooter from "../components/Footers/CustomFooter";
import TopSection from "../components/Sections/TopSection";
import ToolsSection from "../components/Sections/ToolsSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary dark:bg-secondary-dark">
      <NavBar />
      <div className="flex-grow flex flex-col">
        <TopSection />
        <ToolsSection />
        <ImageSection
          imgPlacement={"right"}
          imgName={"ai_presenter_1"}
          sectionProps={
            "flex items-center justify-center gap-8 p-8 lg:px-24 xl:px-32 w-full bg-cover bg-center"
          }
          imageProps={"w-72"}
          sectionHeader={"Gather information quickly!"}
          sectionText={
            "In the fast-paced world of today, the ability to gather information quickly is paramount. In the times of information, Artificial Intelligence has emerged as a game-changer, revolutionizing the speed and efficiency with which we can access and process information."
          }
        />
        <ImageSection
          imgPlacement={"left"}
          imgName={"student_learning"}
          sectionProps={
            "flex items-center justify-center gap-8 p-8 lg:px-24 xl:px-32 w-full "
          }
          imageProps={"w-72"}
          sectionHeader={"Learn efficiently!"}
          sectionText={
            "AI-driven tools excel at predictive analysis, anticipating user needs and proactively providing information before it's explicitly requested. These systems can learn from user behavior, preferences, and historical data to tailor their outputs, creating a personalized and streamlined information retrieval experience."
          }
        />
        <ImageSection
          imgPlacement={"right"}
          imgName={"futuristic_future"}
          sectionProps={
            "flex items-center justify-center gap-8 p-8 lg:px-24 xl:px-32 w-full "
          }
          imageProps={"w-72"}
          sectionHeader={"Move to a new beginning!"}
          sectionText={
            "AI is transforming the way we access and utilize data and promises a future where the quest for information is not just quick but also exceptionally insightful."
          }
        />
      </div>
      <CustomFooter />
    </div>
  );
};

export default Home;
