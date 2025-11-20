import React from "react";

const SelectionActions = ({ visible, position, actions, onAction }) => {
  if (!visible || !position) {
    return null;
  }

  return (
    <div
      className="pointer-events-auto fixed z-40"
      style={{
        top: position.top,
        left: position.left,
        transform: "translate(-50%, -120%)",
      }}
    >
      <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-2 py-1 text-xs font-medium text-gray-800 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-100">
        {actions.map((action) => (
          <button
            key={action.id}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onAction(action.id)}
            className="rounded-full px-3 py-1 transition hover:bg-blue-600 hover:text-white"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectionActions;

