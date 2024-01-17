import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const HomeSectionLeft = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center max-w-screen max-h-screen mt-4 second-bg-gray_transparent border border-cl_color_dark_blue">
      <img
        className="m-4 max-w-sm h-auto rounded-2xl"
        src={require("C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/student_learning.png")}
      />
      <div className="flex flex-col items-left justify-center ml-20">
        <h1 className="text-2xl font-bold text-white pb-4">
          Learn efficiently!
        </h1>
        <p className="text-xl text-white">
          AI-driven tools excel at predictive analysis, anticipating user needs
          and proactively providing information before it's explicitly
          requested. These systems can learn from user behavior, preferences,
          and historical data to tailor their outputs, creating a personalized
          and streamlined information retrieval experience.
        </p>
      </div>
    </div>
  );
};

export default HomeSectionLeft;
