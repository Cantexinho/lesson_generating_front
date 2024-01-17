import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import * as crudService from "../api/lessonCrudService";
import * as inputHandlers from "../utils/inputHandlers";
import * as lessonDataOperations from "../utils/lessonDataOperations";
import * as partHandlers from "../utils/partHandlers";
import * as lessonHandlers from "../utils/lessonHandlers";

const Playground = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [parts, setParts] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleTitleChangeSubmit = (e) => {
    inputHandlers.handleTitleChange(e, setTitle);
  };

  const handleNumberChangeSubmit = (e) => {
    inputHandlers.handleNumberChange(e, setSelectedNumber);
  };

  const handleLogoutSubmit = () => {
    inputHandlers.handleLogout(navigate);
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    await lessonDataOperations.handleGenerate(
      title,
      selectedNumber,
      setSubmitLoading,
      setParts
    );
  };

  const handleDeleteLessonSubmit = async (e) => {
    e.preventDefault();
    await lessonHandlers.handleDeleteLesson(title, setSubmitLoading, setParts);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray">
      <button
        onClick={handleLogoutSubmit}
        className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        Logout
      </button>
      <form
        onSubmit={handleGenerateSubmit}
        className="flex flex-col md:flex-row items-center mb-4"
      >
        <div className="flex flex-col mb-4 md:mb-0 md:mr-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Enter title of lesson
          </label>
          <input
            className="p-2 border-2 border-gray-200 rounded mr-4"
            type="text"
            value={title}
            onChange={handleTitleChangeSubmit}
            placeholder="Enter title of the text you wish to generate"
          />
        </div>
        <div className="flex flex-col mb-4 md:mb-0 md:mr-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="number"
          >
            Select part number
          </label>
          <select
            value={selectedNumber}
            onChange={handleNumberChangeSubmit}
            className="mx-4 border-2 border-gray-200 h-10"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <button
          className="p-2 bg-blue-500 text-white rounded self-center mt-6 mr-2"
          type="submit"
          disabled={submitLoading}
        >
          Generate Lesson
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded self-center mt-6 mr-2"
          onClick={handleDeleteLessonSubmit}
        >
          Delete Lesson
        </button>
        <div></div>
      </form>
      {submitLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        parts.map((part) => (
          <div
            key={part.id}
            className="mb-4 w-full max-w-6xl flex justify-between relative"
          >
            <div className="border-2 border-gray-200 rounded p-4 relative min-w-[1040px] min-h-[100px]">
              {loading[part.id] ? (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <h2 className="mb-2">{`Part ${part.number}: ${part.name}`}</h2>
                  <p>{part.lesson_part_content}</p>
                </>
              )}
            </div>
            <div>
              <button
                className="ml-4 w-20 h-6 mb-1 text-sm bg-gray-500 text-white rounded flex items-center justify-center"
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
                className="ml-4 w-20 h-6 mb-1 text-sm bg-blue-500 text-white rounded flex items-center justify-center"
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
                className="ml-4 w-20 h-6 mb-1 text-sm bg-red-500 text-white rounded flex items-center justify-center"
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
        ))
      )}
    </div>
  );
};

export default Playground;
