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

const RichTextEditor = ({
  value = '',
  onChange,
  readOnly = false,
  placeholder = 'Start typing...',
  className = '',
  highlights = [],
  activeHighlightId = null,
  previewHighlightId = null,
  onHighlightClick,
}) => {
  const isInternalUpdate = useRef(false);
  const lastExternalValue = useRef(value);
  const onHighlightClickRef = useRef(onHighlightClick);

  // Keep the ref updated
  useEffect(() => {
    onHighlightClickRef.current = onHighlightClick;
  }, [onHighlightClick]);

  // Stable click handler that uses the ref
  const stableHighlightClick = useCallback((highlightId, rect, event) => {
    onHighlightClickRef.current?.(highlightId, rect, event);
  }, []);

  // Extensions are stable - only depend on readOnly
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

    // Always include HighlightExtension in readOnly mode to keep editor stable
    if (readOnly) {
      baseExtensions.push(
        HighlightExtension.configure({
          highlights: [],
          activeHighlightId: null,
          previewHighlightId: null,
          onHighlightClick: stableHighlightClick,
        })
      );
    }

    return baseExtensions;
  }, [readOnly, stableHighlightClick]);

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

  // Update highlights via transaction when they change (works even with empty array)
  useEffect(() => {
    if (!editor || !readOnly) return;
    updateHighlights(editor, highlights, activeHighlightId, previewHighlightId);
  }, [editor, readOnly, highlights, activeHighlightId, previewHighlightId]);

  // Update click handler in the extension
  useEffect(() => {
    if (!editor || !readOnly) return;
    setHighlightClickHandler(editor, stableHighlightClick);
  }, [editor, readOnly, stableHighlightClick]);

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

