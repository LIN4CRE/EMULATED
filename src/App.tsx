import React, { useState, useEffect } from 'react';
import { DEFAULT_GAMES_CATALOG } from './data/gamesCatalog';
import { GameMetadata, ShaderFilter, UserProfile, MultiplayerRoomState } from './types';
import { HeaderNav } from './components/HeaderNav';
import { GameCatalogView } from './components/GameCatalogView';
import { EmulatorScreen } from './components/EmulatorScreen';
import { AIGameScoutModal } from './components/AIGameScoutModal';
import { ControllerRemapperModal } from './components/ControllerRemapperModal';
import { MultiplayerLobbyModal } from './components/MultiplayerLobbyModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PerformanceAnalyticsModal } from './components/PerformanceAnalyticsModal';
import { SocialShareModal } from './components/SocialShareModal';
import { AuthModal } from './components/AuthModal';
import { ROMImporterModal } from './components/ROMImporterModal';
import { BIOSManagerModal } from './components/BIOSManagerModal';
import { AutoGameInstaller } from './components/AutoGameInstaller';
import { cloudSyncService } from './services/cloudSyncService';
import { installService } from './services/installService';
import { ArrowLeft, Sparkles, Trophy, Users, Sliders, Activity, Share2 } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<GameMetadata[]>(DEFAULT_GAMES_CATALOG);
  const [activeGame, setActiveGame] = useState<GameMetadata | null>(DEFAULT_GAMES_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'library' | 'playing'>('library');
  const [shaderFilter, setShaderFilter] = useState<ShaderFilter>('curved-crt');
  const [isInstallingGame, setIsInstallingGame] = useState<boolean>(false);
  const [isReinstallMode, setIsReinstallMode] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr_retro_master_99',
    name: 'AetherGamer_X',
    email: 'delinacre@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    level: 42,
    xp: 89450,
    totalPlaytimeMinutes: 4620,
    trophiesCount: 84,
    cloudSavesCount: 23,
    connectedDevices: [
      { id: 'dev_1', name: 'Desktop Browser (Chrome/Mac)', type: 'desktop', lastSynced: 'Just now', current: true },
      { id: 'dev_2', name: 'iPhone 15 Pro (Safari Mobile)', type: 'phone', lastSynced: '12 mins ago' },
      { id: 'dev_3', name: 'Android Smart TV (Living Room)', type: 'tv', lastSynced: 'Yesterday' },
      { id: 'dev_4', name: 'iPad Pro 12.9" (Tablet Joypad)', type: 'tablet', lastSynced: '3 days ago' }
    ]
  });

  // Modal States
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [aiGuideGame, setAiGuideGame] = useState<GameMetadata>(DEFAULT_GAMES_CATALOG[0]);
  const [isRemapperOpen, setIsRemapperOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isBIOSManagerOpen, setIsBIOSManagerOpen] = useState(false);

  // Initialize Cloud Sync & Local DB
  useEffect(() => {
    cloudSyncService.init().catch(console.warn);
  }, []);

  // Handle Game Selection
  const handleSelectGame = (game: GameMetadata) => {
    // If game is not in library, add it
    setGames(prev => prev.some(g => g.id === game.id) ? prev : [game, ...prev]);
    setActiveGame(game);

    // Check if this is the 1st load of this game
    const isInstalled = installService.isGameInstalled(game.id);
    if (!isInstalled) {
      setIsInstallingGame(true);
      setIsReinstallMode(false);
    } else {
      setIsInstallingGame(false);
    }

    setActiveTab('playing');
  };

  // Re-run automated installation / hardware diagnostic
  const handleReinstallGame = () => {
    if (activeGame) {
      setIsInstallingGame(true);
      setIsReinstallMode(true);
    }
  };

  // 1-Click Add Game to Library
  const handleAddGameToLibrary = (newGame: GameMetadata) => {
    setGames(prev => (prev.some(g => g.id === newGame.id) ? prev : [newGame, ...prev]));
  };

  // Toggle Favorite
  const handleToggleFavorite = (gameId: string) => {
    setGames(prev =>
      prev.map(g => (g.id === gameId ? { ...g, favorite: !g.favorite } : g))
    );
  };

  // Import Custom ROM
  const handleImportSuccess = (newGame: GameMetadata) => {
    setGames(prev => [newGame, ...prev]);
    setActiveGame(newGame);
    setActiveTab('playing');
  };

  // Open AI Guide for a specific game
  const handleOpenAIGuideForGame = (game: GameMetadata) => {
    setAiGuideGame(game);
    setIsAIGuideOpen(true);
  };

  // Start Co-Op Game
  const handleStartMultiplayerGame = (room: MultiplayerRoomState) => {
    const matched = games.find(g => g.id === room.gameId);
    if (matched) {
      setActiveGame(matched);
      setActiveTab('playing');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Master Top Navigation Header */}
      <HeaderNav
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        shaderFilter={shaderFilter}
        onChangeShader={setShaderFilter}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenRemapper={() => setIsRemapperOpen(true)}
        onOpenImporter={() => setIsImporterOpen(true)}
        onOpenBIOSManager={() => setIsBIOSManagerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        isPlayingGame={activeGame !== null}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'library' ? (
          /* Library Browser View with 2-Section Search & Vault Downloads */
          <GameCatalogView
            games={games}
            onSelectGame={handleSelectGame}
            onToggleFavorite={handleToggleFavorite}
            onOpenImporter={() => setIsImporterOpen(true)}
            onOpenAIGuide={handleOpenAIGuideForGame}
            onOpenBIOSManager={() => setIsBIOSManagerOpen(true)}
            onAddGameToLibrary={handleAddGameToLibrary}
          />
        ) : (
          /* Active Playing Emulator View */
          activeGame && (
            <div className="space-y-6 animate-fade-in">
              {/* Back to Library Navigation & Game Quick Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveTab('library')}
                  className="px-4 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Library
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAIGuideForGame(activeGame)}
                    className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Strategy Guide
                  </button>

                  <button
                    onClick={() => setIsSocialShareOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share Stream
                  </button>

                  <button
                    onClick={() => setIsMultiplayerOpen(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    <Users className="w-3.5 h-3.5 text-white" /> Netplay Co-Op
                  </button>

                  <button
                    onClick={() => setIsLeaderboardOpen(true)}
                    className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> High Scores
                  </button>
                </div>
              </div>

              {/* Automated 1st-Load Installation Screen OR Active 60FPS Retro Emulator */}
              {isInstallingGame ? (
                <AutoGameInstaller
                  game={activeGame}
                  isReinstall={isReinstallMode}
                  onInstallComplete={() => {
                    setIsInstallingGame(false);
                    setIsReinstallMode(false);
                  }}
                />
              ) : (
                <EmulatorScreen
                  game={activeGame}
                  shaderFilter={shaderFilter}
                  onOpenAICompanion={() => handleOpenAIGuideForGame(activeGame)}
                  onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
                  onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
                  onOpenRemapper={() => setIsRemapperOpen(true)}
                  onOpenAnalytics={() => setIsAnalyticsOpen(true)}
                  onOpenSocialShare={() => setIsSocialShareOpen(true)}
                  onReinstallGame={handleReinstallGame}
                />
              )}
            </div>
          )
        )}
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a]/95 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Cloud Sync Cluster: US-Central Active • 60 FPS WebGL Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini AI Scout</span>
            <span>•</span>
            <span>Multiplatform Netplay Ready</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AIGameScoutModal
        game={aiGuideGame}
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
      />

      <ControllerRemapperModal
        isOpen={isRemapperOpen}
        onClose={() => setIsRemapperOpen(false)}
      />

      <MultiplayerLobbyModal
        game={activeGame || DEFAULT_GAMES_CATALOG[0]}
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
        onStartMultiplayerGame={handleStartMultiplayerGame}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentGameTitle={activeGame?.title}
        currentGameId={activeGame?.id}
        currentConsole={activeGame?.console}
      />

      <PerformanceAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        userProfile={userProfile}
      />

      <SocialShareModal
        game={activeGame || DEFAULT_GAMES_CATALOG[0]}
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        currentGameId={activeGame?.id}
      />

      <ROMImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <BIOSManagerModal
        isOpen={isBIOSManagerOpen}
        onClose={() => setIsBIOSManagerOpen(false)}
      />
    </div>
  );
}
