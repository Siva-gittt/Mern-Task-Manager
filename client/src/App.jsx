import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCheck, ClipboardList, ListTodo, RefreshCw } from "lucide-react";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";
import "./App.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyIds, setBusyIds] = useState([]);
  const [error, setError] = useState("");

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        payload.message || "Something went wrong. Please try again.",
      );
    return payload;
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await request("/tasks");
      setTasks(data);
    } catch (err) {
      setError(`${err.message} Make sure the backend and MongoDB are running.`);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      }),
    [tasks, filter],
  );

  async function addTask(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    setError("");
    try {
      const created = await request("/tasks", {
        method: "POST",
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      setTasks((current) => [created, ...current]);
      setNewTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateTask(id, changes) {
    setBusyIds((ids) => [...ids, id]);
    setError("");
    try {
      const updated = await request(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
      });
      setTasks((current) =>
        current.map((task) => (task._id === id ? updated : task)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyIds((ids) => ids.filter((busyId) => busyId !== id));
    }
  }

  async function toggleTask(task) {
    await updateTask(task._id, { completed: !task.completed });
  }

  async function deleteTask(id) {
    setBusyIds((ids) => [...ids, id]);
    setError("");
    try {
      await request(`/tasks/${id}`, { method: "DELETE" });
      setTasks((current) => current.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyIds((ids) => ids.filter((busyId) => busyId !== id));
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Task Manager home">
          <span className="brand-mark">
            <CheckCheck size={21} />
          </span>
          <span>Task Manager</span>
        </a>
      </header>

      <section className="workspace" aria-label="Task manager">
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon purple">
              <ListTodo size={19} />
            </span>
            <div>
              <strong>{tasks.length}</strong>
              <span>Total tasks</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon orange">
              <ClipboardList size={19} />
            </span>
            <div>
              <strong>{pendingCount}</strong>
              <span>To do</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon green">
              <CheckCheck size={19} />
            </span>
            <div>
              <strong>{completedCount}</strong>
              <span>Completed</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your tasks</h2>
              <p>A small step is still progress.</p>
            </div>
            <button
              className="refresh-button"
              onClick={loadTasks}
              title="Refresh tasks"
              aria-label="Refresh tasks"
              disabled={loading}
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <TaskForm
            value={newTitle}
            onChange={setNewTitle}
            onSubmit={addTask}
            saving={saving}
          />

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          <div className="filter-tabs" role="tablist" aria-label="Filter tasks">
            {[
              ["all", "All tasks"],
              ["active", "To do"],
              ["completed", "Completed"],
            ].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={filter === key}
                className={filter === key ? "active" : ""}
                onClick={() => setFilter(key)}
              >
                {label}
                <span>
                  {key === "all"
                    ? tasks.length
                    : key === "active"
                      ? pendingCount
                      : completedCount}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loader" />
              <p>Loading your tasks…</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <ClipboardList size={25} />
              </div>
              <h3>
                {filter === "completed"
                  ? "Nothing completed yet"
                  : filter === "active"
                    ? "You’re all caught up"
                    : "Start with one small thing"}
              </h3>
              <p>
                {filter === "all"
                  ? "Add a task above and it will show up here."
                  : "Try another filter or add a new task above."}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {visibleTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  busy={busyIds.includes(task._id)}
                />
              ))}
            </ul>
          )}
          <div className="panel-footer">
            <span>
              <span className="footer-dot" /> Saved to your database
            </span>
            <span>
              {completedCount} of {tasks.length} done
            </span>
          </div>
        </div>
        <p className="tip">
          <strong>Tip:</strong> Click the circle to complete a task. Use the
          pencil to edit it.
        </p>
      </section>
    </main>
  );
}
