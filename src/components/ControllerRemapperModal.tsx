import React, { useState, useEffect } from 'react';
import { Gamepad, Sliders, RotateCcw, Volume2, Check, X, Disc, Shield } from 'lucide-react';
import { GamepadMapping } from '../types';
import { gamepadService, DEFAULT_KEYBOARD_MAPPING } from '../services/gamepadService';

interface ControllerRemapperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControllerRemapperModal: React.FC<ControllerRemapperModalProps> = ({
  isOpen,
  onClose
}) => {
  const [mapping, setMapping] = useState<GamepadMapping>(gamepadService.getMapping());
  const [listeningKey, setListeningKey] = useState<keyof GamepadMapping | null>(null);
  const [activeInputs, setActiveInputs] = useState<Record<string, boolean>>({});
  const [gamepadName, setGamepadName] = useState<string>(gamepadService.getGamepadName());
  const [rumbleIntensity, setRumbleIntensity] = useState<number>(0.7);

  // Poll controller in real-time to highlight active buttons
  useEffect(() => {
    if (!isOpen) return;

    let animId: number;
    const poll = () => {
      const live = gamepadService.pollButtons();
      setActiveInputs(live);
      setGamepadName(gamepadService.getGamepadName());
      animId = requestAnimationFrame(poll);
    };
    animId = requestAnimationFrame(poll);

    return () => cancelAnimationFrame(animId);
  }, [isOpen]);

  // Key listening for remap
  useEffect(() => {
    if (!listeningKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const updated = { ...mapping, [listeningKey]: e.code };
      setMapping(updated);
      gamepadService.updateMapping(updated);
      setListeningKey(null);
      gamepadService.vibrate(30);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listeningKey, mapping]);

  if (!isOpen) return null;

  const handleTestRumble = () => {
    gamepadService.vibrate(250, rumbleIntensity, rumbleIntensity);
  };

  const handleReset = () => {
    setMapping({ ...DEFAULT_KEYBOARD_MAPPING });
    gamepadService.updateMapping(DEFAULT_KEYBOARD_MAPPING);
  };

  const keyLabels: { key: keyof GamepadMapping; label: string; desc: string }[] = [
    { key: 'dpadUp', label: 'D-Pad Up', desc: 'Navigate / Aim Up' },
    { key: 'dpadDown', label: 'D-Pad Down', desc: 'Navigate / Duck' },
    { key: 'dpadLeft', label: 'D-Pad Left', desc: 'Move Left' },
    { key: 'dpadRight', label: 'D-Pad Right', desc: 'Move Right' },
    { key: 'btnA', label: 'A / Cross (✕)', desc: 'Primary Action / Jump' },
    { key: 'btnB', label: 'B / Circle (●)', desc: 'Secondary / Attack' },
    { key: 'btnX', label: 'X / Square (■)', desc: 'Tertiary / Special' },
    { key: 'btnY', label: 'Y / Triangle (▲)', desc: 'Guard / Menu' },
    { key: 'btnL1', label: 'L1 / L Trigger', desc: 'Left Shoulder' },
    { key: 'btnR1', label: 'R1 / R Trigger', desc: 'Right Shoulder' },
    { key: 'btnL2', label: 'L2 / Z Trigger', desc: 'Left Bumper' },
    { key: 'btnR2', label: 'R2 Trigger', desc: 'Right Bumper' },
    { key: 'start', label: 'Start Button', desc: 'Pause / Options' },
    { key: 'select', label: 'Select Button', desc: 'Inventory / Map' },
    { key: 'rewind', label: 'Instant Rewind', desc: 'Rewind Game Buffer' },
    { key: 'fastForward', label: 'Fast Forward (2x)', desc: 'Turbo Speed' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Gamepad className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Custom Controller & Gamepad Mapping
              </h3>
              <p className="text-xs text-slate-400">
                Connected Hardware: <span className="text-cyan-400 font-mono font-semibold">{gamepadName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening Banner */}
        {listeningKey && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 px-6 py-3 text-amber-300 text-sm font-medium flex items-center justify-between animate-pulse">
            <span>Press any Keyboard Key or Gamepad Button to assign to <strong>{listeningKey}</strong>...</span>
            <button
              onClick={() => setListeningKey(null)}
              className="text-xs px-2.5 py-1 bg-amber-600 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live Controller Status & Haptics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                🎮 Dual-Motor Vibration Rumble
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={rumbleIntensity}
                  onChange={(e) => setRumbleIntensity(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-500"
                />
                <button
                  onClick={handleTestRumble}
                  className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Test Rumble
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                🕹️ Analog Stick Deadzone ({Math.round((mapping.deadzone || 0.15) * 100)}%)
              </label>
              <input
                type="range"
                min={0.05}
                max={0.4}
                step={0.05}
                value={mapping.deadzone || 0.15}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const updated = { ...mapping, deadzone: val };
                  setMapping(updated);
                  gamepadService.updateMapping(updated);
                }}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Button Mapping Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Buttons & Keybindings</span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-normal transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {keyLabels.map(({ key, label, desc }) => {
                const currentBinding = String(mapping[key] || '');
                const isListening = listeningKey === key;

                return (
                  <div
                    key={key}
                    onClick={() => setListeningKey(key)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isListening
                        ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/40'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-slate-200 text-sm block">{label}</span>
                      <span className="text-[11px] text-slate-400">{desc}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-xs font-bold shadow-inner">
                        {currentBinding}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-400">Settings auto-saved to your cloud profile & local device.</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            Save & Return to Game
          </button>
        </div>
      </div>
    </div>
  );
};
