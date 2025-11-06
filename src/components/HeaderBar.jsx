import React from 'react';
import { CheckSquare, Target, Clock, User } from 'lucide-react';

export default function HeaderBar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight">FocusFlow</h1>
            <p className="text-xs text-slate-500 -mt-0.5">Tasks • Goals • Deep Work</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <div className="hidden sm:flex items-center gap-4 mr-4">
            <span className="inline-flex items-center gap-1 text-sm"><CheckSquare className="h-4 w-4" /> Tasks</span>
            <span className="inline-flex items-center gap-1 text-sm"><Target className="h-4 w-4" /> Goals</span>
            <span className="inline-flex items-center gap-1 text-sm"><Clock className="h-4 w-4" /> Timer</span>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="text-sm text-slate-500">Welcome</div>
          )}
        </div>
      </div>
    </header>
  );
}
