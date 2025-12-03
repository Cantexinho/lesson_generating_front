import React, { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
import LessonGenerationInput from "features/lessons/components/LessonGenerationInput";

const TABS = {
  GENERATE: "generate",
  IMPORT: "import",
};

const LessonSetupModal = ({
  isOpen,
  title,
  onTitleChange,
  onClose,
  onImportPdf,
}) => {
  const [activeTab, setActiveTab] = useState(TABS.GENERATE);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handlePdfSelection = useCallback(
    (fileList) => {
      if (!fileList?.length) {
        return;
      }

      const pdfFile = Array.from(fileList).find((file) => {
        const matchesMime = file.type === "application/pdf";
        const matchesExtension = file.name.toLowerCase().endsWith(".pdf");
        return matchesMime || matchesExtension;
      });

      if (!pdfFile) {
        return;
      }

      setSelectedFileName(pdfFile.name);
      if (onImportPdf) {
        onImportPdf(pdfFile);
      }
    },
    [onImportPdf]
  );

  const handleFileInputChange = (event) => {
    handlePdfSelection(event.target.files);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handlePdfSelection(event.dataTransfer?.files);
  };

  if (!isOpen) {
    return null;
  }

  const getTabButtonClasses = (tabId) => {
    const isActive = activeTab === tabId;
    const base =
      "relative px-4 py-3 text-sm font-semibold transition-colors focus:outline-none";
    return isActive
      ? `${base} text-blue-600 dark:text-blue-400`
      : `${base} text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`;
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative mx-auto flex h-[370px] w-full max-w-2xl flex-col rounded-2xl bg-secondary p-4 shadow-2xl dark:bg-secondary-dark sm:p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full border-b border-gray-200 pb-1 dark:border-gray-700">
            <button
              type="button"
              className={getTabButtonClasses(TABS.GENERATE)}
              onClick={() => setActiveTab(TABS.GENERATE)}
            >
              Generate Lesson
              {activeTab === TABS.GENERATE && (
                <span className="absolute inset-x-0 -bottom-[6px] h-[3px] rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              type="button"
              className={getTabButtonClasses(TABS.IMPORT)}
              onClick={() => setActiveTab(TABS.IMPORT)}
            >
              Import Lesson
              {activeTab === TABS.IMPORT && (
                <span className="absolute inset-x-0 -bottom-[6px] h-[3px] rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 text-2xl font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-3 flex flex-1 flex-col overflow-hidden">
          {activeTab === TABS.GENERATE ? (
            <div className="flex flex-1 flex-col overflow-hidden px-1">
              <LessonGenerationInput
                title={title}
                handleTitleChange={onTitleChange}
                passedProps="flex h-full w-full max-w-none"
                placeholderText="Describe lesson to generate..."
                onSubmit={null}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center overflow-hidden px-1">
              <div
                className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20"
                    : "border-gray-300 bg-secondary dark:border-gray-700 dark:bg-secondary-dark"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  className="mb-3 text-3xl text-blue-500"
                />
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Drag your PDF here
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  or
                </p>
                <button
                  type="button"
                  className="mt-2 rounded-lg border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse files
                </button>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Supports PDF up to 30MB
                </p>
                {selectedFileName && (
                  <p className="mt-4 inline-flex rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {selectedFileName}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonSetupModal;

