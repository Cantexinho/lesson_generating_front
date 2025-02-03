// import { useNavigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import * as lessonDataOperations from "../../utils/lessonDataOperations";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import { useSelector } from "react-redux";
// import { selectTheme } from "../../redux/themeSlice";
// import ThemeButton from "../Global/ThemeButton";

// const PgNavBar = ({
//   pgMainState,
//   handleNewLessonButton,
//   handleLessonSelect,
//   selectedLesson,
// }) => {
//   const navigate = useNavigate();
//   const [lessons, setLessons] = useState([]);
//   const [navBarVisible, setNavBarVisible] = useState(false);

//   const theme = useSelector(selectTheme);

//   const handleNavBarVisible = () => {
//     setNavBarVisible(!navBarVisible);
//     console.log(navBarVisible);
//   };

//   const handleAccountBtnClick = () => {
//     navigate("/login");
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       await lessonDataOperations.fetchAllLessons(setLessons);
//     };
//     fetchData();
//   }, [pgMainState]);
//   return (
//     <nav
//       className={`flex flex-col fixed justify-top items-center h-screen rounded overflow-y transition-transform z-10 ${
//         theme.isDarkTheme ? "dark-pg-bg-gray" : "light-navbar"
//       } ${navBarVisible ? "translate-x-0" : "-translate-x-full"}`}
//     >
//       <button
//         className={`text-white visible md:invisible lg:invisible ${
//           navBarVisible ? "ml-52" : "ml-0 mr-52"
//         }`}
//         onClick={handleNavBarVisible}
//       >
//         {navBarVisible ? (
//           <FontAwesomeIcon
//             icon={faTimes}
//             className="mt-2"
//             size="xl"
//             style={{ color: theme.isDarkTheme ? "white" : "black" }}
//           />
//         ) : (
//           <FontAwesomeIcon
//             icon={faArrowRight}
//             className="mt-2"
//             size="xl"
//             style={{ color: theme.isDarkTheme ? "white" : "black" }}
//           />
//         )}
//       </button>
//       <div className="flex fixed flex-col items-center justify-center">
//         <a className="flex flex-col items-center mt-4 mb-4" href="/home">
//           <img
//             className="w-14 h-14 rounded-2xl"
//             src={require("../../assets/images/logo.png")}
//             alt="Logo"
//           />
//           <p
//             className={` text-xl font-semibold flex-shrink-0 mx-2 ${
//               theme.isDarkTheme ? "text-white" : "text-black"
//             }`}
//           >
//             CyberLearn
//           </p>
//         </a>
//         <div className="flex justify-center space-x-1 mb-4">
//           <button
//             className={`p-1 second-bg-gray ${
//               theme.isDarkTheme
//                 ? "dark-second-bg text-white hover:bg-gray-900 border border-gray-800 "
//                 : "light-second-bg text-black hover:bg-gray-300 border border-gray-300 "
//             }`}
//             onClick={handleNewLessonButton}
//           >
//             New Lesson
//           </button>
//         </div>
//       </div>
//       <div
//         className={`mt-32 mb-2 max-h-screen h-full overflow-y-auto scrollbar mx-2 ${
//           theme.isDarkTheme
//             ? "dark-second-bg border border-gray-800"
//             : "light-second-bg border border-gray-200"
//         }`}
//       >
//         <ul className="flex flex-col items-center w-52">
//           {lessons.map((lesson) => (
//             <button
//               key={lesson.id}
//               className={`relative flex items-center justify-left pl-2 w-full h-12 text-sm rounded ${
//                 selectedLesson && selectedLesson.id === lesson.id
//                   ? theme.isDarkTheme
//                     ? "bg-gray-900"
//                     : "bg-gray-300"
//                   : ""
//               } ${
//                 theme.isDarkTheme
//                   ? "text-white hover:bg-gray-900 border-t border-b border-gray-700"
//                   : "text-black hover:bg-gray-300 border-t border-b border-gray-300"
//               }`}
//               onClick={() => handleLessonSelect(lesson)}
//             >
//               {lesson.name}
//             </button>
//           ))}
//         </ul>
//       </div>
//       <ThemeButton passed_props={"my-2 mb-3"} />
//       <div className="flex justify-center w-52 space-x-1 mb-1 mt-auto">
//         <button
//           className={`p-2 w-full ${
//             theme.isDarkTheme
//               ? "text-white dark-primary-bg hover:bg-gray-900 border border-gray-700"
//               : "text-black light-second-bg hover:bg-gray-300 border border-gray-400"
//           }`}
//           onClick={handleAccountBtnClick}
//         >
//           Log out
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default PgNavBar;
