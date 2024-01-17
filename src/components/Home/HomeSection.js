import ai_presenter_1 from "C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/ai_presenter_1.png";
import futuristic_future from "C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/futuristic_future.png";
import student_learning from "C:/Users/cante/Desktop/LessonGenerating/lesson_generating_website/src/assets/images/student_learning.png";

const HomeSection = ({
  img_placement,
  img_name,
  sectionHeader,
  sectionText,
}) => {
  const img_placement_tw_text = img_placement === "right" ? "order-2" : "";

  const imagePathMap = {
    ai_presenter_1: ai_presenter_1,
    futuristic_future: futuristic_future,
    student_learning: student_learning,
  };

  const selectedImagePath = imagePathMap[img_name];

  return (
    <div className="flex justify-center px-12 max-w-screen max-h-screen mt-4 second-bg-gray_transparent border border-cl_color_dark_blue">
      <img
        className={"m-4 max-w-sm h-auto rounded-2xl " + img_placement_tw_text}
        src={selectedImagePath}
        alt=""
      />
      <div className="flex flex-col items-left justify-center ml-20">
        <h1 className="text-2xl font-bold text-white pb-4">{sectionHeader}</h1>
        <p className="text-xl text-white">{sectionText}</p>
      </div>
    </div>
  );
};

export default HomeSection;
