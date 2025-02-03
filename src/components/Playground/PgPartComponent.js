import React from "react";
import Spinner from "./Spinner";
import * as crudService from "../../api/lessonCrudService";
import { useSelector } from "react-redux";
import { selectTheme } from "../../redux/themeSlice";

const PartComponent = ({
  parts,
  part,
  loading,
  title,
  setLoading,
  setParts,
  partHandlers,
}) => {
  const theme = useSelector(selectTheme);
  return (
    <div
      key={part.id}
      className="flex mb-4 w-full justify-between relative text-xs md:text-base"
    >
      <div
        className={`rounded-sm p-4 w-full relative ${
          theme.isDarkTheme
            ? "text-white dark-second-bg border border-gray-800"
            : "text-black light-second-bg border border-gray-300"
        }`}
      >
        {loading[part.id] ? (
          <div className="flex justify-center items-center w-full">
            <Spinner />
          </div>
        ) : (
          <>
            <h2
              className={`mb-2 ${
                theme.isDarkTheme ? "text-white" : "text-black"
              }`}
            >{`Part ${part.number}: ${part.name}`}</h2>
            <p>{part.lesson_part_content}</p>
          </>
        )}
      </div>
      <div className="flex flex-col">
        <button
          className="ml-4 w-20 h-6 mb-1 text-sm bg-gray-700 hover:bg-gray-800 text-white rounded flex items-center justify-center"
          onClick={() =>
            partHandlers.handleAction(
              parts,
              part.id,
              title,
              crudService.extendPart,
              setLoading,
              setParts
            )
          }
        >
          Regenerate
        </button>

        <button
          className="ml-4 w-20 h-6 mb-1 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded flex items-center justify-center"
          onClick={() =>
            partHandlers.handleAction(
              parts,
              part.id,
              title,
              crudService.regeneratePart,
              setLoading,
              setParts
            )
          }
        >
          Extend
        </button>
        <button
          className="ml-4 w-20 h-6 mb-1 text-sm bg-red-800 hover:bg-red-900 text-white rounded flex items-center justify-center"
          onClick={() =>
            partHandlers.handleDeletePart(
              parts,
              part.id,
              title,
              setLoading,
              setParts
            )
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PartComponent;
