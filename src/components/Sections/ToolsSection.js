const tools = [
  {
    text: "Lessong Generating",
    image: require("../../assets/images/ai_rome_1.png"),
  },
  {
    text: "Background Removing",
    image: require("../../assets/images/ai_learning.png"),
  },
  { text: "Tool 3", image: require("../../assets/images/random_city_1.png") },
  {
    text: "Tool 4",
    image: require("../../assets/images/futuristic_future.png"),
  },
];

const ToolsSection = () => {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="flex h-56 overflow-hidden rounded-xl shadow-md transition-transform transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg text-black dark:text-white bg-primary dark:bg-primary-dark"
          >
            <div className="w-[40%] flex items-center px-6">
              <span className="text-xl font-semibold">{tool.text}</span>
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
