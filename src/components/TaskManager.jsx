import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';

export default function TaskManager({ user }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${backend}/tasks?user_id=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to load tasks');
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${backend}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, title: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to add task');
      setInput('');
      fetchTasks();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const toggleDone = async (id, done) => {
    try {
      const res = await fetch(`${backend}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !done } : x)));
    } catch (e) {
      setError(e.message);
    }
  };

  const removeTask = async (id) => {
    try {
      const res = await fetch(`${backend}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setTasks((t) => t.filter((x) => x.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <section className="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold tracking-tight flex items-center gap-2"><CheckSquare className="h-5 w-5"/>Tasks</h2>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={addTask}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          <Plus className="h-4 w-4"/> Add
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <ul className="space-y-2">
        {loading && tasks.length === 0 ? (
          <li className="text-sm text-slate-500">Loading…</li>
        ) : tasks.length === 0 ? (
          <li className="text-sm text-slate-500">No tasks yet. Add your first task above.</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-white">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id, task.done)} />
                <span className={task.done ? 'line-through text-slate-400' : ''}>{task.title}</span>
              </div>
              <button className="text-slate-500 hover:text-red-600" onClick={() => removeTask(task.id)}>
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
