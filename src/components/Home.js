import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import {
  fetchLessonByName,
  fetchLessonParts,
  generateLessonText,
  createLesson,
  splitLessonText,
  postSplitLesson,
  postLessonText,
  regeneratePart,
  fetchLessonPart,
  updateLessonPart,
  extendPart,
  deletePart,
  deleteLesson,
} from "../api/lessonService";

const Home = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [parts, setParts] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleNumberChange = (e) => {
    setSelectedNumber(e.target.value);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      let lessonData = await fetchLessonByName(title);
      let data;
      if (lessonData != null) {
        data = await fetchLessonParts(lessonData.id);
      } else {
        const generatorData = await generateLessonText(title, selectedNumber);
        await postLessonText(generatorData.content);
        await createLesson(generatorData.lesson_name);
        const createdLessonData = await fetchLessonByName(
          generatorData.lesson_name
        );
        console.log(createdLessonData);
        const generatorSplitData = await splitLessonText(generatorData.content);
        const splitLessonsData = generatorSplitData.map((lesson) => {
          return {
            ...lesson,
            lesson_id: createdLessonData.id,
          };
        });
        console.log(splitLessonsData);
        await postSplitLesson(splitLessonsData);
        data = await fetchLessonParts(createdLessonData.id);
      }
      const sortedParts = data.sort((a, b) => a.number - b.number);
      setParts(sortedParts);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
    console.log(parts);
  };

  const handleExtend = async (partId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

    const part = parts.find((part) => part.id === partId);
    const regeneratedPartText = await extendPart(title, part);
    const lessonPart = await fetchLessonPart(part.id);
    lessonPart.lesson_part_content = regeneratedPartText;
    const newPart = await updateLessonPart(lessonPart);
    setParts(parts.map((part) => (part.id === partId ? newPart : part)));
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
  };

  const handleRegenerate = async (partId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

    const part = parts.find((part) => part.id === partId);
    const regeneratedPartText = await regeneratePart(title, part);
    const lessonPart = await fetchLessonPart(part.id);
    lessonPart.lesson_part_content = regeneratedPartText;
    const newPart = await updateLessonPart(lessonPart);
    setParts(parts.map((part) => (part.id === partId ? newPart : part)));
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
  };

  const handleDeletePart = async (partId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

    const part = parts.find((part) => part.id === partId);
    await deletePart(part.id);
    let lessonData = await fetchLessonByName(title);
    let data = await fetchLessonParts(lessonData.id);
    const sortedParts = data.sort((a, b) => a.number - b.number);
    setParts(sortedParts);

    setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
  };

  const handleDeleteLesson = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    let lessonData = await fetchLessonByName(title);
    await deleteLesson(lessonData.id);
    setParts([]);
    setSubmitLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded"
      >
        Logout
      </button>
      <form
        onSubmit={handleGenerate}
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
            onChange={handleTitleChange}
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
            onChange={handleNumberChange}
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
          onClick={handleDeleteLesson}
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
                onClick={() => handleRegenerate(part.id)}
              >
                Regenerate
              </button>

              <button
                className="ml-4 w-20 h-6 mb-1 text-sm bg-blue-500 text-white rounded flex items-center justify-center"
                onClick={() => handleExtend(part.id)}
              >
                Extend
              </button>
              <button
                className="ml-4 w-20 h-6 mb-1 text-sm bg-red-500 text-white rounded flex items-center justify-center"
                onClick={() => handleDeletePart(part.id)}
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

export default Home;
