let pdfjsLibPromise;

const loadPdfJs = async () => {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import("pdfjs-dist/legacy/build/pdf").then((pdfjsLib) => {
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
      }

      return pdfjsLib;
    });
  }

  return pdfjsLibPromise;
};

export const extractPdfContent = async (file) => {
  if (!file) {
    return {
      rawText: "",
      pageCount: 0,
      totalCharacters: 0,
      pages: [],
      metadata: {},
    };
  }

  const pdfjsLib = await loadPdfJs();
  const data = await file.arrayBuffer();
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise;

  const pages = [];
  const pageCount = pdfDocument.numPages;
  let combinedText = "";

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (typeof item.str === "string" ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const normalizedText = pageText.trim();
    pages.push({
      pageNumber,
      charCount: normalizedText.length,
      text: normalizedText,
    });

    if (normalizedText) {
      combinedText += `${normalizedText}\n\n`;
    }
  }

  const rawText = combinedText.trim();

  return {
    rawText,
    pageCount,
    totalCharacters: rawText.length,
    pages,
    metadata: {
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || "application/pdf",
      extractedAt: new Date().toISOString(),
    },
  };
};

export const extractTextFromPdf = async (file) => {
  const data = await extractPdfContent(file);
  return data.rawText;
};

const SECTION_CHAR_TARGET = 1200;

export const buildLessonSectionsFromText = (text) => {
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

export const buildPdfImportRequest = (file, pdfContent) => {
  if (!pdfContent) {
    return null;
  }

  const fallbackName = file?.name || "Imported lesson";
  const standardPayload = {
    fileName: fallbackName,
    fileSizeBytes: file?.size ?? null,
    mimeType: file?.type || "application/pdf",
    pageCount: pdfContent.pageCount,
    totalCharacters: pdfContent.totalCharacters,
    fullText: pdfContent.rawText,
    pages: pdfContent.pages,
    textPreview: pdfContent.rawText.slice(0, 2000),
    metadata: {
      ...pdfContent.metadata,
      averageCharsPerPage:
        pdfContent.pageCount > 0
          ? Math.round(pdfContent.totalCharacters / pdfContent.pageCount)
          : 0,
    },
  };

  return standardPayload;
};
