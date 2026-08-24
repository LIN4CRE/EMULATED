import React, { useState, useEffect } from 'react';
import { 
  Users, Mic, MicOff, Volume2, VolumeX, Radio, Play, Plus, 
  Eye, Send, Copy, Check, X, Shield, Sparkles, MessageCircle
} from 'lucide-react';
import { GameMetadata, MultiplayerRoomState } from '../types';
import { voiceChatService } from '../services/voiceChatService';

interface MultiplayerLobbyModalProps {
  game: GameMetadata;
  isOpen: boolean;
  onClose: () => void;
  onStartMultiplayerGame: (room: MultiplayerRoomState) => void;
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  game,
  isOpen,
  onClose,
  onStartMultiplayerGame
}) => {
  const [rooms, setRooms] = useState<MultiplayerRoomState[]>([]);
  const [currentRoom, setCurrentRoom] = useState<MultiplayerRoomState | null>(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'System', text: 'Welcome to AetherCloud Netplay Co-Op room with low-latency rollback simulation!', time: '10:30' },
    { sender: 'SpeedyGonz', text: 'Hey ready to duel on rainbow speedway?', time: '10:31' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Voice Chat State
  const [isMicMuted, setIsMicMuted] = useState(voiceChatService.getIsMuted());
  const [isDeafened, setIsDeafened] = useState(voiceChatService.getIsDeafened());
  const [micAudioLevel, setMicAudioLevel] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch rooms from server
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.rooms) setRooms(data.rooms);
      })
      .catch(() => {});

    // Hook voice chat level
    const unsub = voiceChatService.onVolumeChange(level => {
      setMicAudioLevel(level);
    });

    return () => {
      unsub();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          gameTitle: game.title,
          consoleName: game.console,
          hostName: 'Player (You)',
          hostAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80',
          maxPlayers: 4,
          isPrivate: false
        })
      });
      const data = await res.json();
      if (data.room) {
        setCurrentRoom(data.room);
        // Connect voice chat
        await voiceChatService.connect();
      }
    } catch (e) {
      console.warn("Room creation error", e);
    }
  };

  const handleJoinRoom = async (room: MultiplayerRoomState, asSpectator = false) => {
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          playerName: asSpectator ? 'Spectator View' : 'Player 2',
          playerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          asSpectator
        })
      });
      const data = await res.json();
      if (data.room) {
        setCurrentRoom(data.room);
        if (!asSpectator) {
          await voiceChatService.connect();
        }
      }
    } catch (e) {
      console.warn("Join room error", e);
    }
  };

  const handleToggleMic = () => {
    const muted = voiceChatService.toggleMute();
    setIsMicMuted(muted);
  };

  const handleToggleDeafen = () => {
    const deaf = voiceChatService.toggleDeafen();
    setIsDeafened(deaf);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'You',
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleCopyInvite = () => {
    if (!currentRoom) return;
    navigator.clipboard.writeText(`https://aethercloud.retro/join/${currentRoom.code}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Cross-Platform Netplay & Voice Co-Op
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Matchmaker
                </span>
              </h3>
              <p className="text-xs text-slate-400">Peer-to-Peer input synchronization with integrated low-latency voice chat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!currentRoom ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Action Bar: Create Room & Join with PIN */}
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <button
                onClick={handleCreateRoom}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" /> Host New Co-Op Room ({game.title})
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN Code..."
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    const match = rooms.find(r => r.code === roomCodeInput);
                    if (match) handleJoinRoom(match);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl text-sm border border-slate-700 transition-colors"
                >
                  Join PIN
                </button>
              </div>
            </div>

            {/* Active Public Rooms List */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Active Multiplayer Matchrooms
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rooms.map(r => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={r.hostAvatar} alt={r.hostName} className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover" />
                        <div>
                          <h5 className="font-bold text-white text-sm">{r.gameTitle}</h5>
                          <span className="text-xs text-slate-400">Hosted by <strong className="text-cyan-300">{r.hostName}</strong></span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {r.console}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <span>👥 {r.currentPlayers.length}/{r.maxPlayers} Players</span>
                        <span>👁️ {r.spectators.length} Watching</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleJoinRoom(r, true)}
                          className="px-3 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Watch
                        </button>
                        <button
                          onClick={() => handleJoinRoom(r, false)}
                          className="px-3.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          Join Match
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Connected Room View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left: Players Slots & Voice Controls */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto border-r border-slate-800">
              {/* Room Header Info */}
              <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-base">{currentRoom.gameTitle}</h4>
                  <span className="text-xs text-slate-400">Room Code: <strong className="text-cyan-400 font-mono text-sm">{currentRoom.code}</strong></span>
                </div>
                <button
                  onClick={handleCopyInvite}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Link Copied!' : 'Copy Invite'}
                </button>
              </div>

              {/* Integrated Voice Chat Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase text-white tracking-wider">Voice Channel (Active)</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{micAudioLevel > 15 ? 'Speaking...' : 'Ready'}</span>
                </div>

                {/* Mic Volume Level Meter */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 transition-all duration-75"
                    style={{ width: `${isMicMuted ? 0 : micAudioLevel}%` }}
                  />
                </div>

                {/* Voice Controls */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleToggleMic}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isMicMuted
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isMicMuted ? 'Muted' : 'Mic Active'}
                  </button>

                  <button
                    onClick={handleToggleDeafen}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isDeafened
                        ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isDeafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {isDeafened ? 'Deafened' : 'Deafen'}
                  </button>
                </div>
              </div>

              {/* Player Slots (P1 to P4) */}
              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Player Roster ({currentRoom.currentPlayers.length}/4)
                </h5>

                {currentRoom.currentPlayers.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border border-cyan-400 object-cover" />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                          P{idx + 1}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm block">{p.name} {p.isHost && '👑 (Host)'}</span>
                        <span className="text-[11px] text-emerald-400 font-mono">Ping: {p.latency}ms • Rollback Sync OK</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Ready
                    </span>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 4 - currentRoom.currentPlayers.length) }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-dashed border-slate-700/80 flex items-center justify-center text-xs text-slate-500 font-medium"
                  >
                    Waiting for Player {currentRoom.currentPlayers.length + i + 1} to join...
                  </div>
                ))}
              </div>

              {/* Start Match CTA */}
              <button
                onClick={() => {
                  onStartMultiplayerGame(currentRoom);
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Launch Synchronized Co-Op Game
              </button>
            </div>

            {/* Right: In-Room Chat Stream */}
            <div className="w-full md:w-80 bg-slate-950/60 p-4 flex flex-col justify-between border-t md:border-t-0 border-slate-800">
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-cyan-400" /> Match Chat & Emotes
                </h5>

                <div className="h-64 md:h-72 overflow-y-auto space-y-2.5 text-xs pr-1">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <strong className="text-cyan-400">{msg.sender}</strong>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-slate-200">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Send chat message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendChat}
                  className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
