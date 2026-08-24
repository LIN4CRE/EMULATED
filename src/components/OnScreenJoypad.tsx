import React, { useState } from 'react';
import { RefreshCw, Zap, Play, Disc } from 'lucide-react';
import { gamepadService } from '../services/gamepadService';

interface OnScreenJoypadProps {
  onButtonChange: (btn: string, pressed: boolean) => void;
  opacity?: number;
  consoleType?: string;
  isMobileMode?: boolean;
}

export const OnScreenJoypad: React.FC<OnScreenJoypadProps> = ({
  onButtonChange,
  opacity = 0.85,
  consoleType = 'PSX',
  isMobileMode = true
}) => {
  const [activeButtons, setActiveButtons] = useState<Record<string, boolean>>({});

  const handlePress = (key: string) => {
    gamepadService.vibrate(20);
    setActiveButtons(prev => ({ ...prev, [key]: true }));
    onButtonChange(key, true);
  };

  const handleRelease = (key: string) => {
    setActiveButtons(prev => ({ ...prev, [key]: false }));
    onButtonChange(key, false);
  };

  const btnClass = (key: string, baseColor: string) => `
    relative flex items-center justify-center font-bold select-none touch-none transition-all active:scale-90
    shadow-lg rounded-full backdrop-blur-md border border-white/20
    ${activeButtons[key] ? 'scale-90 brightness-150 ring-4 ring-cyan-400/50' : 'hover:brightness-110'}
    ${baseColor}
  `;

  return (
    <div 
      className="w-full flex flex-col justify-between pointer-events-auto p-4 select-none"
      style={{ opacity }}
    >
      {/* Top Shoulder Triggers */}
      <div className="flex justify-between items-center px-4 mb-2">
        <div className="flex gap-2">
          <button
            id="btn-l2"
            onPointerDown={() => handlePress('l2')}
            onPointerUp={() => handleRelease('l2')}
            onPointerLeave={() => handleRelease('l2')}
            className={`${btnClass('l2', 'bg-slate-800/80 text-slate-300')} w-14 h-8 rounded-lg text-xs`}
          >
            L2
          </button>
          <button
            id="btn-l1"
            onPointerDown={() => handlePress('l1')}
            onPointerUp={() => handleRelease('l1')}
            onPointerLeave={() => handleRelease('l1')}
            className={`${btnClass('l1', 'bg-slate-700/90 text-white')} w-16 h-9 rounded-xl text-sm`}
          >
            L1 / L
          </button>
        </div>

        {/* Center Start / Select / Rewind / FastForward */}
        <div className="flex gap-2 items-center bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
          <button
            id="btn-rewind"
            onPointerDown={() => handlePress('rewind')}
            onPointerUp={() => handleRelease('rewind')}
            onPointerLeave={() => handleRelease('rewind')}
            title="Rewind Gameplay"
            className="px-2 py-1 text-xs text-amber-400 font-mono flex items-center gap-1 active:scale-90"
          >
            <RefreshCw className="w-3 h-3" /> REW
          </button>
          <button
            id="btn-select"
            onPointerDown={() => handlePress('select')}
            onPointerUp={() => handleRelease('select')}
            onPointerLeave={() => handleRelease('select')}
            className="px-2.5 py-1 text-xs text-slate-300 font-mono active:scale-90"
          >
            SELECT
          </button>
          <button
            id="btn-start"
            onPointerDown={() => handlePress('start')}
            onPointerUp={() => handleRelease('start')}
            onPointerLeave={() => handleRelease('start')}
            className="px-3 py-1 text-xs text-white font-mono bg-cyan-600/80 rounded-full active:scale-90"
          >
            START
          </button>
          <button
            id="btn-fastforward"
            onPointerDown={() => handlePress('fastForward')}
            onPointerUp={() => handleRelease('fastForward')}
            onPointerLeave={() => handleRelease('fastForward')}
            title="Fast Forward (2x Speed)"
            className="px-2 py-1 text-xs text-emerald-400 font-mono flex items-center gap-1 active:scale-90"
          >
            <Zap className="w-3 h-3" /> 2X
          </button>
        </div>

        <div className="flex gap-2">
          <button
            id="btn-r1"
            onPointerDown={() => handlePress('r1')}
            onPointerUp={() => handleRelease('r1')}
            onPointerLeave={() => handleRelease('r1')}
            className={`${btnClass('r1', 'bg-slate-700/90 text-white')} w-16 h-9 rounded-xl text-sm`}
          >
            R1 / R
          </button>
          <button
            id="btn-r2"
            onPointerDown={() => handlePress('r2')}
            onPointerUp={() => handleRelease('r2')}
            onPointerLeave={() => handleRelease('r2')}
            className={`${btnClass('r2', 'bg-slate-800/80 text-slate-300')} w-14 h-8 rounded-lg text-xs`}
          >
            R2
          </button>
        </div>
      </div>

      {/* Main Controls: D-Pad Left, Action Cluster Right */}
      <div className="flex justify-between items-end px-4 mt-2">
        {/* Tactile D-PAD */}
        <div className="relative w-36 h-36 bg-slate-950/60 rounded-full p-2 border border-slate-700/40 backdrop-blur-md">
          {/* UP */}
          <button
            id="dpad-up"
            onPointerDown={() => handlePress('up')}
            onPointerUp={() => handleRelease('up')}
            onPointerLeave={() => handleRelease('up')}
            className={`absolute top-1 left-1/2 -translate-x-1/2 w-11 h-12 bg-slate-800 text-slate-200 rounded-t-lg flex items-center justify-center font-bold text-lg shadow-inner active:bg-cyan-600 ${activeButtons['up'] ? 'bg-cyan-600 text-white' : ''}`}
          >
            ▲
          </button>
          {/* DOWN */}
          <button
            id="dpad-down"
            onPointerDown={() => handlePress('down')}
            onPointerUp={() => handleRelease('down')}
            onPointerLeave={() => handleRelease('down')}
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-11 h-12 bg-slate-800 text-slate-200 rounded-b-lg flex items-center justify-center font-bold text-lg shadow-inner active:bg-cyan-600 ${activeButtons['down'] ? 'bg-cyan-600 text-white' : ''}`}
          >
            ▼
          </button>
          {/* LEFT */}
          <button
            id="dpad-left"
            onPointerDown={() => handlePress('left')}
            onPointerUp={() => handleRelease('left')}
            onPointerLeave={() => handleRelease('left')}
            className={`absolute left-1 top-1/2 -translate-y-1/2 w-12 h-11 bg-slate-800 text-slate-200 rounded-l-lg flex items-center justify-center font-bold text-lg shadow-inner active:bg-cyan-600 ${activeButtons['left'] ? 'bg-cyan-600 text-white' : ''}`}
          >
            ◀
          </button>
          {/* RIGHT */}
          <button
            id="dpad-right"
            onPointerDown={() => handlePress('right')}
            onPointerUp={() => handleRelease('right')}
            onPointerLeave={() => handleRelease('right')}
            className={`absolute right-1 top-1/2 -translate-y-1/2 w-12 h-11 bg-slate-800 text-slate-200 rounded-r-lg flex items-center justify-center font-bold text-lg shadow-inner active:bg-cyan-600 ${activeButtons['right'] ? 'bg-cyan-600 text-white' : ''}`}
          >
            ▶
          </button>
          {/* Center Cross Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 rounded-full border border-slate-700/50" />
        </div>

        {/* Action Diamond Buttons (A/B/X/Y or Cross/Circle/Square/Triangle) */}
        <div className="relative w-36 h-36 bg-slate-950/60 rounded-full p-2 border border-slate-700/40 backdrop-blur-md">
          {/* Top (Y / Triangle) */}
          <button
            id="btn-y"
            onPointerDown={() => handlePress('btnY')}
            onPointerUp={() => handleRelease('btnY')}
            onPointerLeave={() => handleRelease('btnY')}
            className={`absolute top-1 left-1/2 -translate-x-1/2 w-12 h-12 ${btnClass('btnY', 'bg-emerald-600/90 text-white')} text-base`}
          >
            {consoleType === 'PSX' ? '▲' : 'Y'}
          </button>

          {/* Bottom (A / Cross) */}
          <button
            id="btn-a"
            onPointerDown={() => handlePress('btnA')}
            onPointerUp={() => handleRelease('btnA')}
            onPointerLeave={() => handleRelease('btnA')}
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 ${btnClass('btnA', 'bg-blue-600/90 text-white')} text-base`}
          >
            {consoleType === 'PSX' ? '✕' : 'A'}
          </button>

          {/* Left (X / Square) */}
          <button
            id="btn-x"
            onPointerDown={() => handlePress('btnX')}
            onPointerUp={() => handleRelease('btnX')}
            onPointerLeave={() => handleRelease('btnX')}
            className={`absolute left-1 top-1/2 -translate-y-1/2 w-12 h-12 ${btnClass('btnX', 'bg-pink-600/90 text-white')} text-base`}
          >
            {consoleType === 'PSX' ? '■' : 'X'}
          </button>

          {/* Right (B / Circle) */}
          <button
            id="btn-b"
            onPointerDown={() => handlePress('btnB')}
            onPointerUp={() => handleRelease('btnB')}
            onPointerLeave={() => handleRelease('btnB')}
            className={`absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 ${btnClass('btnB', 'bg-red-600/90 text-white')} text-base`}
          >
            {consoleType === 'PSX' ? '●' : 'B'}
          </button>
        </div>
      </div>
    </div>
  );
};
