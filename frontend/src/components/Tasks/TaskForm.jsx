import { useState } from "react";

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [stage, setStage] = useState(initial?.stage || "todo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), stage });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded px-3 py-2">{error}</div>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <select
        value={stage}
        onChange={(e) => setStage(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : initial ? "Update" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
