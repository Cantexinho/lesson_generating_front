import React, { useState } from "react";
import Spinner from "./Spinner";
import * as inputHandlers from "../../utils/inputHandlers";
import * as lessonDataOperations from "../../utils/lessonDataOperations";
import * as partHandlers from "../../utils/partHandlers";
import * as lessonHandlers from "../../utils/lessonHandlers";
import TitleSelect from "./PgTitle";
import PartNumberSelect from "./PgPartNumber";
import PartComponent from "./PgPartComponent";

const PgMain = () => {
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
    <div className="flex flex-col flex-grow w-max-screen items-center justify-top ml-80 mr-20">
      <form
        onSubmit={handleGenerateSubmit}
        className="flex items-center w-full justify-center mt-2 md:flex-row mb-4"
      >
        <TitleSelect
          title={title}
          handleTitleChange={handleTitleChangeSubmit}
        />
        <PartNumberSelect
          selectedNumber={selectedNumber}
          handleNumberChange={handleNumberChangeSubmit}
        />
        <button
          className="p-2 bg-blue-700 text-white rounded mt-6 mr-2 hover:bg-blue-800"
          type="submit"
          disabled={submitLoading}
        >
          Generate Lesson
        </button>
        <button
          className="p-2 bg-red-800 text-white rounded mt-6 hover:bg-red-900"
          onClick={handleDeleteLessonSubmit}
        >
          Delete Lesson
        </button>
      </form>
      <div className="flex flex-col items-center second-bg-gray">
        {submitLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          parts.map((part) => (
            <PartComponent
              key={part.id}
              parts={parts}
              part={part}
              loading={loading}
              title={title}
              setLoading={setLoading}
              setParts={setParts}
              partHandlers={partHandlers}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PgMain;
