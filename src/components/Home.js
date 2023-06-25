import React, { useState } from "react";
import Spinner from "./Spinner";

const Home = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const lessonNameResponse = await fetch(
      `http://127.0.0.1:8000/lesson?name=${encodeURIComponent(title)}`
    );
    const lessonData = await lessonNameResponse.json();
    const response = await fetch(
      `http://127.0.0.1:8000/lesson/parts?id=${encodeURIComponent(
        lessonData.id
      )}`
    );
    const data = await response.json();
    const sortedParts = data.sort((a, b) => a.number - b.number);

    setParts(sortedParts);
    setSubmitLoading(false);
  };

  const handleRegenerate = async (partId) => {
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: true }));

    const part = parts.find((part) => part.id === partId);
    const response = await fetch(`http://example.com/api/regenerate`, {
      method: "POST",
      body: JSON.stringify({
        partNumber: part.number,
        partName: part.name,
        partContent: part.lesson_part_content,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const newPart = await response.json();

    setParts(parts.map((part) => (part.id === partId ? newPart : part)));
    setLoading((prevLoading) => ({ ...prevLoading, [partId]: false }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex items-center mb-4">
        <input
          className="p-2 border-2 border-gray-200 rounded mr-4"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter title of the text you wish to generate"
        />
        <select
          value={selectedNumber}
          onChange={handleNumberChange}
          className="mx-4 border-gray-200"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          type="submit"
          disabled={submitLoading}
        >
          Generate
        </button>
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
            <button
              className="ml-4 p-2 bg-blue-500 text-white rounded"
              onClick={() => handleRegenerate(part.id)}
            >
              Regenerate
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
