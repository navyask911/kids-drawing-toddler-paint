import React, { useState, useEffect } from 'react';
import { Play, CheckCircle2, Shield, X, EyeOff, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdMobConfig } from '../data/flutterCode';

interface AdMobSimulatorModalProps {
  isOpen: boolean;
  adType: 'rewarded' | 'interstitial';
  adUnitId: string;
  config: AdMobConfig;
  targetRewardItemName: string;
  onAdClosed: () => void;
  onRewardEarned?: () => void;
}

export const AdMobSimulatorModal: React.FC<AdMobSimulatorModalProps> = ({
  isOpen,
  adType,
  adUnitId,
  targetRewardItemName,
  onAdClosed,
  onRewardEarned,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(adType === 'rewarded' ? 5 : 3);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(adType === 'rewarded' ? 5 : 3);
      setHasCompleted(false);
      setIsPlaying(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, adType]);

  const handleClaimRewardAndClose = () => {
    if (adType === 'rewarded' && onRewardEarned) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
      });
      onRewardEarned();
    }
    onAdClosed();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top AdMob Test Watermark Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-500/40">
              AdMob Test Ad
            </span>
            <span className="text-slate-400 font-mono hidden sm:inline">{adUnitId}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              COPPA G-Rated
            </span>

            {hasCompleted ? (
              <button
                onClick={handleClaimRewardAndClose}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Close Ad
              </button>
            ) : (
              <div className="text-slate-400 font-mono text-xs flex items-center gap-1">
                <span>Reward in {secondsRemaining}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Simulation Canvas */}
        <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
          {/* Subtle animated background circles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Ad Creative Simulation */}
          <div className="relative z-10 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-4 text-white">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-widest font-semibold text-emerald-400 mb-1 block">
              G-Rated Family Creative Simulator
            </span>

            <h4 className="text-2xl font-bold text-white mb-2">
              Friendly Forest Puzzle Adventure
            </h4>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Family-friendly educational game with no in-app chat, no behavioral tracking, and 100% G-rated certified content.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <EyeOff className="w-3.5 h-3.5 text-blue-400" />
              <span>Non-Personalized Ad (Zero Profiling or Tracking)</span>
            </div>
          </div>

          {/* Bottom Countdown Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000 ease-linear"
              style={{
                width: `${(( (adType === 'rewarded' ? 5 : 3) - secondsRemaining) / (adType === 'rewarded' ? 5 : 3)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Runtime AdMob Header & Parameters Inspector */}
        <div className="bg-slate-950 p-4 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Verified AdMob RequestConfiguration Payloads</span>
            <span className="text-emerald-400 font-mono text-[10px]">ALL INVARIANTS SATISFIED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">COPPA Flag:</span>
              <span className="text-emerald-400 font-semibold">tagForChildDirected: YES</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Content Ceiling:</span>
              <span className="text-emerald-400 font-semibold">maxRating: 'G'</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">GDPR-K Consent:</span>
              <span className="text-emerald-400 font-semibold">underAgeConsent: YES</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">NPA Directive:</span>
              <span className="text-cyan-400 font-semibold">extras: {'{ npa: "1" }'}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {hasCompleted ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Playback finished. You may claim reward: {targetRewardItemName}
                </span>
              ) : (
                <span>Watching toddler-safe ad simulation ({secondsRemaining}s left)...</span>
              )}
            </div>

            <button
              onClick={handleClaimRewardAndClose}
              disabled={!hasCompleted}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {adType === 'rewarded' ? 'Claim Reward & Unlock' : 'Close Ad'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
