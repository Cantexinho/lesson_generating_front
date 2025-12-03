import React from "react";
import {
  getHighlightClasses,
  UNION_UNDERLINE_STYLE,
} from "../utils/highlightUtils";

const HighlightSegments = ({
  pieces = [],
  anchorsByOffset = {},
  highlightLookup = {},
  activeHighlightId,
  previewHighlightId,
  onSegmentActivate,
}) => {
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
          onClick: (event) => onSegmentActivate?.(segment, block, event),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSegmentActivate?.(segment, block, event);
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
    const showBadge = actionCount > 1;

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
        className={`group relative inline ${
          shouldShowUnderline ? "idle-underline" : ""
        }`}
        style={shouldShowUnderline ? UNION_UNDERLINE_STYLE : undefined}
      >
        {showBadge && (
          <span
            className="pointer-events-none absolute -top-3 left-0 rounded-full bg-slate-900 px-1 text-[9px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-200 dark:text-slate-900"
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

  if (!pieces.length) {
    return null;
  }

  return pieces.map((piece) => renderPiece(piece));
};

export default HighlightSegments;


