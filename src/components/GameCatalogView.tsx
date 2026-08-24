import React, { useState } from 'react';
import { 
  Search, Play, Heart, Star, Cloud, Users, Sparkles, 
  Upload, Filter, Grid, List, Clock, Zap, Tv, Gamepad
} from 'lucide-react';
import { GameMetadata } from '../types';

interface GameCatalogViewProps {
  games: GameMetadata[];
  onSelectGame: (game: GameMetadata) => void;
  onToggleFavorite: (id: string) => void;
  onOpenImporter: () => void;
  onOpenAIGuide: (game: GameMetadata) => void;
}

export const GameCatalogView: React.FC<GameCatalogViewProps> = ({
  games,
  onSelectGame,
  onToggleFavorite,
  onOpenImporter,
  onOpenAIGuide
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConsole, setSelectedConsole] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'cloud'>('all');

  // Featured Game for Hero
  const featuredGame = games[0] || null;

  // Filter games
  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.console.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesConsole = selectedConsole === 'ALL' || g.console === selectedConsole;
    const matchesFavorite = activeFilter !== 'favorites' || g.favorite;
    const matchesCloud = activeFilter !== 'cloud' || g.hasCloudSave;

    return matchesSearch && matchesConsole && matchesFavorite && matchesCloud;
  });

  const consoleTabs = [
    { id: 'ALL', label: 'All Systems', color: 'bg-indigo-500' },
    { id: 'PSX', label: 'PlayStation 1', color: 'bg-blue-500' },
    { id: 'N64', label: 'Nintendo 64', color: 'bg-green-500' },
    { id: 'GBA', label: 'Game Boy Advance', color: 'bg-red-500' },
    { id: 'SNES', label: 'SNES 16-Bit', color: 'bg-purple-500' },
    { id: 'NES', label: 'NES 8-Bit', color: 'bg-amber-500' },
    { id: 'GENESIS', label: 'Genesis', color: 'bg-teal-500' },
    { id: 'ARCADE', label: 'Arcade', color: 'bg-rose-500' }
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Featured Hero Banner & Quick Telemetry Split */}
      {featuredGame && !searchQuery && selectedConsole === 'ALL' && activeFilter === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Card (2 Cols) */}
          <div className="lg:col-span-2 relative min-h-[300px] sm:min-h-[340px] rounded-3xl overflow-hidden group border border-slate-700 shadow-2xl bg-slate-900 flex flex-col justify-end">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${featuredGame.heroBanner})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

            <div className="relative z-20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5 max-w-lg">
                <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block shadow-md">
                  Now Playing & Featured
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {featuredGame.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                  {featuredGame.console} • {featuredGame.genre} • Syncing Progress to Cloud Fleet...
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={() => onSelectGame(featuredGame)}
                  className="bg-white hover:bg-slate-100 text-black px-6 py-2.5 rounded-full font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" /> Resume
                </button>
                <button
                  onClick={() => onOpenAIGuide(featuredGame)}
                  title="AI Strategy Guide"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-2.5 rounded-full text-white transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Sleek Stats Widgets (1 Col) */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Performance Stats */}
            <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Telemetry</span>
                  <Zap className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">60.0 <span className="text-xs font-normal text-slate-400 uppercase font-mono">fps</span></h3>
              </div>
              <div className="h-10 flex items-end gap-1.5 mt-3">
                <div className="w-full bg-indigo-500/40 h-7 rounded-sm"></div>
                <div className="w-full bg-indigo-500/50 h-5 rounded-sm"></div>
                <div className="w-full bg-indigo-500 h-9 rounded-sm"></div>
                <div className="w-full bg-indigo-500/70 h-6 rounded-sm"></div>
                <div className="w-full bg-indigo-500 h-8 rounded-sm"></div>
                <div className="w-full bg-indigo-500/90 h-10 rounded-sm"></div>
              </div>
            </div>

            {/* History Analytics */}
            <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">History Analytics</span>
                <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">+12% this week</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Playtime</span>
                  <span className="font-mono text-white font-semibold">142.5 hrs</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Games in Library</span>
                  <span className="font-mono text-white font-semibold">{games.length} Titles</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Achievements</span>
                  <span className="font-mono text-amber-400 font-bold">124 / 200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library, consoles, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Quick Filter Pill Group */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-800/60 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeFilter === 'favorites'
                  ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20'
                  : 'bg-slate-800/60 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" /> Favorites
            </button>
            <button
              onClick={() => setActiveFilter('cloud')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeFilter === 'cloud'
                  ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/20'
                  : 'bg-slate-800/60 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" /> Cloud Saves
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 ml-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* System Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {consoleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedConsole(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                selectedConsole === tab.id
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.id !== 'ALL' && <div className={`w-2 h-2 rounded-full ${tab.color}`}></div>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="group relative bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelectGame(game)}>
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90" />

                {/* Console Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0f172a]/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                  {game.console}
                </span>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(game.id);
                  }}
                  className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md border transition-all ${
                    game.favorite
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                      : 'bg-[#0f172a]/60 text-slate-400 hover:text-white border-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${game.favorite ? 'fill-current' : ''}`} />
                </button>

                {/* Play Hover Overlay Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-slate-400">{game.genre}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-current" /> {game.rating}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectGame(game)}
                    className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors cursor-pointer truncate"
                  >
                    {game.title}
                  </h3>
                </div>

                {/* Bottom Stats & AI Action */}
                <div className="pt-2 border-t border-slate-750/80 border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono text-slate-300">
                      <Users className="w-3 h-3 text-indigo-400" /> {game.playersCount}P
                    </span>
                    {game.hasCloudSave && (
                      <span title="Cloud Save Ready" className="text-purple-400">
                        <Cloud className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenAIGuide(game)}
                    title="Ask Gemini AI for cheats & strategy"
                    className="px-2 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 text-[11px] font-semibold transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" /> AI Guide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/30 hover:bg-slate-800/70 border border-slate-700/80 hover:border-indigo-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <img src={game.coverImage} alt={game.title} className="w-14 h-14 rounded-lg object-cover border border-slate-700" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{game.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {game.console}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{game.genre} • {game.year} • {game.publisher}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAIGuide(game);
                  }}
                  className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Guide
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGame(game);
                  }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Play
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-800/20 border border-slate-700 space-y-4">
          <Gamepad className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No retro games found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or console filters, or import your own ROM dump directly.
          </p>
          <button
            onClick={onOpenImporter}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20"
          >
            Import Custom Cartridge ROM
          </button>
        </div>
      )}
    </div>
  );
};
