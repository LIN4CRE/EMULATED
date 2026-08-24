import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Maximize2, Minimize2, Play, Pause, Save, FolderOpen, 
  RotateCcw, FastForward, Volume2, VolumeX, Sparkles, 
  Tv, Monitor, Smartphone, Camera, Users, Trophy, MessageSquareText, Sliders
} from 'lucide-react';
import { GameMetadata, ShaderFilter, SaveStateSlot } from '../types';
import { audioEngine } from '../services/audioEngine';
import { gamepadService } from '../services/gamepadService';
import { cloudSyncService } from '../services/cloudSyncService';
import { 
  GameEngineState, 
  createInitialState, 
  tickChronoBladePSX, 
  tickStarStrikerN64, 
  tickSuperRetroKartGP, 
  tickShadowNinjaGaidenNES, 
  tickEmeraldMonstersGBA, 
  tickSonicCyberSurgeGenesis, 
  tickNeoSpaceInvadersArcade 
} from '../services/retroGameEngines';
import { OnScreenJoypad } from './OnScreenJoypad';

interface EmulatorScreenProps {
  game: GameMetadata;
  shaderFilter: ShaderFilter;
  onOpenAICompanion: () => void;
  onOpenMultiplayer: () => void;
  onOpenLeaderboard: () => void;
  onOpenRemapper: () => void;
  onOpenAnalytics: () => void;
  onOpenSocialShare: () => void;
  isTouchDevice?: boolean;
}

export const EmulatorScreen: React.FC<EmulatorScreenProps> = ({
  game,
  shaderFilter,
  onOpenAICompanion,
  onOpenMultiplayer,
  onOpenLeaderboard,
  onOpenRemapper,
  onOpenAnalytics,
  onOpenSocialShare,
  isTouchDevice = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFastForward, setIsFastForward] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '16:9' | '3:2' | '1:1'>('4:3');
  const [fps, setFps] = useState(60);
  const [notification, setNotification] = useState<string | null>(null);
  const [virtualJoypadVisible, setVirtualJoypadVisible] = useState(true);

  // Game Engine State and Rewind Buffer
  const gameStateRef = useRef<GameEngineState>(createInitialState(game.id));
  const rewindHistoryRef = useRef<string[]>([]);
  const keyboardInputRef = useRef<Record<string, boolean>>({});
  const touchInputRef = useRef<Record<string, boolean>>({});
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys / space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      const mapping = gamepadService.getMapping();
      const code = e.code;

      if (code === mapping.dpadUp) keyboardInputRef.current.up = true;
      if (code === mapping.dpadDown) keyboardInputRef.current.down = true;
      if (code === mapping.dpadLeft) keyboardInputRef.current.left = true;
      if (code === mapping.dpadRight) keyboardInputRef.current.right = true;
      if (code === mapping.btnA) keyboardInputRef.current.btnA = true;
      if (code === mapping.btnB) keyboardInputRef.current.btnB = true;
      if (code === mapping.btnX) keyboardInputRef.current.btnX = true;
      if (code === mapping.btnY) keyboardInputRef.current.btnY = true;
      if (code === mapping.btnL1) keyboardInputRef.current.l1 = true;
      if (code === mapping.btnR1) keyboardInputRef.current.r1 = true;
      if (code === mapping.btnL2) keyboardInputRef.current.l2 = true;
      if (code === mapping.btnR2) keyboardInputRef.current.r2 = true;
      if (code === mapping.start) keyboardInputRef.current.start = true;
      if (code === mapping.select) keyboardInputRef.current.select = true;

      // Rewind (Backspace / Tab)
      if (code === 'Backspace' || code === mapping.rewind) {
        setIsRewinding(true);
      }
      // Fast Forward (Space)
      if (code === 'Space' || code === mapping.fastForward) {
        setIsFastForward(true);
      }
      // Quick Save (F1)
      if (code === 'F1') {
        e.preventDefault();
        handleQuickSave();
      }
      // Quick Load (F3)
      if (code === 'F3') {
        e.preventDefault();
        handleQuickLoad();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mapping = gamepadService.getMapping();
      const code = e.code;

      if (code === mapping.dpadUp) keyboardInputRef.current.up = false;
      if (code === mapping.dpadDown) keyboardInputRef.current.down = false;
      if (code === mapping.dpadLeft) keyboardInputRef.current.left = false;
      if (code === mapping.dpadRight) keyboardInputRef.current.right = false;
      if (code === mapping.btnA) keyboardInputRef.current.btnA = false;
      if (code === mapping.btnB) keyboardInputRef.current.btnB = false;
      if (code === mapping.btnX) keyboardInputRef.current.btnX = false;
      if (code === mapping.btnY) keyboardInputRef.current.btnY = false;
      if (code === mapping.btnL1) keyboardInputRef.current.l1 = false;
      if (code === mapping.btnR1) keyboardInputRef.current.r1 = false;
      if (code === mapping.btnL2) keyboardInputRef.current.l2 = false;
      if (code === mapping.btnR2) keyboardInputRef.current.r2 = false;
      if (code === mapping.start) keyboardInputRef.current.start = false;
      if (code === mapping.select) keyboardInputRef.current.select = false;

      if (code === 'Backspace' || code === mapping.rewind) {
        setIsRewinding(false);
      }
      if (code === 'Space' || code === mapping.fastForward) {
        setIsFastForward(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Initialize Game & BGM
  useEffect(() => {
    gameStateRef.current = createInitialState(game.id);
    rewindHistoryRef.current = [];
    audioEngine.startBGM(game.id);
    return () => {
      audioEngine.stopBGM();
    };
  }, [game.id]);

  // Touch button handler from OnScreenJoypad
  const handleTouchButtonChange = (btn: string, pressed: boolean) => {
    touchInputRef.current[btn] = pressed;
    if (btn === 'rewind') setIsRewinding(pressed);
    if (btn === 'fastForward') setIsFastForward(pressed);
  };

  // Quick Save
  const handleQuickSave = async () => {
    const canvas = canvasRef.current;
    const thumbnail = canvas ? canvas.toDataURL('image/jpeg', 0.6) : '';
    await cloudSyncService.saveState(
      1,
      game.id,
      'Quick Save Slot 1',
      thumbnail,
      gameStateRef.current,
      Math.floor(gameStateRef.current.tick / 60)
    );
    audioEngine.playPowerUp();
    showToast("💾 Cloud State Saved (Slot 1)");
  };

  // Quick Load
  const handleQuickLoad = async () => {
    const saved = await cloudSyncService.loadState(1, game.id);
    if (saved && saved.stateData) {
      gameStateRef.current = typeof saved.stateData === 'string' ? JSON.parse(saved.stateData) : saved.stateData;
      audioEngine.playCoin();
      showToast("📂 Loaded Cloud State (Slot 1)");
    } else {
      showToast("⚠️ No save state found in Slot 1");
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Capture Screenshot
  const handleScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${game.title.replace(/\s+/g, '_')}_Screenshot.png`;
    a.click();
    showToast("📸 Screenshot Captured & Downloaded!");
  };

  // Master Render & Physics Game Loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Calculate FPS
        frameCountRef.current++;
        const now = performance.now();
        if (now - lastTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }

        // Combine inputs: Keyboard + Touch + Physical Gamepad
        const gpInput = gamepadService.pollButtons();
        const combinedInput: Record<string, boolean> = {
          up: keyboardInputRef.current.up || touchInputRef.current.up || gpInput.up || false,
          down: keyboardInputRef.current.down || touchInputRef.current.down || gpInput.down || false,
          left: keyboardInputRef.current.left || touchInputRef.current.left || gpInput.left || false,
          right: keyboardInputRef.current.right || touchInputRef.current.right || gpInput.right || false,
          btnA: keyboardInputRef.current.btnA || touchInputRef.current.btnA || gpInput.btnA || false,
          btnB: keyboardInputRef.current.btnB || touchInputRef.current.btnB || gpInput.btnB || false,
          btnX: keyboardInputRef.current.btnX || touchInputRef.current.btnX || gpInput.btnX || false,
          btnY: keyboardInputRef.current.btnY || touchInputRef.current.btnY || gpInput.btnY || false,
          l1: keyboardInputRef.current.l1 || touchInputRef.current.l1 || gpInput.l1 || false,
          r1: keyboardInputRef.current.r1 || touchInputRef.current.r1 || gpInput.r1 || false,
          l2: keyboardInputRef.current.l2 || touchInputRef.current.l2 || gpInput.l2 || false,
          r2: keyboardInputRef.current.r2 || touchInputRef.current.r2 || gpInput.r2 || false,
          start: keyboardInputRef.current.start || touchInputRef.current.start || gpInput.start || false,
          select: keyboardInputRef.current.select || touchInputRef.current.select || gpInput.select || false,
        };

        const w = canvas.width;
        const h = canvas.height;

        if (!isPaused) {
          // REWIND MODE: Pop previous state from buffer
          if (isRewinding && rewindHistoryRef.current.length > 0) {
            const prevStateStr = rewindHistoryRef.current.pop();
            if (prevStateStr) {
              gameStateRef.current = JSON.parse(prevStateStr);
            }
          } else {
            // Push state snapshot to rolling buffer (max 180 frames = 3 seconds rewind)
            if (gameStateRef.current.tick % 2 === 0) {
              rewindHistoryRef.current.push(JSON.stringify(gameStateRef.current));
              if (rewindHistoryRef.current.length > 180) {
                rewindHistoryRef.current.shift();
              }
            }

            // Normal Tick (Or Turbo 2x/4x)
            const iterations = isFastForward ? 2 : 1;
            for (let i = 0; i < iterations; i++) {
              if (game.id === 'chrono-blade-psx' || game.console === 'PSX') {
                tickChronoBladePSX(ctx, gameStateRef.current, combinedInput, w, h);
              } else if (game.id === 'star-striker-n64' || game.console === 'N64') {
                tickStarStrikerN64(ctx, gameStateRef.current, combinedInput, w, h);
              } else if (game.id === 'super-retro-kart' || game.console === 'SNES') {
                tickSuperRetroKartGP(ctx, gameStateRef.current, combinedInput, w, h);
              } else if (game.id === 'cyber-ninjas-nes' || game.console === 'NES') {
                tickShadowNinjaGaidenNES(ctx, gameStateRef.current, combinedInput, w, h);
              } else if (game.id === 'emerald-monsters-gba' || game.console === 'GBA') {
                tickEmeraldMonstersGBA(ctx, gameStateRef.current, combinedInput, w, h);
              } else if (game.id === 'sonic-surge-genesis' || game.console === 'GENESIS') {
                tickSonicCyberSurgeGenesis(ctx, gameStateRef.current, combinedInput, w, h);
              } else {
                tickNeoSpaceInvadersArcade(ctx, gameStateRef.current, combinedInput, w, h);
              }
            }
          }
        }

        // Draw VHS Rewind Overlay Effect if rewinding
        if (isRewinding) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 22px monospace';
          ctx.fillText("⏪ REWINDING BUFFER...", 30, h - 30);
          // Glitch scanlines
          for (let s = 0; s < 4; s++) {
            const gy = Math.random() * h;
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(0, gy, w, 4);
          }
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  }, [game.id, isPaused, isRewinding, isFastForward]);

  useEffect(() => {
    animFrameIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameLoop]);

  // Shader CSS Classes
  const getShaderClass = () => {
    switch (shaderFilter) {
      case 'scanlines':
        return 'scanlines-shader';
      case 'curved-crt':
        return 'curved-crt-shader shadow-2xl';
      case 'phosphor-mask':
        return 'phosphor-mask-shader';
      case 'lcd-grid':
        return 'lcd-grid-shader';
      case 'bloom-neon':
        return 'bloom-neon-shader';
      case 'smooth-bilinear':
        return 'smooth-bilinear-shader';
      default:
        return 'crisp-pixel-shader';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center bg-black/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
    >
      {/* Top Emulator Control Bar */}
      <div className="w-full flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md z-20 text-xs text-slate-300">
        {/* Left Game Console & Core Info */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-md">
            {game.console} CORE
          </span>
          <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
            {game.title}
          </span>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${fps > 55 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              {fps} FPS
            </span>
            <span>•</span>
            <span>60Hz V-Sync</span>
          </div>
        </div>

        {/* Action Controls & Fast Features */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume Game" : "Pause Game"}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={() => {
              const nextMute = !isMuted;
              setIsMuted(nextMute);
              audioEngine.setMuted(nextMute);
            }}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Quick Save / Quick Load */}
          <button
            onClick={handleQuickSave}
            title="Quick Cloud Save (F1)"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            <span className="hidden md:inline">Save</span>
          </button>
          <button
            onClick={handleQuickLoad}
            title="Quick Cloud Load (F3)"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="hidden md:inline">Load</span>
          </button>

          {/* Fast Forward 2x */}
          <button
            onClick={() => setIsFastForward(!isFastForward)}
            title="Fast Forward 2x Speed"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${isFastForward ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'hover:bg-slate-800 text-slate-300'}`}
          >
            <FastForward className="w-4 h-4" />
            <span className="hidden md:inline">2X</span>
          </button>

          {/* AI Guide Button */}
          <button
            onClick={onOpenAICompanion}
            title="Aether AI Retro Guide"
            className="p-1.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 hover:from-purple-600/50 hover:to-cyan-600/50 border border-purple-500/40 rounded-lg text-purple-300 hover:text-white transition-all flex items-center gap-1 font-medium"
          >
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
            <span className="hidden sm:inline">AI Scout</span>
          </button>

          {/* Multiplayer Co-Op */}
          <button
            onClick={onOpenMultiplayer}
            title="Multiplayer Netplay & Voice Room"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">Co-Op</span>
          </button>

          {/* Screenshot */}
          <button
            onClick={handleScreenshot}
            title="Take High-Res Screenshot"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Remap Controls */}
          <button
            onClick={onOpenRemapper}
            title="Controller Mapping & Gamepad Config"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Screen Canvas Container */}
      <div className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-4 min-h-[360px] sm:min-h-[480px]">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className={`max-w-full max-h-[72vh] rounded-lg shadow-2xl ${getShaderClass()} ${aspectRatio === '4:3' ? 'aspect-[4/3]' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'}`}
          style={{ imageRendering: shaderFilter === 'none' ? 'pixelated' : 'auto' }}
        />

        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-cyan-300 border border-cyan-500/40 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md text-sm font-medium animate-bounce z-30">
            {notification}
          </div>
        )}

        {/* Pause Banner Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
            <span className="text-3xl font-black tracking-widest text-cyan-400 font-mono">PAUSED</span>
            <p className="text-slate-300 text-sm">Press Space or click Resume to continue</p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-full shadow-lg transition-transform active:scale-95"
            >
              Resume Game
            </button>
          </div>
        )}
      </div>

      {/* Touch Screen Virtual Joypad (Mobile & Tablet Mode) */}
      <div className="w-full">
        <OnScreenJoypad
          onButtonChange={handleTouchButtonChange}
          consoleType={game.console}
          opacity={0.9}
        />
      </div>
    </div>
  );
};
