import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, Key, Zap, Shield, HelpCircle, X, Check } from 'lucide-react';
import { GameMetadata } from '../types';

interface AIGameScoutModalProps {
  game: GameMetadata;
  isOpen: boolean;
  onClose: () => void;
  onApplyCheat?: (code: string, name: string) => void;
}

export const AIGameScoutModal: React.FC<AIGameScoutModalProps> = ({
  game,
  isOpen,
  onClose,
  onApplyCheat
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'gemini'; text: string; cheats?: Array<{ code: string; desc: string }> }>>([
    {
      sender: 'gemini',
      text: `Greetings Hero! I am your **Aether AI Retro Scout**. I have full architectural knowledge of **${game.title}** (${game.console}). Ask me for boss weaknesses, hidden warp zones, speedrun skips, or GameShark cheat codes!`
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [appliedCodes, setAppliedCodes] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || query;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/game-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameTitle: game.title,
          consoleName: game.console,
          query: textToSend,
          gameStateContext: `Player is currently playing ${game.title} on ${game.console}. Level: Active Session, Genre: ${game.genre}`
        })
      });
      const data = await res.json();
      if (data.answer) {
        setMessages(prev => [...prev, {
          sender: 'gemini',
          text: data.answer,
          cheats: data.suggestedCheats
        }]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (e: any) {
      setMessages(prev => [...prev, {
        sender: 'gemini',
        text: `[Offline AI Mode] Tactical Scout for **${game.title}**:\n\n- **Boss Weakness**: Exploit the 3-frame recovery window right after their major blast.\n- **Speedrun Trick**: Tap Dash + Jump on the initial slope to preserve kinetic momentum.\n- **Secret Code**: GameShark \`80081C40 03E7\` grants Max Power!`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (code: string, desc: string) => {
    setAppliedCodes(prev => ({ ...prev, [code]: true }));
    if (onApplyCheat) {
      onApplyCheat(code, desc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-900/50 via-slate-900 to-cyan-900/40 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-yellow-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Aether AI Game Guide & Scout
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">Gemini 3.7 Flash</span>
              </h3>
              <p className="text-xs text-slate-400">Tactics, Secret Skips & Action Replay Codes for {game.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="flex flex-wrap gap-2 px-6 py-3 bg-slate-950/60 border-b border-slate-800/80">
          <button
            onClick={() => handleSend("How do I defeat the stage boss easily?")}
            className="px-3 py-1 text-xs rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3 h-3 text-purple-400" /> Boss Strategy
          </button>
          <button
            onClick={() => handleSend("What are the best GameShark & Action Replay cheat codes for this game?")}
            className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-3 h-3 text-cyan-400" /> Generate Cheats
          </button>
          <button
            onClick={() => handleSend("Give me the top 3 speedrunner glitches and frame skips for this title.")}
            className="px-3 py-1 text-xs rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3 h-3 text-amber-400" /> Speedrun Skips
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Cheats Injector */}
                {msg.cheats && msg.cheats.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
                      ⚡ Action Replay Cheats
                    </span>
                    {msg.cheats.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-700 text-xs">
                        <div>
                          <span className="font-mono text-cyan-300 font-semibold">{c.code}</span>
                          <p className="text-slate-400 text-[11px]">{c.desc}</p>
                        </div>
                        <button
                          onClick={() => handleApply(c.code, c.desc)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                            appliedCodes[c.code]
                              ? 'bg-emerald-600 text-white'
                              : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/40'
                          }`}
                        >
                          {appliedCodes[c.code] ? <Check className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                          {appliedCodes[c.code] ? 'Applied' : 'Apply Cheat'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 text-purple-300 border border-purple-500/30 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                Gemini AI is analyzing ROM registers and strategy database...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Gemini for secrets, boss tips or cheats in ${game.title}...`}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !query.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
