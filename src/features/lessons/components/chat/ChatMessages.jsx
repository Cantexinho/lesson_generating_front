import React from "react";
import RichTextEditor from "../RichTextEditor";

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
                <p className="whitespace-pre-wrap">{message.text}</p>
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
              <div className="chat-bot-message w-full py-3 text-sm leading-relaxed text-black dark:text-white">
                <RichTextEditor
                  value={message.text || ""}
                  readOnly
                  className="chat-message-editor"
                />
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


