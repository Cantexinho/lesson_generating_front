let pdfjsLibPromise;

const loadPdfJs = async () => {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import("pdfjs-dist/legacy/build/pdf").then((pdfjsLib) => {
      if (pdfjsLib.GlobalWorkerOptions) {
        // CRA needs the worker referenced via URL so bundler can inline it.
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdf.worker.min.mjs",
          import.meta.url
        ).toString();
      }

      return pdfjsLib;
    });
  }

  return pdfjsLibPromise;
};

export const extractTextFromPdf = async (file) => {
  if (!file) {
    return "";
  }

  const pdfjsLib = await loadPdfJs();
  const data = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise;

  let combinedText = "";
  for (
    let pageNumber = 1;
    pageNumber <= pdfDocument.numPages;
    pageNumber += 1
  ) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (typeof item.str === "string" ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      combinedText += `${pageText}\n\n`;
    }
  }

  return combinedText.trim();
};

const SECTION_CHAR_TARGET = 1200;

export const buildLessonPartsFromText = (text) => {
  if (!text) {
    return [];
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((chunk) => chunk.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const sections = [];
  let buffer = [];
  let charCount = 0;

  const flushSection = () => {
    if (!buffer.length) {
      return;
    }
    sections.push(buffer.join(" ").trim());
    buffer = [];
    charCount = 0;
  };

  paragraphs.forEach((paragraph) => {
    if (buffer.length && charCount + paragraph.length > SECTION_CHAR_TARGET) {
      flushSection();
    }

    buffer.push(paragraph);
    charCount += paragraph.length;
  });

  flushSection();

  if (!sections.length) {
    sections.push(text.trim());
  }

  return sections.map((content, index) => ({
    id: `pdf-section-${index + 1}`,
    number: index + 1,
    name: `Imported Section ${index + 1}`,
    lesson_part_content: content,
  }));
};
