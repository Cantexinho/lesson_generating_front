import TitleSelect from "../Playground/PgTitle";

const TopSection = ({ title, handleTitleChangeSubmit }) => {
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
      <TitleSelect
        title={title}
        handleTitleChange={handleTitleChangeSubmit}
        passedProps="flex flex-col rounded-2xl w-full max-w-3xl min-h-96 m-4 justify-center items-center"
        placeholderText={"Tell me what you want to learn"}
      />
    </section>
  );
};

export default TopSection;
