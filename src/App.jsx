import React, { useEffect, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import AuthPanel from './components/AuthPanel';
import TaskManager from './components/TaskManager';
import GoalsAndTimer from './components/GoalsAndTimer';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore auth from localStorage
    const raw = localStorage.getItem('ff_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  const handleAuth = (data) => {
    setUser(data);
    localStorage.setItem('ff_user', JSON.stringify(data));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ff_user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-slate-900">
      <HeaderBar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {!user ? (
          <div className="text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight">Stay organized and study with intention</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Create tasks, set clear study goals with time estimates, and focus with a built-in timer that plays a sound when time is up.</p>
            </div>
            <AuthPanel onAuth={handleAuth} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <TaskManager user={user} />
            <GoalsAndTimer user={user} />
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built for deep work. Stay focused and keep improving.
      </footer>
    </div>
  );
}
