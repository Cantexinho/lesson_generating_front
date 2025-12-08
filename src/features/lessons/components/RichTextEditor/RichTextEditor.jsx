import React, { useEffect, useRef } from 'react';
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
import { normalizeMarkdown, postProcessMarkdown } from './markdownConverter';
import './richTextEditor.css';

const RichTextEditor = ({
  value = '',
  onChange,
  readOnly = false,
  placeholder = 'Start typing...',
  className = '',
}) => {
  const isInternalUpdate = useRef(false);
  const lastExternalValue = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disable headings to keep content flat
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
    ],
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
      
      // Reset flag after a tick
      requestAnimationFrame(() => {
        isInternalUpdate.current = false;
      });
    },
  });

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

