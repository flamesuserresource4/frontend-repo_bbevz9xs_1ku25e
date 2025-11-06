import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import TaskManager from './components/TaskManager';
import GoalsAndTimer from './components/GoalsAndTimer';

export default function App() {
  // Auth disabled: use a temporary local user session
  const [user] = useState({ id: 'demo-user', name: 'Guest' });

  const handleLogout = () => {
    // Auth is disabled for now; no action on logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 text-slate-900">
      <HeaderBar user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <TaskManager user={user} />
          <GoalsAndTimer user={user} />
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built for deep work. Stay focused and keep improving.
      </footer>
    </div>
  );
}
