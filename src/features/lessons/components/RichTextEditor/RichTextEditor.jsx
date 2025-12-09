import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Markdown } from 'tiptap-markdown';
import RichTextToolbar from './RichTextToolbar';
import HighlightExtension, { updateHighlights, setHighlightClickHandler } from './highlightExtension';
import { normalizeMarkdown, postProcessMarkdown } from './markdownConverter';
import './richTextEditor.css';

// Stable empty array to prevent unnecessary re-renders
const EMPTY_HIGHLIGHTS = [];

const RichTextEditor = ({
  value = '',
  onChange,
  readOnly = false,
  placeholder = 'Start typing...',
  className = '',
  highlights,
  activeHighlightId = null,
  previewHighlightId = null,
  onHighlightClick,
}) => {
  const isInternalUpdate = useRef(false);
  const lastExternalValue = useRef(value);
  const onHighlightClickRef = useRef(onHighlightClick);

  // Use stable empty array if highlights not provided
  const stableHighlights = highlights || EMPTY_HIGHLIGHTS;
  const hasHighlightSupport = Boolean(onHighlightClick);

  // Keep the ref updated
  useEffect(() => {
    onHighlightClickRef.current = onHighlightClick;
  }, [onHighlightClick]);

  // Stable click handler that uses the ref
  const stableHighlightClick = useCallback((highlightId, rect, event) => {
    onHighlightClickRef.current?.(highlightId, rect, event);
  }, []);

  // Extensions are stable - only depend on readOnly and whether highlight support is needed
  const extensions = useMemo(() => {
    const baseExtensions = [
      StarterKit.configure({
        heading: false,
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ];

    // Only include HighlightExtension when highlight support is needed
    if (readOnly && hasHighlightSupport) {
      baseExtensions.push(
        HighlightExtension.configure({
          highlights: EMPTY_HIGHLIGHTS,
          activeHighlightId: null,
          previewHighlightId: null,
          onHighlightClick: stableHighlightClick,
        })
      );
    }

    return baseExtensions;
  }, [readOnly, hasHighlightSupport, stableHighlightClick]);

  const editor = useEditor({
    extensions,
    content: normalizeMarkdown(value),
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      if (!onChange) return;
      
      isInternalUpdate.current = true;
      const markdown = editor.storage.markdown.getMarkdown();
      const processed = postProcessMarkdown(markdown);
      onChange(processed);
      
      requestAnimationFrame(() => {
        isInternalUpdate.current = false;
      });
    },
  }, [extensions]);

  // Update highlights via transaction when they change
  // Only run when highlight support is enabled and there are actual highlights
  useEffect(() => {
    if (!editor || !readOnly || !hasHighlightSupport) return;
    if (stableHighlights.length === 0 && !activeHighlightId && !previewHighlightId) return;
    updateHighlights(editor, stableHighlights, activeHighlightId, previewHighlightId);
  }, [editor, readOnly, hasHighlightSupport, stableHighlights, activeHighlightId, previewHighlightId]);

  // Update click handler in the extension
  useEffect(() => {
    if (!editor || !readOnly || !hasHighlightSupport) return;
    setHighlightClickHandler(editor, stableHighlightClick);
  }, [editor, readOnly, hasHighlightSupport, stableHighlightClick]);

  // Sync external value changes (e.g., cancel restoring original content)
  useEffect(() => {
    if (!editor) return;
    if (isInternalUpdate.current) return;
    
    // Only update if external value actually changed
    if (value === lastExternalValue.current) return;
    lastExternalValue.current = value;

    const currentMarkdown = postProcessMarkdown(
      editor.storage.markdown.getMarkdown()
    );
    const normalizedValue = postProcessMarkdown(normalizeMarkdown(value));

    // Avoid unnecessary updates that would reset cursor
    if (currentMarkdown !== normalizedValue) {
      editor.commands.setContent(normalizeMarkdown(value), false);
    }
  }, [value, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Update placeholder
  useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: 'prose prose-sm max-w-none focus:outline-none',
            'data-placeholder': placeholder,
          },
        },
      });
    }
  }, [editor, placeholder]);

  if (!editor) {
    return null;
  }

  const wrapperClass = readOnly
    ? `rich-text-editor rich-text-editor--readonly ${className}`
    : `rich-text-editor ${className}`;

  return (
    <div className={wrapperClass}>
      {!readOnly && <RichTextToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

