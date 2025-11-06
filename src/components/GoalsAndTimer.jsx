import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Target, Clock3, Volume2 } from 'lucide-react';

export default function GoalsAndTimer({ user }) {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(25);
  const [activeGoalId, setActiveGoalId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`${backend}/goals?user_id=${encodeURIComponent(user.id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to load goals');
      setGoals(data);
    } catch (e) {
      setError(e.message);
    }
  };

  const addGoal = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${backend}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, title: title.trim(), minutes: Number(minutes) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to add goal');
      setTitle('');
      fetchGoals();
    } catch (e) {
      setError(e.message);
    }
  };

  const startTimer = (goalId, secs) => {
    clearInterval(intervalRef.current);
    setActiveGoalId(goalId);
    setTimeLeft(secs);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            if (playPromise) playPromise.catch(() => {});
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const format = useMemo(() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = Math.floor(timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [timeLeft]);

  useEffect(() => {
    if (user) fetchGoals();
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <section className="bg-white/80 backdrop-blur rounded-2xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold tracking-tight flex items-center gap-2"><Target className="h-5 w-5"/>Goals & Timer</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Add a goal…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={addGoal} className="rounded-md bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-500">Add Goal</button>
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <ul className="space-y-2 mb-6">
        {goals.length === 0 ? (
          <li className="text-sm text-slate-500">No goals yet. Create one above.</li>
        ) : (
          goals.map((g) => (
            <li key={g.id} className="flex items-center justify-between rounded-lg border px-3 py-2 bg-white">
              <div>
                <p className="font-medium">{g.title}</p>
                <p className="text-xs text-slate-500">Estimation: {g.minutes} min</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startTimer(g.id, g.minutes * 60)}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 bg-slate-50 hover:bg-slate-100"
                >
                  <Clock3 className="h-4 w-4"/> Start
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="rounded-xl border bg-gradient-to-br from-slate-50 to-white p-6 text-center">
        <div className="text-5xl font-bold tracking-tight tabular-nums">{format}</div>
        <p className="text-sm text-slate-500 mt-1">{running ? 'Timer running…' : 'Ready'}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => startTimer(activeGoalId ?? 'custom', (Number(minutes) || 1) * 60)}
            className="rounded-md bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
          >
            Start Timer
          </button>
          <button onClick={stopTimer} className="rounded-md border px-4 py-2 bg-white hover:bg-slate-50">Stop</button>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0; audioRef.current.play().catch(()=>{});
              }
            }}
            className="rounded-md border px-4 py-2 bg-white hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4"/> Test Sound
          </button>
        </div>
      </div>

      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_9b85b2c5c7.mp3?filename=notification-113724.mp3" preload="auto" />
    </section>
  );
}
