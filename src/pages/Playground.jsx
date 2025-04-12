import React, { useState, useEffect } from "react";
import LessonMain from "../components/Lessons/LessonMain";
import PgNavBar from "../components/Lessons/PgNavBar";
import * as inputHandlers from "../utils/inputHandlers";
import * as lessonHandlers from "../utils/lessonHandlers";
import * as lessonDataOperations from "../utils/lessonDataOperations";

const Playground = () => {
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState();
  const [parts, setParts] = useState([]);
  const [pgMainState, setPgMainState] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lesson, setLesson] = useState();

  const handleTitleChangeSubmit = (e) => {
    inputHandlers.handleTitleChange(e, setTitle);
  };

  const handleNumberChangeSubmit = (e) => {
    inputHandlers.handleNumberChange(e, setSelectedNumber);
  };

  const handleLessonSelect = async (selectedLesson) => {
    setLesson(selectedLesson);
    setTitle(selectedLesson.name);
    setLessonId(selectedLesson.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await lessonDataOperations.fetchSingleLesson(lesson, setParts);
    };

    fetchData();
  }, [lesson]);

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
    await lessonHandlers.handleDeleteLesson(
      title,
      lessonId,
      setSubmitLoading,
      setParts
    );
  };

  const handleNewLessonButton = (e) => {
    e.preventDefault();
    setTitle("");
    setParts([]);
  };

  useEffect(() => {
    setPgMainState(parts);
  }, [parts]);

  return (
    <div className="flex min-h-screen bg-primary dark:bg-primary-dark">
      <PgNavBar
        pgMainState={pgMainState}
        handleNewLessonButton={handleNewLessonButton}
        handleLessonSelect={handleLessonSelect}
        selectedLesson={lesson}
      />
      <LessonMain
        parts={parts}
        setParts={setParts}
        title={title}
        handleTitleChangeSubmit={handleTitleChangeSubmit}
        selectedNumber={selectedNumber}
        handleNumberChangeSubmit={handleNumberChangeSubmit}
        loading={loading}
        setLoading={setLoading}
        submitLoading={submitLoading}
        handleGenerateSubmit={handleGenerateSubmit}
        handleDeleteLessonSubmit={handleDeleteLessonSubmit}
      />
    </div>
  );
};

export default Playground;
