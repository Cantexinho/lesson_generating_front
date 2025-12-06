import { requestLessonGeneration } from "../api/lessonGenerationService";
import { fetchLessonPartsById } from "../utils/lessonDataOperations";

const buildGenerationPayload = ({
  userInput,
  format,
  audience,
  length,
  language,
}) => ({
  user_input: userInput,
  format,
  audience,
  length,
  language,
});

export const generateLessonFromInput = async ({
  userInput,
  format,
  audience,
  length,
  language,
}) => {
  const trimmedInput = userInput?.trim();
  if (!trimmedInput) {
    throw new Error("Please describe the lesson before generating.");
  }

  const payload = buildGenerationPayload({
    userInput: trimmedInput,
    format,
    audience,
    length,
    language,
  });

  const apiResponse = await requestLessonGeneration(payload);

  const lessonId =
    apiResponse?.lessonId || apiResponse?.lesson_id || apiResponse?.id;

  if (!lessonId) {
    throw new Error(
      "Lesson generation service did not return a lesson identifier. Please try again."
    );
  }

  const parts = await fetchLessonPartsById(lessonId);
  if (!parts?.length) {
    throw new Error(
      "Generated lesson does not have any sections yet. Please try again shortly."
    );
  }

  return {
    lessonId,
    parts,
    title: apiResponse?.title || trimmedInput,
    language: apiResponse?.language || language || null,
    metadata: apiResponse?.metadata || null,
  };
};
