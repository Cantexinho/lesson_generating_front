import ai_presenter_1 from "../../assets/images/ai_presenter_1.png";
import futuristic_future from "../../assets/images/futuristic_future.png";
import student_learning from "../../assets/images/student_learning.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const HomeSection = ({
  img_placement,
  img_name,
  sectionHeader,
  sectionText,
}) => {
  const theme = useSelector(selectTheme);
  const img_placement_tw_text = img_placement === "right" ? "order-2" : "";

  const imagePathMap = {
    ai_presenter_1: ai_presenter_1,
    futuristic_future: futuristic_future,
    student_learning: student_learning,
  };

  const selectedImagePath = imagePathMap[img_name];

  return (
    <div
      className={`flex justify-center px-12 max-w-screen max-h-screen mt-4 ${
        theme.isDarkTheme
          ? "dark-bg-gray_transparent"
          : "light-bg-gray_transparent"
      }`}
    >
      <img
        className={
          "m-4 max-w-sm h-auto rounded-2xl lg:block hidden " +
          img_placement_tw_text
        }
        src={selectedImagePath}
        alt=""
      />
      <div className="flex flex-col items-left justify-center ml-20 my-4">
        <h1
          className={`text-2xl font-bold pb-4 ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          {sectionHeader}
        </h1>
        <p
          className={`text-xl ${
            theme.isDarkTheme ? "text-white" : "text-black"
          }`}
        >
          {sectionText}
        </p>
      </div>
    </div>
  );
};

export default HomeSection;
