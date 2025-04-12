import LessonGenerationInput from "../Lessons/LessonGenerationInput";
import { handleTitleChange } from "../../utils/inputHandlers";

const TopSection = () => {
  const bgImage = require(`../../assets/images/ai_rome_2.png`);

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
        handleTitleChange={handleTitleChange}
        passedProps=""
        placeholderText={"Tell me what you want to learn"}
        onSubmit={() => {}}
      />
    </section>
  );
};

export default TopSection;
