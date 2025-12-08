import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faQuoteLeft,
  faMinus,
  faListUl,
  faListOl,
  faListCheck,
  faTable,
  faLink,
  faLinkSlash,
} from '@fortawesome/free-solid-svg-icons';

const ToolbarButton = ({ onClick, isActive, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'bg-transparent text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
    } disabled:cursor-not-allowed disabled:opacity-40`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
);

const RichTextToolbar = ({ editor }) => {
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl || 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-300 bg-gray-100 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-800">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <FontAwesomeIcon icon={faBold} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <FontAwesomeIcon icon={faItalic} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <FontAwesomeIcon icon={faStrikethrough} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        title="Inline Code"
      >
        <FontAwesomeIcon icon={faCode} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Quote"
      >
        <FontAwesomeIcon icon={faQuoteLeft} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <span className="font-mono text-xs font-bold">{'{}'}</span>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <FontAwesomeIcon icon={faMinus} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <FontAwesomeIcon icon={faListUl} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <FontAwesomeIcon icon={faListOl} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        title="Task List"
      >
        <FontAwesomeIcon icon={faListCheck} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Table & Link */}
      <ToolbarButton
        onClick={insertTable}
        isActive={editor.isActive('table')}
        title="Insert Table"
      >
        <FontAwesomeIcon icon={faTable} className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        title="Insert/Edit Link"
      >
        <FontAwesomeIcon icon={faLink} className="h-3.5 w-3.5" />
      </ToolbarButton>

      {editor.isActive('link') && (
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
        >
          <FontAwesomeIcon icon={faLinkSlash} className="h-3.5 w-3.5" />
        </ToolbarButton>
      )}
    </div>
  );
};

export default RichTextToolbar;

