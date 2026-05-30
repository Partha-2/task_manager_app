import { useState } from "react";
import TaskForm from "./TaskForm";

const STAGE_COLORS = {
  todo: "border-l-yellow-400",
  in_progress: "border-l-blue-400",
  done: "border-l-green-400",
};

const STAGE_LABELS = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  const handleUpdate = async (data) => {
    await onUpdate(task.id, data);
    setEditing(false);
  };

  const handleMove = async (newStage) => {
    await onUpdate(task.id, { stage: newStage });
  };

  if (editing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <TaskForm
          initial={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${STAGE_COLORS[task.stage]} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors px-1"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          task.stage === "todo" ? "bg-yellow-100 text-yellow-700" :
          task.stage === "in_progress" ? "bg-blue-100 text-blue-700" :
          "bg-green-100 text-green-700"
        }`}>
          {STAGE_LABELS[task.stage]}
        </span>
        <div className="flex gap-1 ml-auto">
          {task.stage !== "todo" && (
            <button
              onClick={() => handleMove("todo")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              title="Move to Todo"
            >
              ←
            </button>
          )}
          {task.stage === "todo" && (
            <button
              onClick={() => handleMove("in_progress")}
              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
              title="Move to In Progress"
            >
              →
            </button>
          )}
          {task.stage === "in_progress" && (
            <button
              onClick={() => handleMove("done")}
              className="text-xs text-gray-400 hover:text-green-600 transition-colors"
              title="Move to Done"
            >
              ✓
            </button>
          )}
          {task.stage === "done" && (
            <button
              onClick={() => handleMove("in_progress")}
              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
              title="Move back to In Progress"
            >
              ←
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
