import ai_presenter_1 from "../../assets/images/ai_presenter_1.png";
import futuristic_future from "../../assets/images/futuristic_future.png";
import student_learning from "../../assets/images/student_learning.png";
import ai_learning from "../../assets/images/ai_learning.png";

const ImageSection = ({
  imgPlacement,
  imgName,
  sectionProps,
  imageProps,
  sectionHeader,
  sectionText,
}) => {
  const imgPlacementTwText = imgPlacement === "right" ? "order-2" : "";

  const imagePathMap = {
    ai_presenter_1,
    futuristic_future,
    student_learning,
    ai_learning,
  };

  const selectedImagePath = imagePathMap[imgName];

  return (
    <section className={`bg-primary dark:bg-primary-dark ${sectionProps}`}>
      <img
        className={`rounded-2xl ${imageProps} ${imgPlacementTwText} max-w-full h-auto`}
        src={selectedImagePath}
        alt=""
      />
      <div className="flex flex-col justify-center text-center lg:text-left max-w-2xl">
        <h1 className="text-2xl font-semibold font-custom pb-4 text-black dark:text-white">
          {sectionHeader}
        </h1>
        <p className="text-xl font-custom text-black dark:text-white">
          {sectionText}
        </p>
      </div>
    </section>
  );
};

export default ImageSection;
