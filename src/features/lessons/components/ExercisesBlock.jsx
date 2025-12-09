import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faSpinner,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { generateExercises, getExercises, checkExercise, deleteExercise } from "../api/exerciseService";

// Helper to get exercise ID from various field names
const getExerciseId = (ex) => ex?.id || ex?.exercise_id || ex?.exerciseId;

const ExercisesBlock = ({ lessonId, sectionId }) => {
  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const response = await getExercises({ lessonId, sectionId });
        setExercises(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExercises();
  }, [lessonId, sectionId]);

  const handleGenerateExercises = useCallback(async () => {
    setIsGenerating(true);
    try {
      await generateExercises({ lessonId, sectionId });
      // After 201, fetch the generated exercises
      const exercises = await getExercises({ lessonId, sectionId });
      setExercises(Array.isArray(exercises) ? exercises : []);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Failed to generate exercises:", error);
      alert(error.message || "Failed to generate exercises");
    } finally {
      setIsGenerating(false);
    }
  }, [lessonId, sectionId]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(exercises.length - 1, prev + 1));
  }, [exercises.length]);

  const updateExercise = useCallback((exerciseId, updates) => {
    setExercises((prev) =>
      prev.map((ex) => (getExerciseId(ex) === exerciseId ? { ...ex, ...updates } : ex))
    );
  }, []);

  const handleCheckboxChange = useCallback(
    (exerciseId, optionIndex) => {
      const exercise = exercises.find((ex) => getExerciseId(ex) === exerciseId);
      if (!exercise || exercise.result) return;

      const current = exercise.userAnswer || [];
      const updated = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];

      updateExercise(exerciseId, { userAnswer: updated });
    },
    [exercises, updateExercise]
  );

  const handleTextChange = useCallback(
    (exerciseId, value) => {
      const exercise = exercises.find((ex) => getExerciseId(ex) === exerciseId);
      if (!exercise || exercise.result) return;

      updateExercise(exerciseId, { userAnswer: value });
    },
    [exercises, updateExercise]
  );

  const handleCheckAnswer = useCallback(async () => {
    const exercise = exercises[currentIndex];
    if (!exercise) return;

    // Check if current exercise has an answer
    const answer = exercise.userAnswer;
    const hasAnswer = Array.isArray(answer)
      ? answer.length > 0
      : typeof answer === "string" && answer.trim().length > 0;

    if (!hasAnswer) {
      alert("Please provide an answer before checking.");
      return;
    }

    setIsChecking(true);
    try {
      await checkExercise({ lessonId, sectionId, exercise });
      // After 204, refetch to get updated results
      const updatedExercises = await getExercises({ lessonId, sectionId });
      setExercises(Array.isArray(updatedExercises) ? updatedExercises : []);
    } catch (error) {
      console.error("Failed to check exercise:", error);
      alert(error.message || "Failed to check exercise");
    } finally {
      setIsChecking(false);
    }
  }, [lessonId, sectionId, exercises, currentIndex]);

  const handleDeleteExercise = useCallback(async () => {
    const exercise = exercises[currentIndex];
    const exerciseId = getExerciseId(exercise);
    if (!exerciseId) return;

    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteExercise({ lessonId, sectionId, exerciseId });
      // After delete, refetch exercises
      const updatedExercises = await getExercises({ lessonId, sectionId });
      setExercises(Array.isArray(updatedExercises) ? updatedExercises : []);
      // Adjust index if needed
      if (currentIndex >= updatedExercises.length && updatedExercises.length > 0) {
        setCurrentIndex(updatedExercises.length - 1);
      }
    } catch (error) {
      console.error("Failed to delete exercise:", error);
      alert(error.message || "Failed to delete exercise");
    } finally {
      setIsDeleting(false);
    }
  }, [lessonId, sectionId, exercises, currentIndex]);

  const currentExercise = exercises[currentIndex];
  const currentExerciseId = getExerciseId(currentExercise);

  // Get exercise type - check multiple possible field names
  const exerciseType = (
    currentExercise?.type ||
    currentExercise?.exercise_type ||
    currentExercise?.exerciseType ||
    ""
  ).toUpperCase();

  // Parse options if it's a JSON string
  const parsedOptions = (() => {
    if (!currentExercise?.options) return null;
    if (Array.isArray(currentExercise.options)) return currentExercise.options;
    if (typeof currentExercise.options === "string") {
      try {
        return JSON.parse(currentExercise.options);
      } catch {
        return null;
      }
    }
    return null;
  })();

  const isChoiceType = exerciseType === "MULTIPLE_CHOICE" || exerciseType === "TRUE_FALSE";

  // Loading state
  if (isLoading) {
    return null;
  }

  // Empty state
  if (exercises.length === 0) {
    return (
      <div className="mt-3 flex justify-start">
        <button
          type="button"
          onClick={handleGenerateExercises}
          disabled={isGenerating}
          className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 disabled:opacity-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          {isGenerating ? (
            <>
              <FontAwesomeIcon
                icon={faSpinner}
                className="h-3 w-3 animate-spin"
              />
              Generating...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
              Add Exercises
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Header with pagination */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Exercise {currentIndex + 1} of {exercises.length}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Previous exercise"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === exercises.length - 1}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Next exercise"
          >
            <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question */}
      <p className="mb-4 text-sm text-gray-800 dark:text-gray-200">
        {currentExercise.question}
      </p>

      {/* Answer input based on type */}
      {isChoiceType && parsedOptions ? (
        <div className="mb-4 space-y-2">
          {parsedOptions.map((option, idx) => (
            <label
              key={idx}
              className="flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={(currentExercise.userAnswer || []).includes(idx)}
                onChange={() =>
                  handleCheckboxChange(currentExerciseId, idx)
                }
                disabled={!!currentExercise.result}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {option}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <textarea
          value={currentExercise.userAnswer || ""}
          onChange={(e) =>
            handleTextChange(currentExerciseId, e.target.value)
          }
          disabled={!!currentExercise.result}
          placeholder="Type your answer here..."
          className="mb-4 w-full rounded border border-gray-300 bg-white p-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:disabled:bg-gray-700"
          rows={3}
        />
      )}

      {/* Result display */}
      {currentExercise.result && (
        <div
          className={`mb-4 rounded p-3 text-sm ${
            currentExercise.result.is_correct || currentExercise.result.isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          <div className="mb-1 font-semibold">
            {currentExercise.result.is_correct || currentExercise.result.isCorrect ? "Correct!" : "Incorrect"}
            {(currentExercise.result.rating !== undefined || currentExercise.result.rating !== null) &&
              ` • Rating: ${currentExercise.result.rating}/10`}
          </div>
          {currentExercise.result.notes && (
            <p>{currentExercise.result.notes}</p>
          )}
        </div>
      )}

      {/* Check button - show when current exercise doesn't have a result */}
      {!currentExercise.result && (
        <button
          type="button"
          onClick={handleCheckAnswer}
          disabled={isChecking}
          className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-60"
        >
          {isChecking ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
              Check Answer
            </>
          )}
        </button>
      )}

      {/* Footer row */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
        <button
          type="button"
          onClick={handleGenerateExercises}
          disabled={isGenerating}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isGenerating ? "Adding..." : "Add more exercises"}
        </button>
        <button
          type="button"
          onClick={handleDeleteExercise}
          disabled={isDeleting}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition hover:text-red-600 disabled:opacity-40 dark:text-gray-400 dark:hover:text-red-400"
          aria-label="Delete exercise"
        >
          {isDeleting ? (
            <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M4 7h16" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M6 7l1 11a2 2 0 002 2h6a2 2 0 002-2l1-11" />
              <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExercisesBlock;

