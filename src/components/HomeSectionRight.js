import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const HomeSectionRight = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center max-w-screen max-h-screen mt-4 second-bg-gray_transparent border border-cl_color_dark_blue">
      <div className="flex flex-col items-left justify-center ml-20">
        <h1 className="text-2xl font-bold text-white pb-4">
          Gather information quicly!
        </h1>
        <p className="text-xl text-white">
          In the fast-paced world of today, the ability to gather information
          quickly is paramount. In the times of information, Artificial
          Intelligence has emerged as a game-changer, revolutionizing the speed
          and efficiency with which we can access and process information.
        </p>
      </div>
      <img
        className="m-4 max-w-sm h-auto rounded-2xl"
        src={require("C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/ai_presenter_1.png")}
      />
    </div>
  );
};

export default HomeSectionRight;
