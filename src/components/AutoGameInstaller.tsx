import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Cpu, HardDrive, Zap, CheckCircle2, 
  Terminal, Sparkles, FastForward, Play, AlertCircle,
  Gamepad2, Disc, Layers, Music, Lock
} from 'lucide-react';
import { GameMetadata } from '../types';
import { installService } from '../services/installService';
import { audioEngine } from '../services/audioEngine';
import { PREINSTALLED_SYSTEM_BIOS } from '../data/biosConfig';

interface AutoGameInstallerProps {
  game: GameMetadata;
  onInstallComplete: () => void;
  isReinstall?: boolean;
}

interface InstallStage {
  id: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  percentage: number;
}

export const AutoGameInstaller: React.FC<AutoGameInstallerProps> = ({
  game,
  onInstallComplete,
  isReinstall = false
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const isFastForwardRef = useRef(false);

  // Find relevant BIOS for console
  const bios = PREINSTALLED_SYSTEM_BIOS.find(b => b.console === game.console) || PREINSTALLED_SYSTEM_BIOS[0];

  const stages: InstallStage[] = [
    {
      id: 'rom-extract',
      title: 'Decompressing ROM Cartridge & Integrity Check',
      detail: `Unpacking ${game.title} cartridge sectors (${game.size || '32.0 MB'}) and computing CRC-32 checksum...`,
      icon: Disc,
      percentage: 20
    },
    {
      id: 'bios-link',
      title: `Linking Pre-Installed ${game.console} Hardware BIOS`,
      detail: `Attaching verified ${bios.filename} (${bios.name}) to DMA memory bus at $0x80000000...`,
      icon: ShieldCheck,
      percentage: 42
    },
    {
      id: 'shader-compile',
      title: 'Compiling WebGL & WebAssembly 60FPS Shaders',
      detail: 'Building JIT pixel pipelines, CRT phosphor raster, and zero-latency frame buffer...',
      icon: Cpu,
      percentage: 65
    },
    {
      id: 'nvram-mount',
      title: 'Mounting Virtual NVRAM & Cloud Save Partition',
      detail: 'Allocating 512KB Battery SRAM memory sector with AetherCloud auto-sync hooks...',
      icon: HardDrive,
      percentage: 82
    },
    {
      id: 'dma-audio',
      title: 'Configuring Controller DMA & Audio Synthesizer',
      detail: 'Calibrating input latency (18ms), joypad mappings, and 44.1kHz stereo audio channels...',
      icon: Gamepad2,
      percentage: 95
    },
    {
      id: 'ready',
      title: 'Optimization Complete — Booting System',
      detail: `All ${game.console} cores verified and locked at 60 FPS. Launching game engine!`,
      icon: Zap,
      percentage: 100
    }
  ];

  // Auto-scroll terminal logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Run the automated install sequence
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, `[${time}] ${msg}`]);
    };

    addLog(`🚀 Initializing 1st-load automated install sequence for: ${game.title}`);
    addLog(`🎯 Target Architecture: ${game.console} (60Hz NTSC-U)`);
    addLog(`📦 Image source: Internal Clean Dump • Size: ${game.size || '32.0 MB'}`);

    let currentPct = 0;
    const intervalTime = 40; // ~3.5 seconds total standard

    const interval = setInterval(() => {
      const increment = isFastForwardRef.current ? 4 : (Math.random() * 2 + 1);
      currentPct = Math.min(100, currentPct + increment);
      setProgress(Math.floor(currentPct));

      // Calculate stage index
      let sIdx = 0;
      if (currentPct >= 95) sIdx = 5;
      else if (currentPct >= 80) sIdx = 4;
      else if (currentPct >= 60) sIdx = 3;
      else if (currentPct >= 40) sIdx = 2;
      else if (currentPct >= 20) sIdx = 1;
      else sIdx = 0;

      setCurrentStageIndex(prev => {
        if (prev !== sIdx) {
          // Play subtle stage progression sound
          audioEngine.playTone(350 + sIdx * 90, 'square', 0.08, 0.15);
          
          if (sIdx === 1) {
            addLog(`✅ ROM integrity verified. Hash: CRC32-7F${Math.floor(Math.random()*8999+1000)}`);
            addLog(`🔗 Linked pre-installed BIOS: ${bios.filename} (${bios.clockSpeed})`);
          } else if (sIdx === 2) {
            addLog(`⚙️ WebAssembly JIT Core compiled. 60 FPS pipeline cached.`);
          } else if (sIdx === 3) {
            addLog(`💾 Virtual NVRAM mapped (512KB SRAM allocated). Cloud sync endpoint connected.`);
          } else if (sIdx === 4) {
            addLog(`🎮 Controller bindings configured. Audio buffer ready.`);
          } else if (sIdx === 5) {
            addLog(`🎉 All systems verified green! Installation completed successfully.`);
          }
        }
        return sIdx;
      });

      if (currentPct >= 100) {
        clearInterval(interval);
        setIsCompleted(true);
        audioEngine.playPowerUp();
        installService.markInstalled(game.id, bios.name);

        // Transition into game
        timer = setTimeout(() => {
          onInstallComplete();
        }, 800);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [game, bios, onInstallComplete]);

  const handleFastTrack = () => {
    isFastForwardRef.current = true;
    setProgress(100);
    setIsCompleted(true);
    installService.markInstalled(game.id, bios.name);
    audioEngine.playCoin();
    setTimeout(() => {
      onInstallComplete();
    }, 400);
  };

  const currentStage = stages[currentStageIndex] || stages[0];
  const StageIcon = currentStage.icon;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 bg-slate-900/95 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 px-6 sm:px-8 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isReinstall ? 'Re-Running System Setup' : '1st-Load Automated Game Installation'}
              </h2>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Auto-Provisioning
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configuring hardware cores, pre-installed BIOS, and WebGL shader cache for flawless 60 FPS play.
            </p>
          </div>
        </div>

        {/* Fast-Track Skip Button */}
        <button
          onClick={handleFastTrack}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fast-Track Boot</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        {/* Game Info Spotlight Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-700 shadow-md flex-shrink-0"
          />

          <div className="flex-1 space-y-1.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {game.console} SYSTEM
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {game.genre} • {game.year}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">
              {game.title}
            </h3>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                BIOS: <strong className="text-slate-200">{bios.filename}</strong>
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
                Image: <strong className="text-slate-200">{game.size || '32.0 MB'}</strong>
              </span>
            </div>
          </div>

          {/* Progress Percentage Display */}
          <div className="flex-shrink-0 text-center px-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-2xl min-w-[100px]">
            <div className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
              {progress}%
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {isCompleted ? 'Ready!' : 'Installing'}
            </div>
          </div>
        </div>

        {/* Master Linear Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <StageIcon className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{currentStage.title}</span>
            </span>
            <span className="font-mono text-slate-400 font-medium">
              Stage {currentStageIndex + 1} of {stages.length}
            </span>
          </div>

          {/* Progress Track */}
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-150 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {currentStage.detail}
          </p>
        </div>

        {/* 6-Stage Visual Grid Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {stages.map((stage, idx) => {
            const isStageDone = progress >= stage.percentage;
            const isStageActive = currentStageIndex === idx && !isCompleted;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                  isStageDone
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : isStageActive
                    ? 'bg-indigo-950/30 border-indigo-500/60 text-indigo-200 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isStageDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isStageActive ? 'text-indigo-400 animate-spin-slow' : 'text-slate-600'}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold truncate text-[11px] leading-tight">
                    {stage.title}
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {isStageDone ? 'Verified' : isStageActive ? 'Processing...' : 'Queued'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Diagnostics Terminal Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 font-semibold cursor-pointer transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Diagnostic Installation Log ({logs.length} events)</span>
            </button>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Stream
            </span>
          </div>

          {showLogs && (
            <div
              ref={logContainerRef}
              className="bg-black/80 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 h-28 overflow-y-auto space-y-1 scrollbar-thin shadow-inner"
            >
              {logs.map((line, i) => (
                <div key={i} className="leading-relaxed whitespace-pre-wrap">
                  {line.includes('✅') || line.includes('🎉') ? (
                    <span className="text-emerald-300 font-semibold">{line}</span>
                  ) : line.includes('🚀') || line.includes('📦') ? (
                    <span className="text-indigo-300">{line}</span>
                  ) : (
                    <span className="text-slate-400">{line}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-6 sm:px-8 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Local NVRAM & Sandbox Storage Secured</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          AetherCore v2.4.0 • Zero-Latency JIT
        </span>
      </div>
    </div>
  );
};
