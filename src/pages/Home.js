import React from "react";
import NavBar from "../components/Home/NavBar";
import HomeSection from "../components/Home/HomeSection";
import start_now from "../assets/images/start_now.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";

const Home = () => {
  const theme = useSelector(selectTheme);
  return (
    <div
      className={`flex flex-col items-center ${
        theme.isDarkTheme
          ? "bg-cover bg-futuristic_background"
          : "light-primary-bg"
      }`}
    >
      <NavBar />
      <div className="flex flex-col pt-10 mt-10">
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
      <button>
        <div className="flex flex-col items-left justify-center m-5 second-bg-gray_transparent rounded-full border boder-bg-blue">
          <a href="/login">
            <img
              className={"m-3 w-32 h-auto rounded-full "}
              src={start_now}
              alt=""
            />
          </a>
        </div>
      </button>
    </div>
  );
};

export default Home;
