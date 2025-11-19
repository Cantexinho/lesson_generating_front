import Spinner from "./Spinner";
import * as partHandlers from "../utils/partHandlers";
import LessonGenerationInput from "./LessonGenerationInput";
import LessonNumber from "./LessonNumber";
import LessonPart from "./LessonPart";

const LessonMain = ({
  parts,
  setParts,
  title,
  handleTitleChangeSubmit,
  selectedNumber,
  handleNumberChangeSubmit,
  loading,
  setLoading,
  submitLoading,
  handleGenerateSubmit,
  handleDeleteLessonSubmit,
}) => {
  return (
    <div className="flex flex-col flex-grow items-center justify-top ml-20 mr-20 md:ml-72">
      <form
        onSubmit={handleGenerateSubmit}
        className="flex w-full max-w-full items-center justify-center mt-2 md:flex-row mb-4"
      >
        <LessonGenerationInput
          title={title}
          handleTitleChange={handleTitleChangeSubmit}
          passedProps={`flex flex-col flex-grow w-max-full mr-4 `}
        />
        <LessonNumber
          selectedNumber={selectedNumber}
          handleNumberChange={handleNumberChangeSubmit}
        />
        <button
          className="p-2 bg-blue-700 text-white rounded mt-6 mr-2 hover:bg-blue-800"
          type="submit"
          disabled={submitLoading}
        >
          <span className="hidden lg:inline">Generate Lesson</span>
          <span className="lg:hidden">Generate</span>
        </button>
        <button
          className="p-2 bg-red-800 text-white rounded mt-6 hover:bg-red-900"
          onClick={handleDeleteLessonSubmit}
        >
          <span className="hidden lg:inline">Delete Lesson</span>
          <span className="lg:hidden">Delete</span>
        </button>
      </form>
      <div className="flex flex-col items-center flex-grow">
        {submitLoading ? (
          <div className="flex justify-center items-center w-full">
            <Spinner />
          </div>
        ) : (
          parts.map((part) => (
            <LessonPart
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

export default LessonMain;
