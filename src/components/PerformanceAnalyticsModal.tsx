import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, Clock, ShieldCheck, Trophy, Sparkles, X } from 'lucide-react';
import { PerformanceMetrics, UserProfile } from '../types';

interface PerformanceAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const PerformanceAnalyticsModal: React.FC<PerformanceAnalyticsModalProps> = ({
  isOpen,
  onClose,
  userProfile
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    targetFps: 60,
    frameTimeMs: 16.6,
    audioLatencyMs: 8.4,
    memoryMb: 42.5,
    cpuLoadPct: 14,
    inputLagMs: 4.2,
    droppedFrames: 0,
    resolution: '640 x 480 (4:3 Classic)'
  });

  // Jitter simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setMetrics({
        fps: Math.floor(Math.random() * 2) + 59,
        targetFps: 60,
        frameTimeMs: parseFloat((16.4 + (Math.random() * 0.4 - 0.2)).toFixed(2)),
        audioLatencyMs: parseFloat((7.8 + Math.random() * 0.8).toFixed(1)),
        memoryMb: parseFloat((41.8 + Math.random() * 1.5).toFixed(1)),
        cpuLoadPct: Math.floor(Math.random() * 6) + 12,
        inputLagMs: parseFloat((3.8 + Math.random() * 0.6).toFixed(1)),
        droppedFrames: 0,
        resolution: '640 x 480 (Pixel-Perfect 60Hz)'
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const consolePlaytimes = [
    { name: 'PlayStation 1 (PSX)', hours: 28.5, pct: 36, color: 'bg-blue-500' },
    { name: 'Nintendo 64 (N64)', hours: 21.2, pct: 27, color: 'bg-emerald-500' },
    { name: 'Game Boy Advance (GBA)', hours: 16.8, pct: 21, color: 'bg-purple-500' },
    { name: 'Super Nintendo (SNES)', hours: 8.4, pct: 11, color: 'bg-rose-500' },
    { name: 'Arcade / NeoGeo', hours: 4.1, pct: 5, color: 'bg-amber-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Performance Analytics & Telemetry Engine
              </h3>
              <p className="text-xs text-slate-400">Real-time hardware pipeline metrics and user playtime analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Telemetry Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Real-Time Emulation Pipeline Telemetry
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* FPS */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" /> Frame Rate
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400 mt-1">
                  {metrics.fps} <span className="text-xs font-normal text-slate-400">FPS</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Target: 60Hz Lock</span>
              </div>

              {/* Frame Time */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Frame Time
                </span>
                <span className="text-2xl font-black font-mono text-cyan-400 mt-1">
                  {metrics.frameTimeMs} <span className="text-xs font-normal text-slate-400">ms</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">0.02ms Jitter</span>
              </div>

              {/* Input Lag */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Input Latency
                </span>
                <span className="text-2xl font-black font-mono text-purple-400 mt-1">
                  {metrics.inputLagMs} <span className="text-xs font-normal text-slate-400">ms</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Gamepad Direct Polling</span>
              </div>

              {/* Audio Latency */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-amber-400" /> Audio Buffer
                </span>
                <span className="text-2xl font-black font-mono text-amber-400 mt-1">
                  {metrics.audioLatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Web Audio PSG Core</span>
              </div>
            </div>
          </div>

          {/* Historical Playtime by Console */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                📊 Playtime Distribution by Console Platform
              </h4>
              <span className="text-xs text-slate-400 font-mono">Total: {(userProfile.totalPlaytimeMinutes / 60).toFixed(1)} Hours</span>
            </div>

            <div className="space-y-2.5">
              {consolePlaytimes.map(c => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{c.name}</span>
                    <span className="text-slate-400 font-mono">{c.hours} hrs ({c.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player Lifetime Achievements & Hardware Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                🏆
              </div>
              <div>
                <span className="text-lg font-black text-white block">{userProfile.trophiesCount}</span>
                <span className="text-[11px] text-slate-400">Trophies Unlocked</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                ☁️
              </div>
              <div>
                <span className="text-lg font-black text-white block">{userProfile.cloudSavesCount}</span>
                <span className="text-[11px] text-slate-400">Cloud Saves Backed Up</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                ⭐
              </div>
              <div>
                <span className="text-lg font-black text-white block">Level {userProfile.level}</span>
                <span className="text-[11px] text-slate-400">{userProfile.xp.toLocaleString()} XP Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
