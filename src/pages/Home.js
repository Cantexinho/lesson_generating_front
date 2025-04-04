import React from "react";
import NavBar from "../components/Home/NavBar";
import HomeSection from "../components/Home/HomeSection";
import CustomFooter from "../components/Footers/CustomFooter";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";

const Home = () => {
  const theme = useSelector(selectTheme);
  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme.isDarkTheme ? "dark-primary-bg" : "light-primary-bg"
      }`}
    >
      <NavBar />
      <div className="flex-grow flex flex-col pt-10 mt-10 ">
        <HomeSection
          img_placement={"right"}
          img_name={"ai_presenter_1"}
          sectionHeader={"Gather information quickly!"}
          sectionText={
            "In the fast-paced world of today, the ability to gather information quickly is paramount. In the times of information, Artificial Intelligence has emerged as a game-changer, revolutionizing the speed and efficiency with which we can access and process information."
          }
        />
        <HomeSection
          img_placement={"left"}
          img_name={"student_learning"}
          sectionHeader={"Learn efficiently!"}
          sectionText={
            "AI-driven tools excel at predictive analysis, anticipating user needs and proactively providing information before it's explicitly requested. These systems can learn from user behavior, preferences, and historical data to tailor their outputs, creating a personalized and streamlined information retrieval experience."
          }
        />
        <HomeSection
          img_placement={"right"}
          img_name={"futuristic_future"}
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
