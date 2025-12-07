import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Spinner from "./Spinner";
import useHighlightContent from "../hooks/useHighlightContent";
import HighlightSegments from "./HighlightSegments";
import HighlightPopover from "./HighlightPopover";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeHighlight];
const markdownComponents = {
  code({ inline, className, children }) {
    if (inline) {
      return (
        <code className="rounded bg-slate-100 px-1 py-0.5 text-[0.95em] text-slate-900 dark:bg-slate-900 dark:text-slate-100">
          {children}
        </code>
      );
    }
    return (
      <pre className="mb-4 mt-2 overflow-auto rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <code className={className}>{children}</code>
      </pre>
    );
  },
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

  const { pieces, anchorsByOffset, highlightLookup } = useHighlightContent(
    content,
    highlights
  );
  const hasHighlights = Array.isArray(highlights) && highlights.length > 0;

  const popoverHighlights = useMemo(() => {
    if (!popoverState) {
      return [];
    }
    return popoverState.highlightIds
      .map((id) => highlightLookup[id])
      .filter(Boolean);
  }, [popoverState, highlightLookup]);

  const computePopoverMetrics = useCallback((rect, highlightCount) => {
    const viewportWidth =
      typeof window !== "undefined"
        ? window.innerWidth || document.documentElement.clientWidth || 0
        : 0;
    const viewportHeight =
      typeof window !== "undefined"
        ? window.innerHeight || document.documentElement.clientHeight || 0
        : 0;
    const baseHeight =
      highlightCount > 4
        ? 320
        : Math.max(120, highlightCount * 64 + 40);
    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = viewportWidth
      ? clamp(rawLeft, 24, viewportWidth - 24)
      : rawLeft;
    const desiredTop = rect.bottom + 8;
    const top =
      viewportHeight && desiredTop + baseHeight > viewportHeight - 16
        ? Math.max(16, rect.top - 8 - baseHeight)
        : desiredTop;
    return {
      top,
      left: clampedLeft,
      height: baseHeight,
      isScrollable: highlightCount > 4,
    };
  }, []);

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

  useEffect(() => {
    if (
      !popoverState?.targetElement ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
      return undefined;
    }

    const reposition = () => {
      setPopoverState((prev) => {
        if (!prev?.targetElement) {
          return prev;
        }
        const rect = prev.targetElement.getBoundingClientRect();
        const metrics = computePopoverMetrics(
          rect,
          prev.highlightIds.length
        );
        return {
          ...prev,
          position: {
            top: metrics.top,
            left: metrics.left,
          },
          popoverHeight: metrics.height,
          isScrollable: metrics.isScrollable,
        };
      });
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [popoverState, computePopoverMetrics]);

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

      const targetRect = event.currentTarget.getBoundingClientRect();

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

      const metrics = computePopoverMetrics(
        targetRect,
        validHighlightIds.length
      );

      setPopoverState({
        blockKey: segment.blockId,
        highlightIds: validHighlightIds,
        activeHighlightId: initialHighlightId,
        position: {
          top: metrics.top,
          left: metrics.left,
        },
        popoverHeight: metrics.height,
        isScrollable: metrics.isScrollable,
        targetElement: event.currentTarget,
      });
    },
    [
      activeHighlightId,
      highlightLookup,
      onHighlightSelect,
      computePopoverMetrics,
    ]
  );

  return (
    <div
      className="relative flex w-full justify-between text-xs md:text-base"
      data-lesson-section={part.id}
      data-section-title={part.name}
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
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {part.name}
              </h2>
              <div className="mt-1 h-px w-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div
              data-section-content
              data-section-id={part.id}
              className="whitespace-pre-wrap leading-relaxed"
            >
              {hasHighlights ? (
                <HighlightSegments
                  pieces={pieces}
                  anchorsByOffset={anchorsByOffset}
                  highlightLookup={highlightLookup}
                  activeHighlightId={activeHighlightId}
                  previewHighlightId={previewHighlightId}
                  onSegmentActivate={handleSegmentActivate}
                />
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={remarkPlugins}
                    rehypePlugins={rehypePlugins}
                    components={markdownComponents}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </>
        )}

      </div>
      <HighlightPopover
        popoverState={popoverState}
        popoverHighlights={popoverHighlights}
        handleCycle={handleCycle}
        handlePopoverSelect={handlePopoverSelect}
        handlePopoverKeyDown={handlePopoverKeyDown}
        popoverRef={popoverRef}
      />
    </div>
  );
};

export default LessonPart;
