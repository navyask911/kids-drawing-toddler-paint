import React, { useRef, useState, useEffect } from 'react';
import { 
  Paintbrush, 
  Eraser, 
  RotateCcw, 
  Trash2, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Tv,
  Layers
} from 'lucide-react';
import { AdMobConfig } from '../data/flutterCode';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
  isRainbow?: boolean;
}

interface KidsDrawingStudioProps {
  config: AdMobConfig;
  onRequestUnlock: (pageName: string, adFormat: 'Rewarded Video Ad' | 'Interstitial Ad') => void;
  unlockedPages: Set<string>;
  onShowInterstitialDirectly: (isDrawing: boolean) => void;
  onDrawingStateChange?: (active: boolean) => void;
}

export const KidsDrawingStudio: React.FC<KidsDrawingStudioProps> = ({
  config,
  onRequestUnlock,
  unlockedPages,
  onShowInterstitialDirectly,
  onDrawingStateChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>('#EF4444'); // Red
  const [brushWidth, setBrushWidth] = useState<number>(8);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isRainbow, setIsRainbow] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStrokes, setRedoStrokes] = useState<Stroke[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('Blank Canvas');
  const [adSuppressionAlert, setAdSuppressionAlert] = useState<string | null>(null);
  const [bufferTaps, setBufferTaps] = useState<number>(0);

  // Available coloring pages
  const coloringSheets = [
    { id: 'blank', name: 'Blank Canvas', locked: false, icon: '🎨' },
    { id: 'puppy', name: 'Playful Puppy', locked: false, icon: '🐶' },
    { id: 'sun', name: 'Happy Sunshine', locked: false, icon: '☀️' },
    { id: 'rocket', name: 'Cosmic Rocket', locked: !unlockedPages.has('Cosmic Rocket'), icon: '🚀', bonus: true },
    { id: 'unicorn', name: 'Magic Unicorn', locked: !unlockedPages.has('Magic Unicorn'), icon: '🦄', bonus: true },
    { id: 'dino', name: 'Dino Safari', locked: !unlockedPages.has('Dino Safari'), icon: '🦕', bonus: true },
  ];

  // Palette colors
  const palette = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Brown', hex: '#854D0E' },
    { name: 'Black', hex: '#0F172A' },
  ];

  // Redraw canvas whenever strokes or selectedPage changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background outline for coloring sheets if selected
    drawColoringPageOutline(ctx, selectedPage, canvas.width, canvas.height);

    // Draw strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, selectedPage]);

  // Outline illustration drawings for coloring pages
  const drawColoringPageOutline = (ctx: CanvasRenderingContext2D, page: string, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#F8FAFC';

    if (page === 'Playful Puppy') {
      // Draw cute dog face outline
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 20, 110, 0, Math.PI * 2);
      ctx.stroke();
      // Ears
      ctx.beginPath();
      ctx.ellipse(w / 2 - 110, h / 2 - 50, 40, 70, -0.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w / 2 + 110, h / 2 - 50, 40, 70, 0.4, 0, Math.PI * 2);
      ctx.stroke();
      // Snout
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 + 10, 45, 0, Math.PI * 2);
      ctx.stroke();
      // Nose
      ctx.fillStyle = '#94A3B8';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 - 5, 20, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.beginPath();
      ctx.arc(w / 2 - 40, h / 2 - 45, 12, 0, Math.PI * 2);
      ctx.arc(w / 2 + 40, h / 2 - 45, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (page === 'Happy Sunshine') {
      // Sun
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 85, 0, Math.PI * 2);
      ctx.stroke();
      // Rays
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x1 = w / 2 + Math.cos(angle) * 105;
        const y1 = h / 2 + Math.sin(angle) * 105;
        const x2 = w / 2 + Math.cos(angle) * 145;
        const y2 = h / 2 + Math.sin(angle) * 145;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      // Smile
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 + 10, 40, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    } else if (page === 'Cosmic Rocket') {
      // Rocket body
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2 - 10, 50, 110, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Fins
      ctx.beginPath();
      ctx.moveTo(w / 2 - 45, h / 2 + 40);
      ctx.lineTo(w / 2 - 90, h / 2 + 90);
      ctx.lineTo(w / 2 - 35, h / 2 + 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w / 2 + 45, h / 2 + 40);
      ctx.lineTo(w / 2 + 90, h / 2 + 90);
      ctx.lineTo(w / 2 + 35, h / 2 + 80);
      ctx.stroke();
      // Porthole
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - 40, 24, 0, Math.PI * 2);
      ctx.stroke();
    } else if (page === 'Magic Unicorn') {
      // Unicorn head
      ctx.beginPath();
      ctx.arc(w / 2 - 20, h / 2, 80, 0, Math.PI * 2);
      ctx.stroke();
      // Horn
      ctx.beginPath();
      ctx.moveTo(w / 2 - 40, h / 2 - 75);
      ctx.lineTo(w / 2 - 15, h / 2 - 160);
      ctx.lineTo(w / 2 + 10, h / 2 - 75);
      ctx.closePath();
      ctx.stroke();
      // Eye
      ctx.beginPath();
      ctx.arc(w / 2 - 10, h / 2 - 15, 10, 0, Math.PI);
      ctx.stroke();
    } else if (page === 'Dino Safari') {
      // Dino body
      ctx.beginPath();
      ctx.arc(w / 2 - 30, h / 2 + 20, 75, 0, Math.PI * 2);
      ctx.stroke();
      // Long neck
      ctx.beginPath();
      ctx.moveTo(w / 2 + 30, h / 2 + 10);
      ctx.lineTo(w / 2 + 80, h / 2 - 90);
      ctx.lineTo(w / 2 + 130, h / 2 - 90);
      ctx.lineTo(w / 2 + 50, h / 2 + 40);
      ctx.stroke();
    }

    ctx.restore();
  };

  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    onDrawingStateChange?.(true);
    const pos = getCanvasCoordinates(e);

    const activeColor = isEraser 
      ? '#FFFFFF' 
      : isRainbow 
        ? `hsl(${Math.floor(Math.random() * 360)}, 90%, 55%)` 
        : currentColor;

    const newStroke: Stroke = {
      points: [pos],
      color: activeColor,
      width: isEraser ? brushWidth * 2 : brushWidth,
      isRainbow,
    };

    setStrokes((prev) => [...prev, newStroke]);
    setRedoStrokes([]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getCanvasCoordinates(e);

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const currentStroke = prev[lastIndex];

      const updatedStroke = {
        ...currentStroke,
        points: [...currentStroke.points, pos],
      };

      const copy = [...prev];
      copy[lastIndex] = updatedStroke;
      return copy;
    });
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    onDrawingStateChange?.(false);
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, prev.length - 1));
    setRedoStrokes((prev) => [...prev, last]);
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStrokes([]);
  };

  const handleAttemptShowInterstitial = () => {
    if (isDrawing) {
      setAdSuppressionAlert('⚠️ Interstitial Ad Blocked! Google Play Families Policy forbids interrupting a child during an active drawing stroke.');
      setTimeout(() => setAdSuppressionAlert(null), 4000);
      return;
    }
    // Safe to show
    onShowInterstitialDirectly(false);
  };

  return (
    <div className="flex flex-col bg-amber-50/70 border border-amber-200/80 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      {/* 1. App Bar Header */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between text-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
            🎨
          </div>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight">Kids Drawing Pad</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-950/80">
              <span>Families Policy Compliant</span>
              <span>·</span>
              <span>COPPA G-Rated</span>
            </div>
          </div>
        </div>

        {/* Live Active Drawing State Indicator */}
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
            isDrawing 
              ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
              : 'bg-emerald-600 text-white'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDrawing ? 'bg-white' : 'bg-emerald-300'}`} />
            {isDrawing ? 'Drawing Active (Ads Blocked)' : 'Canvas Idle (Ads Permitted)'}
          </div>

          <button
            onClick={handleAttemptShowInterstitial}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Simulate interstitial ad trigger to test stroke guard"
          >
            <Tv className="w-3.5 h-3.5 text-amber-400" />
            Test Interstitial Ad
          </button>
        </div>
      </div>

      {/* Drawing Alert Toast for Interstitial Block */}
      {adSuppressionAlert && (
        <div className="bg-rose-100 border-b border-rose-300 text-rose-900 px-4 py-2.5 text-xs font-medium flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{adSuppressionAlert}</span>
          </div>
          <button
            onClick={() => setAdSuppressionAlert(null)}
            className="text-rose-700 hover:text-rose-900 font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Coloring Book Carousel Selector */}
      <div className="bg-amber-100/60 px-4 py-2.5 border-b border-amber-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-amber-900 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          Pages:
        </span>

        {coloringSheets.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => {
              if (sheet.locked) {
                onRequestUnlock(sheet.name, 'Rewarded Video Ad');
              } else {
                setSelectedPage(sheet.name);
              }
            }}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              selectedPage === sheet.name
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-600'
                : sheet.locked
                ? 'bg-slate-200 text-slate-600 hover:bg-amber-200 border border-slate-300'
                : 'bg-white text-slate-800 hover:bg-amber-200'
            }`}
          >
            <span>{sheet.icon}</span>
            <span>{sheet.name}</span>
            {sheet.locked && (
              <span className="flex items-center gap-0.5 text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                <Lock className="w-2.5 h-2.5" />
                Bonus Ad
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Drawing Tools & Palette Toolbar */}
      <div className="bg-white px-4 py-3 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
        {/* Colors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {palette.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setCurrentColor(c.hex);
                setIsEraser(false);
                setIsRainbow(false);
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                currentColor === c.hex && !isEraser && !isRainbow
                  ? 'scale-125 ring-3 ring-offset-2 ring-slate-800 shadow-md'
                  : 'hover:scale-110 opacity-90 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}

          {/* Rainbow Magic Brush */}
          <button
            onClick={() => {
              setIsRainbow(true);
              setIsEraser(false);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isRainbow
                ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-white shadow-md scale-105 ring-2 ring-purple-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Rainbow
          </button>
        </div>

        {/* Brush Size & Actions */}
        <div className="flex items-center gap-2">
          {/* Eraser */}
          <button
            onClick={() => {
              setIsEraser(!isEraser);
              setIsRainbow(false);
            }}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isEraser
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Eraser tool"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Brush Sizes */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            {[4, 8, 14, 24].map((size) => (
              <button
                key={size}
                onClick={() => setBrushWidth(size)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  brushWidth === size ? 'bg-white shadow-sm font-bold text-slate-900' : 'text-slate-400 hover:text-slate-700'
                }`}
                title={`Brush size ${size}px`}
              >
                <div 
                  className="rounded-full bg-slate-800"
                  style={{ width: `${Math.max(size / 3, 3)}px`, height: `${Math.max(size / 3, 3)}px` }}
                />
              </button>
            ))}
          </div>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Undo last stroke"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Canvas Drawing Surface */}
      <div className="relative w-full bg-white select-none touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-[400px] sm:h-[460px] block"
        />

        {/* Subtle Watermark on Drawing Canvas */}
        <div className="absolute top-3 right-3 pointer-events-none text-xs text-slate-300 font-semibold select-none flex items-center gap-1">
          <span>Toddler Canvas Area</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. MANDATORY TODDLER SAFETY SEPARATOR BUFFER ZONE                   */}
      {/* Strict physical isolation between drawing canvas and banner ad     */}
      {/* ------------------------------------------------------------------ */}
      <div 
        onClick={() => setBufferTaps((c) => c + 1)}
        className="w-full bg-amber-100/90 border-t-2 border-b-2 border-amber-300 py-1.5 px-4 flex items-center justify-between text-[11px] font-semibold text-amber-900 cursor-default select-none"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Physical Isolation Buffer (Google Play Families Safety Separator)</span>
        </div>
        <div className="text-amber-800 text-[10px]">
          Prevents Toddler Misclicks During Scribbling {bufferTaps > 0 && `(Buffer protected ${bufferTaps} taps)`}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. BOTTOM-ANCHORED CHILD-SAFE ADMOB BANNER AD                      */}
      {/* Strict child-safe G-Rated AdMob Banner                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-slate-100 px-4 py-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Banner Mock with AdMob Test Styling */}
        <div className="w-full max-w-[468px] h-[60px] bg-white border-2 border-dashed border-slate-300 rounded-xl px-3 py-1 flex items-center justify-between shadow-sm relative overflow-hidden">
          {/* AdMob Test Watermark */}
          <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-bl">
            AdMob Test Banner
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🚂
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">Toy Train Sandbox</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 rounded">
                  G-Rated
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Fun family-safe building puzzle for kids</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-slate-400 block font-mono">NPA Active</span>
            <span className="inline-block text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
              Play Safe
            </span>
          </div>
        </div>

        {/* AdMob Specs Verification */}
        <div className="text-right hidden md:block text-xs">
          <div className="text-[10px] font-mono text-slate-500">Unit: {config.androidBannerUnitId.slice(0, 24)}...</div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
            <CheckCircle2 className="w-3 h-3" />
            AdSize.banner (320x50 / adaptive)
          </div>
        </div>
      </div>
    </div>
  );
};
