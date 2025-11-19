import React, { useState } from "react";
import LessonGenerationInput from "features/lessons/components/LessonGenerationInput";
import { handleTitleChange } from "features/lessons/utils/inputHandlers";

const TopSection = () => {
  const [title, setTitle] = useState("");
  const bgImage = require("assets/images/lesson_tree.png");

  const handleTitleChangeSubmit = (e) => {
    handleTitleChange(e, setTitle);
  };

  return (
    <section
      className={`flex items-center justify-center min-h-[650px] 2xl:min-h-[1000px] gap-8 p-8 lg:px-24 xl:px-32 w-full bg-cover bg-center primary-bg`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LessonGenerationInput
        handleTitleChange={handleTitleChangeSubmit}
        passedProps=""
        placeholderText={"Tell me what you want to learn"}
        onSubmit={() => {}}
      />
    </section>
  );
};

export default TopSection;
