import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

const COLUMNS = [
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function TaskBoard() {
  const { authFetch } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const data = await authFetch("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [authFetch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (data) => {
    await authFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setShowForm(false);
    await loadTasks();
  };

  const updateTask = async (id, data) => {
    await authFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    await loadTasks();
  };

  const deleteTask = async (id) => {
    await authFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
    await loadTasks();
  };

  const grouped = {
    todo: tasks.filter((t) => t.stage === "todo"),
    in_progress: tasks.filter((t) => t.stage === "in_progress"),
    done: tasks.filter((t) => t.stage === "done"),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded px-3 py-2 mb-4">{error}</div>
      )}

      {showForm && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <TaskForm onSubmit={addTask} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.key}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {col.label} ({grouped[col.key].length})
            </h3>
            <div className="space-y-3">
              {grouped[col.key].length === 0 ? (
                <p className="text-sm text-gray-400 italic">No tasks yet</p>
              ) : (
                grouped[col.key].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
