import React, { useState } from 'react';
import { 
  Plus,
  Mic,
  ArrowUp,
  ChevronDown,
  Bookmark,
  Sparkles, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  FileCode, 
  RotateCcw
} from 'lucide-react';
import { AdMobConfig } from '../data/flutterCode';

interface DeveloperConversationPanelProps {
  config: AdMobConfig;
  onUpdateConfig: (config: AdMobConfig) => void;
  isUsingTestIds: boolean;
  onToggleTestIds: (val: boolean) => void;
  onTriggerParentalGate: () => void;
  onTriggerInterstitialTest: () => void;
  onSwitchRightTab: (tab: 'simulator' | 'code' | 'guide' | 'logs' | 'tests') => void;
  activeRightTab: 'simulator' | 'code' | 'guide' | 'logs' | 'tests';
  isDrawingActive: boolean;
  adLogs: Array<{ id: string; time: string; text: string; type: 'info' | 'success' | 'warn' }>;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  time: string;
  text: string;
  codeSnippet?: string;
  actionType?: 'parentalGate' | 'testAd' | 'viewCode' | 'toggleIds';
  runtimeBadge?: string;
  checkpointLabel?: string;
}

export const DeveloperConversationPanel: React.FC<DeveloperConversationPanelProps> = ({
  config,
  onUpdateConfig,
  isUsingTestIds,
  onToggleTestIds,
  onTriggerParentalGate,
  onTriggerInterstitialTest,
  onSwitchRightTab,
  activeRightTab,
  isDrawingActive,
  adLogs,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'user',
      time: '10:42 AM',
      text: 'Senior Flutter Dev: We need to integrate Google Mobile Ads into our kids drawing app. Google Play Families policy requires strict COPPA compliance, G-rated ads only, Non-Personalized Ads (NPA), and no accidental toddler clicks.',
    },
    {
      id: 'm2',
      sender: 'assistant',
      time: '10:42 AM',
      text: 'I have designed a compliant AdMob architecture centered on an AdHelper singleton. The key architectural invariant is applying RequestConfiguration before MobileAds.instance.initialize():',
      codeSnippet: `final requestConfig = RequestConfiguration(
  tagForChildDirectedTreatment: TagForChildDirectedTreatment.yes,
  maxAdContentRating: MaxAdContentRating.g,
  tagForUnderAgeOfConsent: TagForUnderAgeOfConsent.yes,
);
await MobileAds.instance.updateRequestConfiguration(requestConfig);
await MobileAds.instance.initialize();`,
      runtimeBadge: 'Gemini 3.8 Flash · 142ms',
      checkpointLabel: 'Initial Config Checkpoint',
    },
    {
      id: 'm3',
      sender: 'assistant',
      time: '10:43 AM',
      text: 'For toddler safety, we enforced two strict UI guarantees:\n1. The bottom banner is placed in a dedicated safe-area container separated by a 16px physical dead-zone buffer so enthusiastic drawing strokes never register accidental clicks.\n2. Interstitial ads and rewarded video unlocks are gated behind a math Parental Gate (e.g. "What is 4 + 3?") and actively suppressed if the child has their finger down drawing.',
      actionType: 'parentalGate',
      runtimeBadge: 'Gemini 3.8 Flash · 185ms',
      checkpointLabel: 'Parental Gate Verified',
    },
    {
      id: 'm4',
      sender: 'user',
      time: '11:16 AM',
      text: 'Production AdMob IDs update:\n• Android App ID: ca-app-pub-4783826505860771~6744055015\n• Banner Unit ID: ca-app-pub-4783826505860771/2828860731',
    },
    {
      id: 'm5',
      sender: 'assistant',
      time: '11:16 AM',
      text: 'Updated AndroidManifest.xml and lib/ad_helper.dart with your live production AdMob IDs. All COPPA flags (tagForChildDirectedTreatment.yes, MaxAdContentRating.g, underAgeConsent.yes, and npa: "1") remain strictly intact and verified.',
      codeSnippet: `// AndroidManifest.xml:
// <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" 
//            android:value="ca-app-pub-4783826505860771~6744055015"/>

// lib/ad_helper.dart:
static String get bannerAdUnitId => 'ca-app-pub-4783826505860771/2828860731';`,
      runtimeBadge: 'Gemini 3.8 Flash · 112ms',
      checkpointLabel: 'Production IDs Injected',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [savedCheckpointId, setSavedCheckpointId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('Dart Architect');
  const [showModeMenu, setShowModeMenu] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);

  // Quick horizontal suggestion chips
  const suggestionChips = [
    { label: '🛡️ Verify COPPA Rules', query: 'How does AdHelper enforce COPPA tagForChildDirectedTreatment?' },
    { label: '📱 Test Banner Buffer', query: 'Show me the banner accidental click prevention rules' },
    { label: '🔢 Open Parental Gate', query: 'Trigger the Parental Gate math challenge modal' },
    { label: '⚡ Test Interstitial Guard', query: 'How does the stroke sentinel suppress mid-stroke ads?' },
    { label: '🔑 Inject Production IDs', query: 'Switch to live production AdMob unit identifiers' },
    { label: '📊 View AdMob Telemetry', query: 'Show live AdMob SDK request logs' },
    { label: '🎨 Toddler Drawing Protection', query: 'How does pointer-event isolation protect child artwork?' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputPrompt).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptLower = text.toLowerCase();
    setInputPrompt('');

    // Responsive assistant reply simulation
    setTimeout(() => {
      let replyText = 'Understood. Reviewing the AdMob Families Policy compliance invariants.';
      let codeSnippet: string | undefined;
      let actionType: 'parentalGate' | 'testAd' | 'viewCode' | 'toggleIds' | undefined;

      if (promptLower.includes('banner') || promptLower.includes('buffer') || promptLower.includes('placement')) {
        replyText = 'The banner is anchored strictly outside the Canvas using a SafeArea container and a distinct separator border. AdSize.banner (320x50) is loaded with NPA parameters.';
        codeSnippet = `AdRequest(extras: {'npa': '1'})`;
      } else if (promptLower.includes('interstitial') || promptLower.includes('stroke') || promptLower.includes('drawing')) {
        replyText = 'Active stroke detection is linked to the canvas pointer lifecycle. When isDrawingActive is true, showInterstitialAd() immediately aborts presentation with a policy suppression reason.';
        codeSnippet = `if (isDrawingActive) {
  debugPrint('AdHelper: Interstitial SUPPRESSED while child draws.');
  return;
}`;
      } else if (promptLower.includes('parental') || promptLower.includes('gate') || promptLower.includes('math')) {
        replyText = 'Triggering the Parental Gate in the live preview stage. Notice how it requires adult arithmetic before presenting the G-rated ad creative.';
        actionType = 'parentalGate';
        onTriggerParentalGate();
      } else if (promptLower.includes('id') || promptLower.includes('test') || promptLower.includes('production')) {
        replyText = 'You can switch between official Google AdMob test IDs and custom production IDs in the right pane code inspector.';
        onSwitchRightTab('code');
      } else if (promptLower.includes('telemetry') || promptLower.includes('log')) {
        replyText = 'Opening the live AdMob SDK Console on the right preview stage.';
        onSwitchRightTab('logs');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: replyText,
          codeSnippet,
          actionType,
          runtimeBadge: 'Gemini 3.8 Flash · 164ms',
          checkpointLabel: `Checkpoint #${prev.length + 1}`,
        },
      ]);
    }, 350);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleToggleCheckpoint = (id: string) => {
    setSavedCheckpointId(savedCheckpointId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E0E2E6] text-slate-800 select-text overflow-hidden">
      {/* 1. Panel Header */}
      <div className="px-5 py-3.5 bg-[#FFFFFF] border-b border-[#E0E2E6] flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              COPPA & Flutter Engineering Dialogue
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Senior Flutter Developer · AdMob Compliance Assistant
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F1F3F4] text-[11px] font-medium text-slate-600 border border-[#E0E2E6]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Families Certified</span>
        </div>
      </div>

      {/* 2. Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F9FA]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-semibold text-slate-600">
                {msg.sender === 'user' ? 'Developer' : 'Flutter AdMob Specialist'}
              </span>
              <span className="text-[10px] text-slate-400">{msg.time}</span>
            </div>

            <div
              className={`max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs transition-all ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-[#E0E2E6] rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Code Snippet Box */}
              {msg.codeSnippet && (
                <div className="mt-3 rounded-xl bg-slate-900 text-slate-200 p-3 font-mono text-[11px] overflow-x-auto relative border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 mb-1.5 border-b border-slate-800">
                    <span>Dart / Flutter</span>
                    <button
                      onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCodeId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="leading-relaxed">
                    <code>{msg.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Interactive Card Action */}
              {msg.actionType === 'parentalGate' && (
                <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-900">
                      Gated Content Verification Flow
                    </span>
                  </div>
                  <button
                    onClick={onTriggerParentalGate}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg shadow-xs cursor-pointer active:scale-95 transition-all"
                  >
                    Open Modal
                  </button>
                </div>
              )}

              {/* 3. Consolidated Unified Metadata & Checkpoint Banner Attached to Bubble */}
              {msg.sender === 'assistant' && (msg.runtimeBadge || msg.checkpointLabel) && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
                  {/* Left: Model runtime indicator */}
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{msg.runtimeBadge || 'Gemini 3.8 Flash'}</span>
                  </div>

                  {/* Right: Attached Checkpoint Action */}
                  {msg.checkpointLabel && (
                    <button
                      onClick={() => handleToggleCheckpoint(msg.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans font-medium transition-all cursor-pointer ${
                        savedCheckpointId === msg.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                      }`}
                      title="Save or restore this codebase state"
                    >
                      <Bookmark className={`w-3 h-3 ${savedCheckpointId === msg.id ? 'fill-blue-600 text-blue-600' : 'text-slate-400'}`} />
                      <span>{savedCheckpointId === msg.id ? 'Checkpoint Saved' : msg.checkpointLabel}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Real-time Stroke Warning in Chat Stream */}
        {isDrawingActive && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-semibold">Drawing In Progress:</span> Interstitial and rewarded ads are locked by AdHelper stroke sentinel.
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. Horizontal Suggestion Chips: Single-Row Scrollable Pill Tray     */}
      {/* Positioned cleanly above the composer box                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-4 py-2 bg-white border-t border-[#E0E2E6] flex items-center gap-2 overflow-x-auto shrink-0 select-none">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip.query)}
            className="px-3 py-1.5 text-xs rounded-full bg-[#F1F3F4] hover:bg-[#E0E2E6] text-slate-700 font-medium whitespace-nowrap cursor-pointer transition-all border border-[#E0E2E6]/70 flex items-center gap-1.5 active:scale-95 shrink-0 shadow-2xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Compact Input Composer: Integrated Inline Actions                */}
      {/* Mic, Attachment (+), Mode Dropdown, and Submit inside textarea box */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-3.5 bg-white border-t border-[#E0E2E6] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative rounded-2xl border border-[#E0E2E6] bg-[#F8F9FA] focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all p-2.5 shadow-xs"
        >
          {/* Main textarea */}
          <textarea
            rows={2}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about COPPA, ad_helper.dart, or test an ad event..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent resize-none border-0 outline-none leading-relaxed block focus:ring-0 focus:outline-none"
          />

          {/* Inline Bottom Action Bar (Wasted Vertical Space Eliminated) */}
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 mt-1">
            {/* Left inline actions: Add attachment (+) & Mode dropdown */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setInputPrompt((prev) => prev ? `${prev} [Attached: ad_helper.dart]` : '[Attached: ad_helper.dart] ');
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Add attachment / reference code"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Mode dropdown pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModeMenu(!showModeMenu)}
                  className="px-2 py-1 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>{selectedMode}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showModeMenu && (
                  <div className="absolute bottom-9 left-0 z-30 w-36 bg-white border border-[#E0E2E6] rounded-xl shadow-lg p-1 text-xs text-slate-700 animate-fade-in">
                    {['Dart Architect', 'COPPA Reviewer', 'Fast Dev'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setSelectedMode(mode);
                          setShowModeMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                          selectedMode === mode ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-100'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right inline trailing actions: Mic & Submit */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMicActive(!isMicActive)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isMicActive
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : 'hover:bg-slate-200/70 text-slate-500 hover:text-slate-800'
                }`}
                title={isMicActive ? 'Listening...' : 'Voice input'}
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                disabled={!inputPrompt.trim()}
                className="w-7 h-7 rounded-xl bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Send prompt (Enter)"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
