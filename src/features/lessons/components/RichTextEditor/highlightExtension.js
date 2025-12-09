import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export const highlightPluginKey = new PluginKey("highlightDecoration");

/**
 * Extracts all text content from the document and builds a mapping
 * from text offsets to ProseMirror positions.
 */
const extractTextWithPositions = (doc) => {
  let fullText = "";
  const segments = [];

  doc.descendants((node, pos) => {
    if (node.isText) {
      segments.push({
        pos,
        offset: fullText.length,
        length: node.text.length,
        text: node.text,
      });
      fullText += node.text;
    }
    return true;
  });

  return { fullText, segments };
};

/**
 * Converts a text offset to a ProseMirror position using the segments map.
 */
const textOffsetToPmPos = (segments, textOffset) => {
  for (const seg of segments) {
    if (seg.offset + seg.length > textOffset) {
      return seg.pos + (textOffset - seg.offset);
    }
  }
  const lastSeg = segments[segments.length - 1];
  if (lastSeg) {
    return lastSeg.pos + lastSeg.length;
  }
  return 0;
};

/**
 * Finds the position of a text string in the document.
 */
const findTextInDoc = (
  fullText,
  segments,
  searchText,
  approximateOffset = 0
) => {
  if (!searchText || !fullText) return null;

  // First try exact match near approximate position
  let foundIndex = fullText.indexOf(
    searchText,
    Math.max(0, approximateOffset - 10)
  );
  if (
    foundIndex !== -1 &&
    foundIndex < approximateOffset + searchText.length + 10
  ) {
    return {
      from: textOffsetToPmPos(segments, foundIndex),
      to: textOffsetToPmPos(segments, foundIndex + searchText.length),
      textFrom: foundIndex,
      textTo: foundIndex + searchText.length,
    };
  }

  // Try from the beginning
  foundIndex = fullText.indexOf(searchText);
  if (foundIndex !== -1) {
    return {
      from: textOffsetToPmPos(segments, foundIndex),
      to: textOffsetToPmPos(segments, foundIndex + searchText.length),
      textFrom: foundIndex,
      textTo: foundIndex + searchText.length,
    };
  }

  // Try normalized search (handles whitespace differences)
  const normalizedSearch = searchText.replace(/\s+/g, " ").trim();
  const normalizedFull = fullText.replace(/\s+/g, " ");
  const normalizedIndex = normalizedFull.indexOf(normalizedSearch);

  if (normalizedIndex !== -1) {
    let origIndex = 0;
    let normIndex = 0;
    while (normIndex < normalizedIndex && origIndex < fullText.length) {
      const char = fullText[origIndex];
      if (
        !/\s/.test(char) ||
        (normIndex > 0 && normalizedFull[normIndex - 1] !== " ")
      ) {
        normIndex++;
      } else if (/\s/.test(char)) {
        while (
          origIndex + 1 < fullText.length &&
          /\s/.test(fullText[origIndex + 1])
        ) {
          origIndex++;
        }
        normIndex++;
      }
      origIndex++;
    }

    let endOrigIndex = origIndex;
    let searchLen = normalizedSearch.length;
    while (searchLen > 0 && endOrigIndex < fullText.length) {
      if (!/\s/.test(fullText[endOrigIndex])) {
        searchLen--;
      }
      endOrigIndex++;
    }

    return {
      from: textOffsetToPmPos(segments, origIndex),
      to: textOffsetToPmPos(segments, endOrigIndex),
      textFrom: origIndex,
      textTo: endOrigIndex,
    };
  }

  return null;
};

/**
 * Resolves PM positions for all highlights.
 */
const resolveHighlightPositions = (highlights, fullText, textSegments) => {
  return highlights
    .map((highlight) => {
      let positions = null;

      if (highlight.text) {
        positions = findTextInDoc(
          fullText,
          textSegments,
          highlight.text,
          highlight.start || 0
        );
      }

      if (
        !positions &&
        typeof highlight.start === "number" &&
        typeof highlight.end === "number"
      ) {
        positions = {
          from: textOffsetToPmPos(textSegments, highlight.start),
          to: textOffsetToPmPos(textSegments, highlight.end),
          textFrom: highlight.start,
          textTo: highlight.end,
        };
      }

      if (!positions || positions.from >= positions.to) {
        return null;
      }

      return {
        ...highlight,
        pmFrom: positions.from,
        pmTo: positions.to,
        textFrom: positions.textFrom,
        textTo: positions.textTo,
      };
    })
    .filter(Boolean);
};

/**
 * Sort highlights by priority: larger (outer) highlights first, then by start position.
 */
const sortHighlightsByPriority = (highlights) => {
  return [...highlights].sort((a, b) => {
    const aLen = a.pmTo - a.pmFrom;
    const bLen = b.pmTo - b.pmFrom;
    if (aLen !== bLen) return bLen - aLen; // Larger first
    return a.pmFrom - b.pmFrom;
  });
};

/**
 * Build segments at highlight boundaries.
 */
const buildHighlightSegments = (resolvedHighlights, maxPos) => {
  if (!resolvedHighlights.length) return [];

  // Collect all boundary points
  const boundaries = new Set([0, maxPos]);
  resolvedHighlights.forEach((h) => {
    boundaries.add(h.pmFrom);
    boundaries.add(h.pmTo);
  });

  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
  const segments = [];

  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const from = sortedBoundaries[i];
    const to = sortedBoundaries[i + 1];
    if (from >= to) continue;

    // Find all highlights that cover this segment
    const coveringHighlights = resolvedHighlights.filter(
      (h) => h.pmFrom <= from && h.pmTo >= to
    );

    segments.push({
      from,
      to,
      highlightIds: coveringHighlights.map((h) => h.id),
      highlights: coveringHighlights,
    });
  }

  return segments;
};

/**
 * Group contiguous highlighted segments into blocks.
 */
const groupSegmentsIntoBlocks = (segments) => {
  const blocks = [];
  let currentBlock = null;

  segments.forEach((segment) => {
    if (segment.highlightIds.length > 0) {
      if (!currentBlock) {
        currentBlock = {
          from: segment.from,
          to: segment.to,
          segments: [segment],
          allHighlightIds: new Set(segment.highlightIds),
        };
      } else {
        currentBlock.to = segment.to;
        currentBlock.segments.push(segment);
        segment.highlightIds.forEach((id) =>
          currentBlock.allHighlightIds.add(id)
        );
      }
    } else {
      if (currentBlock) {
        currentBlock.allHighlightIds = Array.from(currentBlock.allHighlightIds);
        blocks.push(currentBlock);
        currentBlock = null;
      }
    }
  });

  if (currentBlock) {
    currentBlock.allHighlightIds = Array.from(currentBlock.allHighlightIds);
    blocks.push(currentBlock);
  }

  return blocks;
};

/**
 * Builds decoration set from highlights with proper overlapping support.
 */
const buildDecorations = (
  doc,
  highlights,
  activeHighlightId,
  previewHighlightId
) => {
  if (!highlights || !highlights.length) {
    return DecorationSet.empty;
  }

  const { fullText, segments: textSegments } = extractTextWithPositions(doc);
  if (!textSegments.length) {
    return DecorationSet.empty;
  }

  const maxPos = doc.content.size;

  // Resolve PM positions for all highlights
  const resolvedHighlights = resolveHighlightPositions(
    highlights,
    fullText,
    textSegments
  );
  if (!resolvedHighlights.length) {
    return DecorationSet.empty;
  }

  // Sort by priority (larger first)
  const sortedHighlights = sortHighlightsByPriority(resolvedHighlights);

  // Build segments at highlight boundaries
  const allSegments = buildHighlightSegments(sortedHighlights, maxPos);

  // Group into blocks
  const blocks = groupSegmentsIntoBlocks(allSegments);

  const decorations = [];

  blocks.forEach((block) => {
    // Sort block highlight IDs by priority (larger highlights first)
    const blockHighlightsOrdered = sortedHighlights.filter((h) =>
      block.allHighlightIds.includes(h.id)
    );
    const orderedBlockIds = blockHighlightsOrdered.map((h) => h.id);

    // Determine which highlight is "emphasized" (active > preview > first/largest)
    let emphasizedId = null;
    if (activeHighlightId && orderedBlockIds.includes(activeHighlightId)) {
      emphasizedId = activeHighlightId;
    } else if (
      previewHighlightId &&
      orderedBlockIds.includes(previewHighlightId)
    ) {
      emphasizedId = previewHighlightId;
    }

    block.segments.forEach((segment, segIndex) => {
      const segmentHighlightIds = segment.highlightIds;

      // Determine styling for this segment
      let variant = "idle";
      let isEmphasizedSegment = false;

      if (emphasizedId && segmentHighlightIds.includes(emphasizedId)) {
        // This segment contains the emphasized highlight
        isEmphasizedSegment = true;
        variant = emphasizedId === previewHighlightId ? "preview" : "active";
      } else if (emphasizedId) {
        // Block has an emphasized highlight, but not in this segment
        // This segment should show as "idle" (dotted underline)
        variant = "idle";
      } else {
        // No emphasized highlight - show the primary (largest) as active
        const primaryId = orderedBlockIds[0];
        if (segmentHighlightIds.includes(primaryId)) {
          variant = "active";
          isEmphasizedSegment = true;
        }
      }

      // Determine border radius based on segment position in block
      const isFirst = segIndex === 0;
      const isLast = segIndex === block.segments.length - 1;
      const prevSegment = segIndex > 0 ? block.segments[segIndex - 1] : null;
      const nextSegment =
        segIndex < block.segments.length - 1
          ? block.segments[segIndex + 1]
          : null;

      // Check if emphasized continues from prev/next
      const continuesFromPrev =
        isEmphasizedSegment &&
        prevSegment?.highlightIds.includes(emphasizedId || orderedBlockIds[0]);
      const continuesIntoNext =
        isEmphasizedSegment &&
        nextSegment?.highlightIds.includes(emphasizedId || orderedBlockIds[0]);

      const classes = [
        "highlight-decoration",
        `highlight-decoration--${variant}`,
        `highlight-decoration--${segment.highlights[0]?.action || "default"}`,
      ];

      if (isEmphasizedSegment) {
        if (continuesFromPrev)
          classes.push("highlight-decoration--continues-left");
        if (continuesIntoNext)
          classes.push("highlight-decoration--continues-right");
      }

      decorations.push(
        Decoration.inline(segment.from, segment.to, {
          class: classes.join(" "),
          "data-highlight-id": segmentHighlightIds[0],
          "data-block-highlight-ids": orderedBlockIds.join(" "),
        })
      );
    });
  });

  return DecorationSet.create(doc, decorations);
};

const HighlightExtension = Extension.create({
  name: "highlightDecoration",

  addOptions() {
    return {
      highlights: [],
      activeHighlightId: null,
      previewHighlightId: null,
      onHighlightClick: null,
    };
  },

  addStorage() {
    return {
      highlights: this.options.highlights,
      activeHighlightId: this.options.activeHighlightId,
      previewHighlightId: this.options.previewHighlightId,
      onHighlightClick: this.options.onHighlightClick,
    };
  },

  onCreate() {
    this.storage.onHighlightClick = this.options.onHighlightClick;
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: highlightPluginKey,
        state: {
          init(_, { doc }) {
            return buildDecorations(
              doc,
              extension.options.highlights,
              extension.options.activeHighlightId,
              extension.options.previewHighlightId
            );
          },
          apply(tr, oldDecorations, oldState, newState) {
            const highlightMeta = tr.getMeta(highlightPluginKey);
            if (highlightMeta) {
              return buildDecorations(
                newState.doc,
                highlightMeta.highlights,
                highlightMeta.activeHighlightId,
                highlightMeta.previewHighlightId
              );
            }

            if (tr.docChanged) {
              return oldDecorations.map(tr.mapping, tr.doc);
            }

            return oldDecorations;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleClick(view, pos, event) {
            const onHighlightClick = extension.storage.onHighlightClick;
            if (!onHighlightClick) return false;

            const target = event.target;
            const highlightEl = target.closest?.("[data-highlight-id]");
            if (!highlightEl) return false;

            // Get all highlight IDs in this block
            const blockHighlightIds = highlightEl.getAttribute(
              "data-block-highlight-ids"
            );
            const highlightIds = blockHighlightIds
              ? blockHighlightIds.split(" ")
              : [];
            const primaryId = highlightEl.getAttribute("data-highlight-id");

            if (highlightIds.length > 0 || primaryId) {
              const rect = highlightEl.getBoundingClientRect();
              onHighlightClick(
                highlightIds.length > 0 ? highlightIds : [primaryId],
                rect,
                event
              );
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});

/**
 * Helper to update highlights via transaction.
 */
export const updateHighlights = (
  editor,
  highlights,
  activeHighlightId,
  previewHighlightId
) => {
  if (!editor) return;

  const tr = editor.state.tr.setMeta(highlightPluginKey, {
    highlights,
    activeHighlightId,
    previewHighlightId,
  });

  editor.view.dispatch(tr);
};

/**
 * Helper to update the click handler dynamically.
 */
export const setHighlightClickHandler = (editor, handler) => {
  if (!editor) return;

  const ext = editor.extensionManager.extensions.find(
    (e) => e.name === "highlightDecoration"
  );
  if (ext && ext.storage) {
    ext.storage.onHighlightClick = handler;
  }
};

export default HighlightExtension;
