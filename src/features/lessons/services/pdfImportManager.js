import { extractPdfContent, buildPdfImportRequest } from "../utils/pdfImport";
import { importLessonFromPdf } from "../api/pdfImportService";
import { fetchLessonSectionsById } from "../utils/lessonDataOperations";

const logDebug = (message, payload) => {
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(message, payload);
  }
};

export const importPdfLesson = async (file) => {
  if (!file) {
    throw new Error("No file selected for import.");
  }

  const pdfData = await extractPdfContent(file);
  if (!pdfData.rawText) {
    throw new Error("No readable text found in that PDF.");
  }

  const importPayload = buildPdfImportRequest(file, pdfData);
  const apiResponse = await importLessonFromPdf(importPayload);
  logDebug("[PDF Import] API response:", apiResponse);

  const lessonId =
    apiResponse?.id || apiResponse?.lesson_id || apiResponse?.lessonId;
  if (!lessonId) {
    throw new Error(
      "Import service did not return a lesson identifier. Please try again."
    );
  }

  const sections = await fetchLessonSectionsById(lessonId);
  if (!sections?.length) {
    throw new Error(
      "Imported lesson does not have any sections yet. Please try again shortly."
    );
  }

  return {
    lessonId,
    sections,
    title: apiResponse?.title || "",
    language: apiResponse?.language || null,
    metadata: {
      finishReason: apiResponse?.finish_reason,
      model: apiResponse?.model,
      tokenUsage: {
        inputTokens: apiResponse?.input_tokens,
        responseTokens: apiResponse?.response_tokens,
        totalTokens: apiResponse?.total_tokens,
      },
    },
  };
};
