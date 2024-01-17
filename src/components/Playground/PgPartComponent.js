import React from "react";
import Spinner from "./Spinner";
import * as crudService from "../../api/lessonCrudService";

const PartComponent = ({
  parts,
  part,
  loading,
  title,
  setLoading,
  setParts,
  partHandlers,
}) => {
  return (
    <div
      key={part.id}
      className="flex mb-4 w-full max-w-6xl flex justify-between relative"
    >
      <div className="border border-gray-700 namefield-bg-gray rounded-sm p-4 relative text-white">
        {loading[part.id] ? (
          <div className="absolute inset-0 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-white">{`Part ${part.number}: ${part.name}`}</h2>
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
