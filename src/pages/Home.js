import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import HomeSectionLeft from "../components/HomeSectionLeft";
import HomeSectionRight from "../components/HomeSectionRight";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray">
      <NavBar />
      <HomeSectionRight />
      <HomeSectionLeft />
      <div className="flex justify-center max-w-screen max-h-screen mt-4 second-bg-gray_transparent border border-cl_color_dark_blue">
        <div className="flex flex-col items-left justify-center ml-20">
          <h1 className="text-2xl font-bold text-white pb-4">
            Move to a new beginning!
          </h1>
          <p className="text-xl text-white">
            AI is transforming the way we access and utilize data and promises a
            future where the quest for information is not just quick but also
            exceptionally insightful.
          </p>
        </div>
        <img
          className="m-4 max-w-sm h-auto rounded-2xl"
          src={require("C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/futuristic_future.png")}
        />
      </div>
    </div>
  );
};

export default Home;
