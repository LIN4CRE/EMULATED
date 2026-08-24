import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, CheckCircle, Smartphone, Monitor, Tv, Tablet, X, Plus, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaderboardItem } from '../types';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGameTitle?: string;
  currentGameId?: string;
  currentConsole?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentGameTitle = 'Chrono Blade 3D',
  currentGameId = 'chrono-blade-psx',
  currentConsole = 'PSX'
}) => {
  const [selectedConsole, setSelectedConsole] = useState<string>('ALL');
  const [leaderboards, setLeaderboards] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form State
  const [submitUsername, setSubmitUsername] = useState('RetroLegend_X');
  const [submitScore, setSubmitScore] = useState('850000');
  const [submitTime, setSubmitTime] = useState('12:45.30');

  useEffect(() => {
    if (!isOpen) return;
    fetchLeaderboards();
  }, [isOpen, selectedConsole]);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      const url = selectedConsole === 'ALL' 
        ? '/api/leaderboards' 
        : `/api/leaderboards?consoleName=${selectedConsole}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.leaderboards) {
        setLeaderboards(data.leaderboards);
      }
    } catch (e) {
      console.warn("Failed to fetch leaderboards", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/leaderboards/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: currentGameId,
          gameTitle: currentGameTitle,
          consoleName: currentConsole,
          username: submitUsername,
          score: parseInt(submitScore) || 500000,
          timeFormatted: submitTime,
          platform: 'Desktop PC'
        })
      });
      const data = await res.json();
      if (data.entry) {
        setLeaderboards(prev => [data.entry, ...prev]);
        setShowSubmitForm(false);
        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.warn("Error submitting score", e);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform.includes('Phone')) return <Smartphone className="w-3.5 h-3.5 text-cyan-400" />;
    if (platform.includes('Tablet')) return <Tablet className="w-3.5 h-3.5 text-purple-400" />;
    if (platform.includes('TV')) return <Tv className="w-3.5 h-3.5 text-amber-400" />;
    return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Real-Time Global & Social Leaderboards
              </h3>
              <p className="text-xs text-slate-400">Verified Arcade High-Scores & Speedrun Split Times</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Submit Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800">
          {/* Console Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            {['ALL', 'PSX', 'N64', 'GBA', 'SNES', 'NES', 'GENESIS', 'ARCADE'].map(c => (
              <button
                key={c}
                onClick={() => setSelectedConsole(c)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedConsole === c
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Submit High Score
          </button>
        </div>

        {/* Optional Submission Form */}
        {showSubmitForm && (
          <form onSubmit={handleSubmitScore} className="p-4 bg-amber-500/10 border-b border-amber-500/30 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex-1 min-w-[150px]">
              <label className="text-[11px] font-semibold text-amber-300 block mb-1">Gamer Tag</label>
              <input
                type="text"
                value={submitUsername}
                onChange={(e) => setSubmitUsername(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div className="w-32">
              <label className="text-[11px] font-semibold text-amber-300 block mb-1">Score</label>
              <input
                type="number"
                value={submitScore}
                onChange={(e) => setSubmitScore(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div className="w-28">
              <label className="text-[11px] font-semibold text-amber-300 block mb-1">Clear Time</label>
              <input
                type="text"
                value={submitTime}
                onChange={(e) => setSubmitTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all"
            >
              Post Score
            </button>
          </form>
        )}

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {leaderboards.map((item, idx) => {
            const isGold = idx === 0;
            const isSilver = idx === 1;
            const isBronze = idx === 2;

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isGold
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : isSilver
                    ? 'bg-slate-800/80 border-slate-500/40'
                    : isBronze
                    ? 'bg-amber-800/20 border-amber-700/30'
                    : 'bg-slate-800/50 border-slate-700/60'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex items-center justify-center font-mono font-black text-sm">
                    {isGold && <span className="text-yellow-400 text-lg">🥇</span>}
                    {isSilver && <span className="text-slate-300 text-lg">🥈</span>}
                    {isBronze && <span className="text-amber-600 text-lg">🥉</span>}
                    {!isGold && !isSilver && !isBronze && (
                      <span className="text-slate-400">#{idx + 1}</span>
                    )}
                  </div>

                  <img
                    src={item.avatar}
                    alt={item.username}
                    className="w-10 h-10 rounded-full border border-slate-600 object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.username}</span>
                      {item.verified && (
                        <span title="Verified Hardware Replay" className="text-emerald-400 text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-cyan-400 font-semibold">{item.gameTitle}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        {getPlatformIcon(item.platform)} {item.platform}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Speedrun Time */}
                <div className="text-right">
                  <span className="font-mono font-black text-amber-400 text-base sm:text-lg block">
                    {item.score.toLocaleString()} PTS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱️ {item.timeFormatted} • {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
