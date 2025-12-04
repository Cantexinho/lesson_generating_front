const DEFAULT_PDF_IMPORT_ENDPOINT = "http://localhost:8000/lessons/import/pdf";

const getPdfImportEndpoint = () =>
  process.env.REACT_APP_PDF_IMPORT_URL || DEFAULT_PDF_IMPORT_ENDPOINT;

export const importLessonFromPdf = async (payload = {}) => {
  const endpoint = getPdfImportEndpoint();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `PDF import failed (${response.status})${
        errorBody ? `: ${errorBody}` : ""
      }`
    );
  }

  return response.json();
};
