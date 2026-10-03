import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';

interface ParentalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  targetContentName: string;
  adFormatName: 'Rewarded Video Ad' | 'Interstitial Ad';
}

export const ParentalGateModal: React.FC<ParentalGateModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  targetContentName,
  adFormatName,
}) => {
  const [numA, setNumA] = useState<number>(4);
  const [numB, setNumB] = useState<number>(3);
  const [options, setOptions] = useState<number[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Generate randomized arithmetic problem when opened
  useEffect(() => {
    if (isOpen) {
      generateQuestion();
    }
  }, [isOpen]);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const b = Math.floor(Math.random() * 7) + 2; // 2 to 8
    const sum = a + b;

    setNumA(a);
    setNumB(b);

    const generatedOptions = new Set<number>([sum]);
    while (generatedOptions.size < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
      const val = sum + offset;
      if (val > 0 && val !== sum) {
        generatedOptions.add(val);
      }
    }

    // Shuffle options
    const shuffled = Array.from(generatedOptions).sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setHasError(false);
    setErrorMessage('');
  };

  if (!isOpen) return null;

  const handleOptionClick = (selectedVal: number) => {
    const correctAnswer = numA + numB;
    if (selectedVal === correctAnswer) {
      setHasError(false);
      onVerified();
    } else {
      setHasError(true);
      setErrorMessage('Incorrect answer. Please ask a grown-up for help.');
      // Regenerate after a short delay
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border-4 border-amber-400 transition-transform ${
          hasError ? 'animate-shake' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close Parental Gate"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Parental Gate</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Adult Verification Required</p>
          </div>
        </div>

        {/* Policy Explainer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">
            Unlocking: <span className="text-blue-600">{targetContentName}</span>
          </p>
          <p>
            Under Google Play Families Policy, child users must not trigger external commercial ad impressions without an adult parental gate verification.
          </p>
          <p className="text-slate-500">
            Ad Type: <span className="font-medium text-slate-700">{adFormatName}</span> (G-Rated, Non-Personalized)
          </p>
        </div>

        {/* Arithmetic Question */}
        <div className="text-center py-4 bg-gradient-to-b from-amber-50/50 to-orange-50/40 rounded-2xl border border-amber-200/60 mb-5">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest">Solve to Continue</span>
          <div className="text-4xl font-extrabold text-slate-900 mt-1 tracking-wider">
            {numA} + {numB} = ?
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-amber-500 hover:text-white border-2 border-slate-200 hover:border-amber-600 text-2xl font-bold text-slate-800 shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              {option}
            </button>
          ))}
        </div>

        {/* Error Feedback */}
        {hasError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-4"
          >
            Cancel and return to drawing
          </button>
        </div>
      </div>
    </div>
  );
};
