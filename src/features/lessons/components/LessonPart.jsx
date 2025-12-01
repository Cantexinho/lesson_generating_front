import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Spinner from "./Spinner";

const HIGHLIGHT_STYLE_MAP = {
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

const getHighlightClasses = (action, variant) => {
  const styles = HIGHLIGHT_STYLE_MAP[action] || HIGHLIGHT_STYLE_MAP.default;
  return styles[variant] || "";
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const UNION_UNDERLINE_STYLE = {
  textDecorationLine: "underline",
  textDecorationStyle: "dotted",
  textDecorationColor: "rgba(59, 130, 246, 0.7)",
  textDecorationThickness: "1.5px",
  textUnderlineOffset: "0.24em",
};

const normalizeHighlights = (contentLength, highlights = []) =>
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

const sortHighlightIdsByPriority = (ids = [], lookup = {}) =>
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

const buildContentPieces = (content, highlights, highlightLookup) => {
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

const LessonPart = ({
  part,
  loading,
  highlights = [],
  onHighlightSelect,
  activeHighlightId = null,
  previewHighlightId = null,
}) => {
  const content = part.lesson_part_content || "";
  const contentWrapperRef = useRef(null);
  const popoverRef = useRef(null);
  const [popoverState, setPopoverState] = useState(null);

  const normalizedHighlights = useMemo(
    () => normalizeHighlights(content.length, highlights),
    [content, highlights]
  );

  const highlightLookup = useMemo(() => {
    const lookup = {};
    normalizedHighlights.forEach((highlight) => {
      lookup[highlight.id] = highlight;
    });
    return lookup;
  }, [normalizedHighlights]);

  const { pieces, anchorsByOffset } = useMemo(
    () => buildContentPieces(content, normalizedHighlights, highlightLookup),
    [content, normalizedHighlights, highlightLookup]
  );

  const popoverHighlights = useMemo(() => {
    if (!popoverState) {
      return [];
    }
    return popoverState.highlightIds
      .map((id) => highlightLookup[id])
      .filter(Boolean);
  }, [popoverState, highlightLookup]);

  const closePopover = useCallback(() => {
    setPopoverState(null);
  }, []);

  useEffect(() => {
    if (!popoverState) {
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (popoverRef.current?.contains(event.target)) {
        return;
      }
      closePopover();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [popoverState, closePopover]);

  useEffect(() => {
    if (popoverState && popoverRef.current) {
      popoverRef.current.focus();
    }
  }, [popoverState]);

  useEffect(() => {
    if (!popoverState) {
      return;
    }

    if (!popoverHighlights.length) {
      closePopover();
      return;
    }

    if (
      activeHighlightId &&
      !popoverState.highlightIds.includes(activeHighlightId)
    ) {
      closePopover();
      return;
    }

    if (
      activeHighlightId &&
      popoverState.highlightIds.includes(activeHighlightId) &&
      popoverState.activeHighlightId !== activeHighlightId
    ) {
      setPopoverState((prev) =>
        prev
          ? {
              ...prev,
              activeHighlightId,
            }
          : prev
      );
    }
  }, [activeHighlightId, popoverState, popoverHighlights, closePopover]);

  const handlePopoverSelect = useCallback(
    (highlightId) => {
      if (!highlightId) {
        return;
      }
      onHighlightSelect?.(highlightId);
      setPopoverState((prev) =>
        prev
          ? {
              ...prev,
              activeHighlightId: highlightId,
            }
          : prev
      );
    },
    [onHighlightSelect]
  );

  const handleCycle = useCallback(
    (direction) => {
      setPopoverState((prev) => {
        if (!prev || prev.highlightIds.length < 2) {
          return prev;
        }
        const currentId =
          prev.activeHighlightId && prev.highlightIds.includes(prev.activeHighlightId)
            ? prev.activeHighlightId
            : prev.highlightIds[0];
        const currentIndex = prev.highlightIds.indexOf(currentId);
        const nextIndex =
          (currentIndex + direction + prev.highlightIds.length) %
          prev.highlightIds.length;
        const nextHighlightId = prev.highlightIds[nextIndex];
        if (nextHighlightId) {
          onHighlightSelect?.(nextHighlightId);
          return {
            ...prev,
            activeHighlightId: nextHighlightId,
          };
        }
        return prev;
      });
    },
    [onHighlightSelect]
  );

  const handlePopoverKeyDown = useCallback(
    (event) => {
      if (!popoverState) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleCycle(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleCycle(-1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        closePopover();
      }
    },
    [popoverState, handleCycle, closePopover]
  );

  const handleSegmentActivate = useCallback(
    (segment, blockContext, event) => {
      if (!segment.highlightIds.length) {
        return;
      }

      const selection =
        typeof window !== "undefined"
          ? window.getSelection()?.toString().trim()
          : "";

      if (selection) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const wrapperRect = contentWrapperRef.current?.getBoundingClientRect();
      const targetRect = event.currentTarget.getBoundingClientRect();

      if (!wrapperRect) {
        return;
      }

      const blockHighlightIds = blockContext?.blockHighlightIds;
      const blockOrderedIds =
        (blockHighlightIds && blockHighlightIds.length
          ? blockHighlightIds
          : segment.orderedHighlightIds) || segment.highlightIds;
      const segmentOrderedIds =
        segment.orderedHighlightIds && segment.orderedHighlightIds.length
          ? segment.orderedHighlightIds
          : segment.highlightIds;

      const validHighlightIds = blockOrderedIds.filter(
        (id) => highlightLookup[id]
      );

      if (!validHighlightIds.length) {
        return;
      }

      const hasActiveOnSegment =
        activeHighlightId && segmentOrderedIds.includes(activeHighlightId);
      const initialHighlightId = hasActiveOnSegment
        ? activeHighlightId
        : segmentOrderedIds.find((id) => validHighlightIds.includes(id)) ||
          validHighlightIds[0];

      if (initialHighlightId && initialHighlightId !== activeHighlightId) {
        onHighlightSelect?.(initialHighlightId);
      }

      const rawLeft =
        targetRect.left + targetRect.width / 2 - wrapperRect.left;
      const clampedLeft = clamp(
        rawLeft,
        16,
        Math.max((wrapperRect.width || 0) - 16, 16)
      );
      const top = targetRect.bottom - wrapperRect.top + 8;

      setPopoverState({
        blockKey: segment.blockId,
        highlightIds: validHighlightIds,
        activeHighlightId: initialHighlightId,
        position: {
          top,
          left: clampedLeft,
        },
      });
    },
    [activeHighlightId, highlightLookup, onHighlightSelect]
  );

  const renderSegmentAnchors = (segmentStart) => {
    const anchorIds = anchorsByOffset[segmentStart] || [];
    if (!anchorIds.length) {
      return null;
    }
    return anchorIds.map((anchorId) => (
      <span
        key={`anchor-${anchorId}`}
        data-highlight-anchor={anchorId}
        aria-hidden="true"
        className="inline-block h-0 w-0 overflow-hidden align-top"
      />
    ));
  };

  const renderBlockSegment = (segment, block, segmentIndex) => {
    const hasHighlights = segment.highlightIds.length > 0;
    const candidateIds = segment.highlightIds;

    const resolveEmphasizedId = () => {
      const previewIsActive =
        previewHighlightId && candidateIds.includes(previewHighlightId);
      if (previewIsActive) {
        return previewHighlightId;
      }

      const activeIsPresent =
        activeHighlightId && candidateIds.includes(activeHighlightId);
      if (activeIsPresent) {
        return activeHighlightId;
      }

      return null;
    };

    const emphasizedHighlightId = hasHighlights ? resolveEmphasizedId() : null;
    const highlightData =
      emphasizedHighlightId && hasHighlights
        ? highlightLookup[emphasizedHighlightId]
        : null;
    const isPreviewVariant =
      Boolean(previewHighlightId) &&
      previewHighlightId === emphasizedHighlightId &&
      previewHighlightId !== activeHighlightId;
    const highlightClass = highlightData
      ? getHighlightClasses(
          highlightData.action,
          isPreviewVariant ? "preview" : "active"
        )
      : "";
    const shouldEmphasize = Boolean(highlightData);

    const interactiveProps = hasHighlights
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label":
            segment.highlightIds.length === 1
              ? "View annotation details"
              : `View ${segment.highlightIds.length} annotations`,
          onClick: (event) => handleSegmentActivate(segment, block, event),
          onKeyDown: (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
              handleSegmentActivate(segment, block, event);
            }
          },
        }
      : {};

    const previousSegment =
      segmentIndex > 0 ? block.segments[segmentIndex - 1] : null;
    const nextSegment =
      segmentIndex < block.segments.length - 1
        ? block.segments[segmentIndex + 1]
        : null;

    const continuesFromPrev =
      shouldEmphasize &&
      previousSegment?.highlightIds?.includes(emphasizedHighlightId);
    const continuesIntoNext =
      shouldEmphasize &&
      nextSegment?.highlightIds?.includes(emphasizedHighlightId);

    const segmentStyle = {};

    if (shouldEmphasize) {
      if (!isPreviewVariant) {
        segmentStyle.textDecoration = "none";
      }
      if (continuesFromPrev) {
        segmentStyle.borderTopLeftRadius = 0;
        segmentStyle.borderBottomLeftRadius = 0;
        segmentStyle.borderLeftWidth = 0;
      }
      if (continuesIntoNext) {
        segmentStyle.borderTopRightRadius = 0;
        segmentStyle.borderBottomRightRadius = 0;
        segmentStyle.borderRightWidth = 0;
      }
    }

    return (
      <span
        key={segment.id}
        data-highlight-segment="true"
        data-highlight-ids={segment.highlightIds.join(" ")}
        data-highlight-block={block.id}
        className={`relative inline ${
          hasHighlights ? "cursor-pointer focus:outline-none" : ""
        } ${highlightClass ? `${highlightClass} rounded-sm` : ""} ${
          shouldEmphasize && !isPreviewVariant ? "shadow-inner" : ""
        }`}
        style={Object.keys(segmentStyle).length ? segmentStyle : undefined}
        {...interactiveProps}
      >
        {renderSegmentAnchors(segment.start)}
        {segment.text}
      </span>
    );
  };

  const renderPiece = (piece) => {
    if (piece.type === "text") {
      return (
        <span key={piece.id} className="inline">
          {piece.text}
        </span>
      );
    }

    const actionCount = piece.blockHighlightCount || 0;
    const showBadge = actionCount > 0;

      const blockHighlightIds = piece.blockHighlightIds || [];
      const blockPrimaryHighlightId = blockHighlightIds[0] || null;
      const selectedHighlightId = previewHighlightId || activeHighlightId || null;
      const shouldShowUnderline =
        Boolean(blockPrimaryHighlightId) &&
        selectedHighlightId !== blockPrimaryHighlightId;

      return (
        <span
          key={piece.id}
          data-annotation-block={piece.id}
          className={`relative inline ${
            shouldShowUnderline ? "idle-underline" : ""
          }`}
          style={shouldShowUnderline ? UNION_UNDERLINE_STYLE : undefined}
        >
        {showBadge && (
          <span
            className="absolute -top-3 left-0 rounded-full bg-slate-900 px-1 text-[9px] font-semibold uppercase tracking-wide text-white shadow dark:bg-slate-200 dark:text-slate-900"
            aria-label={`${actionCount} actions in this block`}
          >
            {actionCount}
          </span>
        )}
        {piece.segments.map((segment, index) =>
          renderBlockSegment(segment, piece, index)
        )}
      </span>
    );
  };

  const popoverActiveIndex = popoverHighlights.findIndex(
    (highlight) => highlight.id === popoverState?.activeHighlightId
  );
  const resolvedPopoverIndex =
    popoverActiveIndex === -1 ? 0 : popoverActiveIndex;

  return (
    <div
      className="relative flex w-full justify-between text-xs md:text-base"
      data-lesson-section={part.id}
      data-section-title={`Part ${part.number}: ${part.name}`}
    >
      <div
        className="relative w-full border border-gray-300 bg-secondary p-4 text-black dark:border-gray-800 dark:bg-primary-dark dark:text-white"
        ref={contentWrapperRef}
      >
        {loading[part.id] ? (
          <div className="flex w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-black dark:text-white">
              {`Part ${part.number}: ${part.name}`}
            </h2>
            <p
              data-section-content
              data-section-id={part.id}
              className="whitespace-pre-wrap leading-relaxed"
            >
              {pieces.length
                ? pieces.map((piece) => renderPiece(piece))
                : content}
            </p>
          </>
        )}

        {popoverState && popoverHighlights.length > 0 && (
          <div
            ref={popoverRef}
            role="dialog"
            tabIndex={-1}
            aria-label="Annotation options"
            className="absolute z-10 w-64 max-w-[90vw] rounded-xl border border-gray-200 bg-white p-3 text-xs shadow-2xl focus:outline-none dark:border-gray-700 dark:bg-secondary-dark"
            style={{
              top: popoverState.position.top,
              left: popoverState.position.left,
              transform: "translate(-50%, 0)",
            }}
            onKeyDown={handlePopoverKeyDown}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                className="rounded-full border border-gray-200 p-1 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleCycle(-1)}
                disabled={popoverHighlights.length < 2}
                aria-label="Previous annotation"
              >
                {"<"}
              </button>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                {popoverHighlights.length > 1
                  ? `Annotation ${resolvedPopoverIndex + 1} of ${
                      popoverHighlights.length
                    }`
                  : "Annotation"}
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 p-1 text-gray-600 transition hover:bg-gray-100 disabled:opacity-30 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleCycle(1)}
                disabled={popoverHighlights.length < 2}
                aria-label="Next annotation"
              >
                {">"}
              </button>
            </div>

            <ul className="mt-2 space-y-1">
              {popoverHighlights.map((highlight) => {
                const isActive =
                  highlight.id === popoverState.activeHighlightId;
                return (
                  <li key={highlight.id}>
                    <button
                      type="button"
                      className={`w-full rounded-lg border px-2 py-1 text-left transition ${
                        isActive
                          ? "border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400/70 dark:bg-blue-500/10 dark:text-blue-50"
                          : "border-transparent text-gray-700 hover:border-blue-200 hover:bg-blue-50/50 dark:text-gray-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/5"
                      }`}
                      onClick={() => handlePopoverSelect(highlight.id)}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {highlight.action}
                      </p>
                      <p className="text-sm leading-snug text-black dark:text-white">
                        {highlight.text}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPart;
