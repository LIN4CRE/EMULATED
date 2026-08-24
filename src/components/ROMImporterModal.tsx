import React, { useState } from 'react';
import { Upload, FolderPlus, Disc, CheckCircle, AlertCircle, X, Sparkles, HardDrive } from 'lucide-react';
import { GameMetadata } from '../types';

interface ROMImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (game: GameMetadata) => void;
}

export const ROMImporterModal: React.FC<ROMImporterModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState('');
  const [consoleType, setConsoleType] = useState('GBA');
  const [genre, setGenre] = useState('Action RPG');

  if (!isOpen) return null;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setIsProcessing(true);

    const fileName = file.name;
    const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
    setTitle(cleanTitle);

    // Guess console from extension
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'gba') setConsoleType('GBA');
    else if (ext === 'nes') setConsoleType('NES');
    else if (ext === 'snes' || ext === 'smc') setConsoleType('SNES');
    else if (ext === 'n64' || ext === 'z64') setConsoleType('N64');
    else if (ext === 'bin' || ext === 'iso' || ext === 'cue') setConsoleType('PSX');
    else if (ext === 'md' || ext === 'gen') setConsoleType('GENESIS');
    else setConsoleType('ARCADE');

    setTimeout(() => {
      setIsProcessing(false);
    }, 400);
  };

  const handleFinalizeImport = () => {
    if (!title.trim()) return;

    const newGame: GameMetadata = {
      id: `custom-rom-${Date.now()}`,
      title: title.trim(),
      console: consoleType as any,
      year: 2002,
      publisher: 'Custom ROM Cartridge',
      genre: genre,
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      heroBanner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
      description: `User-imported custom ROM (${title}) running on AetherCloud ${consoleType} Core.`,
      rating: 4.9,
      playersCount: 2,
      favorite: true,
      hasCloudSave: true,
      lastPlayedDate: 'Just now',
      playtimeMinutes: 0
    };

    onImportSuccess(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Import Local Retro ROM or Backup
              </h3>
              <p className="text-xs text-slate-400">Drag & drop your cartridge dumps with zero installation required</p>
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
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
            }`}
          >
            <input
              type="file"
              id="rom-file-input"
              accept=".nes,.snes,.smc,.gba,.gbc,.bin,.iso,.z64,.n64,.zip,.md,.gen"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
            <label htmlFor="rom-file-input" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  Click to Browse or Drag ROM file here
                </span>
                <span className="text-xs text-slate-400 mt-1 block">
                  Supports PSX (.iso, .bin), N64 (.z64), GBA (.gba), SNES (.smc), NES (.nes), Genesis (.md)
                </span>
              </div>
            </label>
          </div>

          {/* ROM Details Form */}
          {title && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 animate-fade-in">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Game Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Console System</label>
                  <select
                    value={consoleType}
                    onChange={(e) => setConsoleType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm font-semibold"
                  >
                    <option value="PSX">PlayStation 1 (PSX)</option>
                    <option value="N64">Nintendo 64 (N64)</option>
                    <option value="GBA">Game Boy Advance (GBA)</option>
                    <option value="SNES">Super Nintendo (SNES)</option>
                    <option value="NES">Nintendo NES (8-Bit)</option>
                    <option value="GENESIS">Sega Genesis / MegaDrive</option>
                    <option value="ARCADE">Arcade Cabinet / NeoGeo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Genre</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleFinalizeImport}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all"
              >
                🎮 Add to Library & Launch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
