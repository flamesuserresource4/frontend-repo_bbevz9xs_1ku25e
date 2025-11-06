import React, { useState } from 'react';

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(`${backend}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'signup' ? { name, email, password } : { email, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Authentication failed');
      onAuth(data);
      setEmail('');
      setName('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-6">
      <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === 'login' ? 'bg-white shadow' : ''}`}
          onClick={() => setMode('login')}
        >
          Log in
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium ${mode === 'signup' ? 'bg-white shadow' : ''}`}
          onClick={() => setMode('signup')}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
