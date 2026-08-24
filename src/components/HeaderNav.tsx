import React from 'react';
import { 
  Gamepad, Trophy, Users, Activity, Sliders, Upload, 
  Sparkles, Cloud, Tv, ChevronDown, User, Volume2, ShieldCheck, Share2, Shield, Radio
} from 'lucide-react';
import { ShaderFilter, UserProfile } from '../types';

interface HeaderNavProps {
  activeTab: 'library' | 'playing';
  onNavigateTab: (tab: 'library' | 'playing') => void;
  shaderFilter: ShaderFilter;
  onChangeShader: (shader: ShaderFilter) => void;
  onOpenLeaderboard: () => void;
  onOpenMultiplayer: () => void;
  onOpenAnalytics: () => void;
  onOpenRemapper: () => void;
  onOpenImporter: () => void;
  onOpenAuth: () => void;
  userProfile: UserProfile;
  isPlayingGame?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onNavigateTab,
  shaderFilter,
  onChangeShader,
  onOpenLeaderboard,
  onOpenMultiplayer,
  onOpenAnalytics,
  onOpenRemapper,
  onOpenImporter,
  onOpenAuth,
  userProfile,
  isPlayingGame = false
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Mode Switcher */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onNavigateTab('library')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 12h4m-2-2v4m7-2h.01m2.99 0h.01" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tracking-tight text-white">AETHER<span className="text-indigo-400">CLOUD</span></span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 tracking-wider uppercase font-semibold">
                Universal Retro Core
              </span>
            </div>
          </div>

          {/* Primary View Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1">
            <button
              onClick={() => onNavigateTab('library')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              All Games
            </button>
            {isPlayingGame && (
              <button
                onClick={() => onNavigateTab('playing')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'playing'
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20'
                    : 'text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Emulator
              </button>
            )}
          </nav>
        </div>

        {/* Center: Status Indicators & Shader Selector */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cloud Save Active</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>18ms Latency</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1.5">
            <Tv className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">CRT:</span>
            <select
              value={shaderFilter}
              onChange={(e) => onChangeShader(e.target.value as ShaderFilter)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="none" className="bg-slate-900">Pixel-Crisp (Raw)</option>
              <option value="scanlines" className="bg-slate-900">Scanlines Classic</option>
              <option value="curved-crt" className="bg-slate-900">Trinitron Curved CRT</option>
              <option value="phosphor-mask" className="bg-slate-900">Phosphor RGB Mask</option>
              <option value="lcd-grid" className="bg-slate-900">GBA LCD Pixel Grid</option>
              <option value="bloom-neon" className="bg-slate-900">Arcade Bloom Glow</option>
              <option value="smooth-bilinear" className="bg-slate-900">Smooth Bilinear</option>
            </select>
          </div>
        </div>

        {/* Right: Device Fleet, Quick Action Modals & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Device Fleet Badges */}
          <div className="hidden sm:flex -space-x-2" title="Synced Fleet: Living Room TV, Mobile, Desktop PC">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#0f172a] shadow-sm">TV</div>
            <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#0f172a] shadow-sm">MOB</div>
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#0f172a] shadow-sm">PC</div>
          </div>

          {/* Leaderboard */}
          <button
            onClick={onOpenLeaderboard}
            title="Real-Time Global Leaderboards"
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Co-Op Netplay */}
          <button
            onClick={onOpenMultiplayer}
            title="Multiplayer Netplay Lobby"
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Performance Analytics */}
          <button
            onClick={onOpenAnalytics}
            title="Performance Telemetry"
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors hidden sm:flex"
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Gamepad Remapper */}
          <button
            onClick={onOpenRemapper}
            title="Controller & Gamepad Configuration"
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors hidden sm:flex"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Import ROM */}
          <button
            onClick={onOpenImporter}
            title="Import Custom ROM Cartridge"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Import ROM</span>
          </button>

          {/* Cloud User Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all shadow-sm"
          >
            <div className="text-right hidden sm:block">
              <span className="font-bold text-slate-100 text-xs block leading-tight truncate max-w-[100px]">{userProfile.name}</span>
              <span className="text-[10px] text-green-400 flex items-center gap-1 justify-end font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Fully Synced
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-rose-500 overflow-hidden border border-slate-600 flex items-center justify-center">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
