import NavBarButton from "./NavBarButton";

const PgNavBar = () => {
  return (
    <nav className="flex flex-col justify-top namefield-bg-gray h-screen rounded">
      <a className="flex flex-col items-center mt-4 mb-8" href="/home">
        <img
          className="w-14 h-14 rounded-2xl"
          src={require("C:/Users/karolispakalnis/Desktop/lesson_generating_front/src/assets/images/logo.png")}
          alt="Logo"
        />
        <p className="text-white text-xl font-semibold flex-shrink-0 mx-2">
          CyberLearn
        </p>
      </a>
      <div className="flex justify-center space-x-1 mb-8">
        <button className="text-white border p-2 hover:bg-cl_color_dark_blue">
          New Lesson
        </button>
        <button className="text-white border p-2 hover:bg-cl_color_dark_blue">
          New Lesson
        </button>
      </div>
      <ul className="flex flex-col items-center w-52">
        <button className="relative flex items-center justify-center w-full h-12 text-white text-lg rounded border border-gray-400 hover:bg-cl_color_dark_blue">
          Created chat
        </button>
        <button className="relative flex items-center justify-center w-full h-12 text-white text-lg rounded border border-gray-400 hover:bg-cl_color_dark_blue">
          Created chat
        </button>
        <button className="relative flex items-center justify-center w-full h-12 text-white text-lg rounded border border-gray-400 hover:bg-cl_color_dark_blue">
          Created chat
        </button>
      </ul>
      <div className="flex justify-center  space-x-1 mb-2 mt-auto">
        <button className="text-white border p-2 w-full hover:bg-cl_color_dark_blue">
          Account
        </button>
      </div>
    </nav>
  );
};

export default PgNavBar;
