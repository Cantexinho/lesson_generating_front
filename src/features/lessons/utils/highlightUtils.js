export const HIGHLIGHT_STYLE_MAP = {
  ask: {
    active:
      "bg-yellow-100 text-black border border-yellow-400/80 dark:bg-yellow-500/20 dark:text-white dark:border-yellow-400/70",
    preview:
      "bg-yellow-50 text-black border border-yellow-300/80 dark:bg-yellow-500/10 dark:text-white dark:border-yellow-400/40",
  },
  explain: {
    active:
      "bg-green-100 text-black border border-green-400/80 dark:bg-green-500/20 dark:text-white dark:border-green-400/70",
    preview:
      "bg-green-50 text-black border border-green-300/80 dark:bg-green-500/10 dark:text-white dark:border-green-400/40",
  },
  expand: {
    active:
      "bg-blue-100 text-black border border-blue-400/80 dark:bg-blue-500/20 dark:text-white dark:border-blue-400/70",
    preview:
      "bg-blue-50 text-black border border-blue-300/80 dark:bg-blue-500/10 dark:text-white dark:border-blue-400/40",
  },
  simplify: {
    active:
      "bg-purple-100 text-black border border-purple-400/80 dark:bg-purple-500/20 dark:text-white dark:border-purple-400/70",
    preview:
      "bg-purple-50 text-black border border-purple-300/80 dark:bg-purple-500/10 dark:text-white dark:border-purple-400/40",
  },
  exercises: {
    active:
      "bg-orange-100 text-black border border-orange-400/80 dark:bg-orange-500/20 dark:text-white dark:border-orange-400/70",
    preview:
      "bg-orange-50 text-black border border-orange-300/80 dark:bg-orange-500/10 dark:text-white dark:border-orange-400/40",
  },
  default: {
    active:
      "bg-blue-100 text-black border border-blue-400/80 dark:bg-blue-500/20 dark:text-white dark:border-blue-400/70",
    preview:
      "bg-blue-50 text-black border border-blue-300/80 dark:bg-blue-500/10 dark:text-white dark:border-blue-400/40",
  },
};

export const getHighlightClasses = (action, variant) => {
  const styles = HIGHLIGHT_STYLE_MAP[action] || HIGHLIGHT_STYLE_MAP.default;
  return styles[variant] || "";
};

export const UNION_UNDERLINE_STYLE = {
  textDecorationLine: "underline",
  textDecorationStyle: "dotted",
  textDecorationColor: "rgba(59, 130, 246, 0.7)",
  textDecorationThickness: "1.5px",
  textUnderlineOffset: "0.24em",
};

export const normalizeHighlights = (contentLength, highlights = []) =>
  highlights
    .map((highlight, index) => {
      if (
        typeof highlight.start !== "number" ||
        typeof highlight.end !== "number"
      ) {
        return null;
      }
      const start = Math.max(0, Math.min(contentLength, highlight.start));
      const end = Math.max(start, Math.min(contentLength, highlight.end));
      if (start === end) {
        return null;
      }
      return {
        ...highlight,
        start,
        end,
        order: index,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.start === b.start) {
        return a.end - b.end;
      }
      return a.start - b.start;
    });

export const sortHighlightIdsByPriority = (ids = [], lookup = {}) =>
  [...ids].sort((idA, idB) => {
    const a = lookup[idA];
    const b = lookup[idB];
    if (!a || !b) {
      return 0;
    }
    const lengthDiff = b.end - b.start - (a.end - a.start);
    if (lengthDiff !== 0) {
      return lengthDiff;
    }
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return (a.order || 0) - (b.order || 0);
  });

export const buildContentPieces = (content, highlights, highlightLookup) => {
  if (!content) {
    return {
      pieces: [],
      anchorsByOffset: {},
    };
  }

  if (!highlights.length) {
    return {
      pieces: [
        {
          type: "text",
          id: "text-0",
          text: content,
        },
      ],
      anchorsByOffset: {},
    };
  }

  const anchorsByOffset = highlights.reduce((acc, highlight) => {
    if (!acc[highlight.start]) {
      acc[highlight.start] = [];
    }
    acc[highlight.start].push(highlight.id);
    return acc;
  }, {});

  const boundarySet = new Set([0, content.length]);
  highlights.forEach(({ start, end }) => {
    boundarySet.add(start);
    boundarySet.add(end);
  });

  const boundaryPoints = Array.from(boundarySet).sort((a, b) => a - b);
  const segments = [];

  for (let i = 0; i < boundaryPoints.length - 1; i += 1) {
    const start = boundaryPoints[i];
    const end = boundaryPoints[i + 1];

    if (start === end) {
      continue;
    }

    const text = content.slice(start, end);
    const highlightIds = highlights
      .filter((highlight) => highlight.start < end && highlight.end > start)
      .map((highlight) => highlight.id);
    const orderedHighlightIds = sortHighlightIdsByPriority(
      highlightIds,
      highlightLookup
    );

    segments.push({
      id: `segment-${start}-${end}`,
      start,
      end,
      text,
      highlightIds,
      orderedHighlightIds,
      primaryHighlightId: orderedHighlightIds[0] || null,
    });
  }

  const pieces = [];
  let currentBlock = null;
  let blockIndex = 0;

  const closeBlock = () => {
    if (currentBlock) {
      const highlightIds = currentBlock.highlightSet
        ? Array.from(currentBlock.highlightSet)
        : [];
      currentBlock.blockHighlightIds = sortHighlightIdsByPriority(
        highlightIds,
        highlightLookup
      );
      const idSet = new Set(currentBlock.blockHighlightIds);
      currentBlock.blockHighlightCount = idSet.size;
      currentBlock.primaryHighlightId =
        currentBlock.blockHighlightIds[0] || null;
      delete currentBlock.highlightSet;
      pieces.push(currentBlock);
      currentBlock = null;
    }
  };

  segments.forEach((segment) => {
    if (segment.highlightIds.length) {
      if (!currentBlock) {
        const blockId = `block-${blockIndex}`;
        blockIndex += 1;
        currentBlock = {
          type: "block",
          id: blockId,
          segments: [],
          peakOverlap: 0,
          highlightSet: new Set(),
        };
      }
      const blockSegment = {
        ...segment,
        blockId: currentBlock.id,
        overlap: segment.highlightIds.length,
      };
      currentBlock.segments.push(blockSegment);
      blockSegment.highlightIds.forEach((id) =>
        currentBlock.highlightSet.add(id)
      );
      currentBlock.peakOverlap = Math.max(
        currentBlock.peakOverlap,
        blockSegment.overlap
      );
    } else {
      closeBlock();
      pieces.push({
        type: "text",
        id: segment.id,
        text: segment.text,
      });
    }
  });

  closeBlock();

  return {
    pieces,
    anchorsByOffset,
  };
};
