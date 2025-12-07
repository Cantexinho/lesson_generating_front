import React, { useMemo } from "react";

const INLINE_TOKEN_REGEX = /(\*\*[^*]+\*\*|`[^`]+`)/g;

const renderInlineSegments = (text) => {
  if (!text) {
    return null;
  }
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = INLINE_TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      segments.push(
        <strong key={`strong-${match.index}`} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      segments.push(
        <code
          key={`code-${match.index}`}
          className="rounded border border-gray-400 bg-gray-300 px-1 font-mono text-[13px] text-gray-900 dark:border-gray-500/70 dark:bg-gray-700 dark:text-gray-100"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      segments.push(token);
    }
    lastIndex = INLINE_TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments.map((segment, index) =>
    typeof segment === "string" ? (
      <span key={`text-${index}`}>{segment}</span>
    ) : (
      React.cloneElement(segment, { key: `${segment.key}-${index}` })
    )
  );
};

const parseMessageBlocks = (text = "") => {
  const lines = text.split("\n");
  const blocks = [];
  let currentParagraph = [];
  let currentList = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines = [];

  const flushParagraph = () => {
    if (!currentParagraph.length) {
      return;
    }
    blocks.push({
      type: "paragraph",
      content: currentParagraph.join(" ").trim(),
    });
    currentParagraph = [];
  };

  const flushList = () => {
    if (!currentList.length) {
      return;
    }
    blocks.push({
      type: "list",
      items: currentList.slice(),
    });
    currentList = [];
  };

  const flushCode = () => {
    blocks.push({
      type: "code",
      language: codeLanguage,
      content: codeLines.join("\n"),
    });
    codeLanguage = "";
    codeLines = [];
  };

  lines.forEach((line) => {
    const codeFenceMatch = line.match(/^```(\w+)?/);
    if (codeFenceMatch) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
        codeLanguage = codeFenceMatch[1] || "";
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.trim().startsWith("- ")) {
      flushParagraph();
      currentList.push(line.trim().slice(2));
      return;
    }

    currentParagraph.push(line.trim());
  });

  if (inCodeBlock) {
    flushCode();
  } else {
    flushParagraph();
    flushList();
  }

  return blocks;
};

const FormattedMessage = ({ text }) => {
  const blocks = useMemo(() => parseMessageBlocks(text), [text]);

  if (!blocks.length) {
    return <p className="leading-relaxed">{text}</p>;
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre
              key={`code-${index}`}
              className="overflow-x-auto rounded-xl border border-gray-300 bg-gray-900/90 px-4 py-3 text-sm text-white shadow-inner dark:border-gray-600/80 dark:bg-black/60"
            >
              <code className="font-mono">
                {block.content || ""}
              </code>
            </pre>
          );
        }
        if (block.type === "list") {
          return (
            <ul
              key={`list-${index}`}
              className="list-disc space-y-1 pl-5 text-sm leading-relaxed"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`list-item-${itemIndex}`}>
                  {renderInlineSegments(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={`paragraph-${index}`}
            className="text-sm leading-relaxed text-black dark:text-white"
          >
            {renderInlineSegments(block.content)}
          </p>
        );
      })}
    </div>
  );
};

const ChatMessages = ({ hasActiveThread, messages = [] }) => {
  if (!hasActiveThread) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Select lesson content to pin a highlight and begin chatting.
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No messages yet. Use the input below to ask a question.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div key={message.id} className="flex justify-center">
            {isUser ? (
              <div className="w-full rounded-xl border border-gray-300 bg-primary px-4 py-3 text-sm leading-relaxed text-black shadow dark:border-gray-700 dark:bg-secondary-dark dark:text-white">
                <FormattedMessage text={message.text} />
                {message.meta?.action && (
                  <p className="mt-2 text-xs opacity-80">
                    action:{" "}
                    <span className="font-semibold uppercase">
                      {message.meta.action}
                    </span>
                    {message.meta.section_id && (
                      <> · section #{message.meta.section_id}</>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full py-3 text-sm leading-relaxed text-black dark:text-white">
                <FormattedMessage text={message.text} />
                {message.meta?.action && (
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                    action:{" "}
                    <span className="font-semibold uppercase">
                      {message.meta.action}
                    </span>
                    {message.meta.section_id && (
                      <> · section #{message.meta.section_id}</>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;


