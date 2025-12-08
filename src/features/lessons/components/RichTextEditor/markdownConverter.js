/**
 * Markdown ↔ Tiptap conversion utilities
 *
 * The tiptap-markdown extension handles most conversion automatically.
 * These helpers provide additional utilities for edge cases.
 */

/**
 * Normalize markdown before feeding to Tiptap
 * Handles edge cases that tiptap-markdown might not handle well
 */
export const normalizeMarkdown = (markdown) => {
  if (!markdown) return "";

  let normalized = markdown;

  // Ensure consistent line endings
  normalized = normalized.replace(/\r\n/g, "\n");

  // Preserve empty lines by ensuring double newlines for paragraph breaks
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  return normalized;
};

/**
 * Post-process markdown output from Tiptap
 * Ensures the output matches the expected backend format
 */
export const postProcessMarkdown = (markdown) => {
  if (!markdown) return "";

  let processed = markdown;

  // Ensure consistent line endings
  processed = processed.replace(/\r\n/g, "\n");

  // Remove trailing whitespace from lines
  processed = processed.replace(/[ \t]+$/gm, "");

  // Ensure single trailing newline
  processed = processed.replace(/\n*$/, "\n");

  // If the content is effectively empty, return empty string
  if (processed.trim() === "") {
    return "";
  }

  return processed;
};

/**
 * Check if content has meaningful text
 */
export const hasContent = (markdown) => {
  if (!markdown) return false;
  return markdown.trim().length > 0;
};
