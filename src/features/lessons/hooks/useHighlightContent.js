import { useMemo } from "react";
import {
  buildContentPieces,
  normalizeHighlights,
} from "../utils/highlightUtils";

const useHighlightContent = (content, highlights) => {
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

  return {
    normalizedHighlights,
    highlightLookup,
    pieces,
    anchorsByOffset,
  };
};

export default useHighlightContent;
