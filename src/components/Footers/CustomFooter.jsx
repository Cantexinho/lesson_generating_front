import start_now from "../../assets/images/start_now.png";

const CustomFooter = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full bg-primary dark:bg-primary-dark">
      <div className="flex items-center justify-center w-full h-20">
        <p className="text-lg font-semibold text-black dark:text-white">
          &copy; 2025 Legatus AI. All rights reserved.
        </p>
      </div>
      <button>
        <div className="flex flex-col items-left justify-center m-5 rounded-full">
          <a href="/login">
            <img
              className={"w-28 h-auto rounded-full"}
              src={start_now}
              alt=""
            />
          </a>
        </div>
      </button>
    </footer>
  );
};

export default CustomFooter;
