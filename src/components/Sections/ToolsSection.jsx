const tools = [
  {
    text: "Lessong Generating",
    image: require("../../assets/images/web_interface_lesson.png"),
  },
  {
    text: "Background Removing",
    image: require("../../assets/images/bg_remover_web_interface.png"),
  },
  { text: "Image Observer", image: require("../../assets/images/image_observer_web_dashboard.png") },
  {
    text: "AI Writer",
    image: require("../../assets/images/writing_platform.png"),
  },
];

const ToolsSection = () => {
  return (
    <section className="py-16 bg-transparent-light dark:bg-transparent-dark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 2xl:max-w-7xl">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="flex h-56 2xl:h-72 overflow-hidden rounded-xl shadow-md transition-transform transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg text-black dark:text-white bg-primary dark:bg-primary-dark"
          >
            <div className="w-[40%] flex items-center px-6">
              <span className="text-xl 2xl:text-2xl font-semibold">{tool.text}</span>
            </div>
            <div
              className="w-[60%] h-full "
              style={{
                clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
              }}
            >
              <img src={tool.image} alt={tool.text} className="w-full h-full" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;