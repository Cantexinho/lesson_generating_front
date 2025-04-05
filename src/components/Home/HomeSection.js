import ai_presenter_1 from "../../assets/images/ai_presenter_1.png";
import futuristic_future from "../../assets/images/futuristic_future.png";
import student_learning from "../../assets/images/student_learning.png";
import ai_learning from "../../assets/images/ai_learning.png";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const HomeSection = ({
  img_placement,
  img_name,
  image_props,
  sectionHeader,
  sectionText,
}) => {
  const theme = useSelector(selectTheme);
  const img_placement_tw_text = img_placement === "right" ? "order-2" : "";

  const imagePathMap = {
    ai_presenter_1,
    futuristic_future,
    student_learning,
    ai_learning,
  };

  const selectedImagePath = imagePathMap[img_name];

  return (
    <section
      className={`flex items-center justify-center gap-8 p-8 lg:px-24 xl:px-32 w-full ${
        theme.isDarkTheme ? "dark-primary-bg" : "light-primary-bg"
      }`}
    >
      <img
        className={`rounded-2xl ${image_props} ${img_placement_tw_text} max-w-full h-auto`}
        src={selectedImagePath}
        alt=""
      />
      <div className="flex flex-col justify-center text-center lg:text-left max-w-2xl">
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
    </section>
  );
};

export default HomeSection;
