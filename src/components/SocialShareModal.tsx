import React, { useState } from 'react';
import { Share2, Twitter, MessageSquare, Send, Copy, Check, X, Sparkles, Download, Globe } from 'lucide-react';
import { GameMetadata } from '../types';

interface SocialShareModalProps {
  game: GameMetadata;
  isOpen: boolean;
  onClose: () => void;
  score?: number;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  game,
  isOpen,
  onClose,
  score = 854000
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://aethercloud.retro/play/${game.id}`;
  const shareText = `🎮 Playing ${game.title} on AetherCloud Retro Console! Score: ${score.toLocaleString()} PTS with real-time cloud saves & netplay co-op! #RetroGaming #AetherCloud #${game.console}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Playing ${game.title} on AetherCloud`,
          text: shareText,
          url: shareUrl
        });
      } catch (e) {
        // ignore
      }
    } else {
      handleCopy();
    }
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToReddit = () => {
    window.open(`https://reddit.com/submit?title=${encodeURIComponent(`Check out ${game.title} on AetherCloud Retro`)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                Social Gameplay & Score Card Share
              </h3>
              <p className="text-xs text-slate-400">Share your achievements, invite friends, and stream sessions</p>
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
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Stylized Share Card Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 shadow-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={game.coverImage} alt={game.title} className="w-14 h-14 rounded-xl object-cover border border-cyan-400/50 shadow-md" />
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                    {game.console} RETRO ARCHIVE
                  </span>
                  <h4 className="font-bold text-white text-base mt-1">{game.title}</h4>
                  <span className="text-xs text-slate-400">{game.genre}</span>
                </div>
              </div>
              <span className="text-xl">🏆</span>
            </div>

            {/* Score Highlight */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Session High Score</span>
                <span className="text-xl font-black font-mono text-amber-400">{score.toLocaleString()} PTS</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cloud Synced</span>
                <span className="text-xs font-semibold text-emerald-400">✓ Verified State</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800/80">
              <span>Powered by AetherCloud Web Console</span>
              <span className="font-mono text-cyan-400">aethercloud.retro</span>
            </div>
          </div>

          {/* Social Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={shareToTwitter}
              className="p-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 font-semibold text-xs flex flex-col items-center gap-1.5 transition-all"
            >
              <Twitter className="w-5 h-5 text-sky-400" />
              <span>X / Twitter</span>
            </button>

            <button
              onClick={shareToReddit}
              className="p-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-300 font-semibold text-xs flex flex-col items-center gap-1.5 transition-all"
            >
              <Globe className="w-5 h-5 text-orange-400" />
              <span>Reddit</span>
            </button>

            <button
              onClick={shareToTelegram}
              className="p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-semibold text-xs flex flex-col items-center gap-1.5 transition-all"
            >
              <Send className="w-5 h-5 text-blue-400" />
              <span>Telegram</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 font-semibold text-xs flex flex-col items-center gap-1.5 transition-all"
            >
              <Share2 className="w-5 h-5 text-purple-400" />
              <span>Share Link</span>
            </button>
          </div>

          {/* Direct Copy Invite Link */}
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-xs font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
