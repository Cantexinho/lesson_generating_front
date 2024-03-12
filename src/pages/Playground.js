import React, { useState, useEffect } from "react";
import PgMain from "../components/Playground/PgMain";
import PgNavBar from "../components/Playground/PgNavBar";
import * as inputHandlers from "../utils/inputHandlers";
import * as lessonHandlers from "../utils/lessonHandlers";
import * as lessonDataOperations from "../utils/lessonDataOperations";
import { useSelector } from "react-redux";
import { selectTheme } from "../redux/themeSlice";

const Playground = () => {
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState();
  const [parts, setParts] = useState([]);
  const [pgMainState, setPgMainState] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [loading, setLoading] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [lesson, setLesson] = useState();

  const theme = useSelector(selectTheme);

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
    <div
      className={`flex min-h-screen ${
        theme.isDarkTheme ? "dark-second-bg" : "light-primary-bg"
      }`}
    >
      <PgNavBar
        pgMainState={pgMainState}
        handleNewLessonButton={handleNewLessonButton}
        handleLessonSelect={handleLessonSelect}
        selectedLesson={lesson}
      />
      <PgMain
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
