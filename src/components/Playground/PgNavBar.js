import { useNavigate } from "react-router-dom";

const PgNavBar = () => {
  const navigate = useNavigate();
  const handleAccountBtnClick = () => {
    navigate("/login");
  };

  return (
    <nav className="flex flex-col fixed justify-top items-center second-bg-gray h-screen rounded overflow-y border border-cl_color_light_blue">
      <div className="flex fixed flex-col items-center justify-center">
        <a className="flex flex-col items-center mt-4 mb-4" href="/home">
          <img
            className="w-14 h-14 rounded-2xl"
            src={require("../../assets/images/logo.png")}
            alt="Logo"
          />
          <p className="text-white text-xl font-semibold flex-shrink-0 mx-2">
            CyberLearn
          </p>
        </a>
        <div className="flex justify-center space-x-1 mb-8">
          <button className="text-white p-2 hover:bg-cl_color_dark_blue border border-cl_color_light_blue namefield-bg-gray">
            New Lesson
          </button>
        </div>
      </div>
      <div className="mt-44 mb-4 max-h-screen h-full overflow-y-auto scrollbar">
        <ul className="flex flex-col items-center w-52">
          <button className="relative flex items-center justify-center w-full h-12 text-white border border-cl_color_dark_blue text-lg rounded hover:bg-cl_color_dark_blue namefield-bg-gray">
            Created lesson
          </button>
          <button className="relative flex items-center justify-center w-full h-12 text-white border border-cl_color_dark_blue text-lg rounded hover:bg-cl_color_dark_blue namefield-bg-gray">
            Created lesson
          </button>
        </ul>
      </div>
      <div className="flex justify-center w-full space-x-1 mb-2 mt-auto">
        <button
          className="text-white border border-cl_color_light_blue p-2 w-full hover:bg-cl_color_dark_blue namefield-bg-gray"
          onClick={handleAccountBtnClick}
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export default PgNavBar;
