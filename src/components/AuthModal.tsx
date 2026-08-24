import React, { useState, useEffect } from 'react';
import { User, LogIn, Cloud, Smartphone, Monitor, Tv, Tablet, Download, Upload, Check, X, Shield, RefreshCw } from 'lucide-react';
import { UserProfile, SaveStateSlot } from '../types';
import { cloudSyncService } from '../services/cloudSyncService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  currentGameId?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  currentGameId = 'chrono-blade-psx'
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [saves, setSaves] = useState<SaveStateSlot[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    loadSaves();
  }, [isOpen, currentGameId]);

  const loadSaves = async () => {
    const list = await cloudSyncService.getAllSavesForGame(currentGameId);
    setSaves(list);
  };

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setSyncing(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setSyncing(false);
    }, 600);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 800));
    setSyncing(false);
    loadSaves();
  };

  const handleExport = (slot: SaveStateSlot) => {
    cloudSyncService.exportSaveFile(slot);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    try {
      await cloudSyncService.importSaveFile(e.target.files[0]);
      loadSaves();
    } catch (err) {
      console.warn("Import error", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cloud className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Cloud Sync & Cross-Device Profile
              </h3>
              <p className="text-xs text-slate-400">Seamless progress synchronization across Phone, Tablet, TV & PC</p>
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
          {/* User Profile Card */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img src={userProfile.avatar} alt={userProfile.name} className="w-14 h-14 rounded-full border-2 border-cyan-400 object-cover shadow-md" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base">{userProfile.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    LVL {userProfile.level}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{userProfile.email}</span>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Save Sync: <strong>Enabled</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Cloud Now'}
            </button>
          </div>

          {/* Connected Device Fleet */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              📱 Connected Multi-Device Fleet ({userProfile.connectedDevices.length})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {userProfile.connectedDevices.map(dev => (
                <div
                  key={dev.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    dev.current
                      ? 'bg-cyan-500/10 border-cyan-500/50 shadow'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-300">
                      {dev.type === 'phone' && <Smartphone className="w-4 h-4 text-cyan-400" />}
                      {dev.type === 'tv' && <Tv className="w-4 h-4 text-amber-400" />}
                      {dev.type === 'tablet' && <Tablet className="w-4 h-4 text-purple-400" />}
                      {dev.type === 'desktop' && <Monitor className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-xs block">{dev.name}</span>
                      <span className="text-[10px] text-slate-400">Synced: {dev.lastSynced}</span>
                    </div>
                  </div>

                  {dev.current && (
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-bold rounded-md">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Save Slots for Current Title */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                💾 Cloud Save States & Backups
              </h4>

              <label className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Import .aether
                <input type="file" accept=".aether,.json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>

            {saves.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
                No cloud saves found yet for this title. Use Quick Save (F1) in-game to create a sync slot!
              </div>
            ) : (
              <div className="space-y-2">
                {saves.map(s => (
                  <div key={s.slot} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-3">
                      {s.thumbnail ? (
                        <img src={s.thumbnail} alt="Save slot" className="w-14 h-10 rounded object-cover border border-slate-700" />
                      ) : (
                        <div className="w-14 h-10 rounded bg-slate-800 flex items-center justify-center text-xs text-slate-500">
                          Slot {s.slot}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white text-xs block">{s.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(s.timestamp).toLocaleTimeString()} • {s.deviceId}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExport(s)}
                      className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> Export
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
