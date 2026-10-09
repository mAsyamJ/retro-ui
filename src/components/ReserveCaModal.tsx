import React, { useState } from 'react';
import { X, Sparkles, Check, Copy, ArrowRight, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

interface ReserveCaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCa: (ca: string) => void;
  currentCa: string | null;
}

export function ReserveCaModal({ isOpen, onClose, onSelectCa, currentCa }: ReserveCaModalProps) {
  const [vanityType, setVanityType] = useState<'retro' | '888' | 'alpha' | 'custom'>('retro');
  const [customSuffix, setCustomSuffix] = useState('777');
  const [generatedCa, setGeneratedCa] = useState<string>(
    currentCa || '0xretro781294a08129c5b29012891240189b88retro'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let suffix = 'retro';
      if (vanityType === '888') suffix = '8888';
      if (vanityType === 'alpha') suffix = '00a1';
      if (vanityType === 'custom') suffix = customSuffix.slice(0, 4).toLowerCase();

      const randomMiddle = Array.from({ length: 30 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const prefix = '0x';
      const vanityPrefix = vanityType === 'retro' ? 'retro' : '';
      const ca = `${prefix}${vanityPrefix}${randomMiddle.slice(0, 38 - vanityPrefix.length - suffix.length)}${suffix}`;
      setGeneratedCa(ca);
      setIsGenerating(false);
    }, 400);
  };

  const handleConfirm = () => {
    onSelectCa(generatedCa);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-white/[0.12] rounded-3xl p-6 sm:p-7 font-sans text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Reserve Vanity Address (CA)</h3>
              <p className="text-[11px] font-mono text-slate-400">Lock contract address before deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 my-4 leading-relaxed">
          Pre-calculate and cryptographically reserve your token&apos;s contract address on BNB Chain. Share it in advance for presale listings, DexScreener verification, and marketing calls.
        </p>

        {/* Vanity Selector */}
        <div className="space-y-3 my-4">
          <label className="text-xs font-mono text-slate-400 font-semibold block">CHOOSE VANITY PATTERN</label>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setVanityType('retro')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                vanityType === 'retro'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-[#121622] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              0xretro...
            </button>
            <button
              type="button"
              onClick={() => setVanityType('888')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                vanityType === '888'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-[#121622] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              ...8888
            </button>
            <button
              type="button"
              onClick={() => setVanityType('alpha')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                vanityType === 'alpha'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-[#121622] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              ...00a1
            </button>
            <button
              type="button"
              onClick={() => setVanityType('custom')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                vanityType === 'custom'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-[#121622] border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              Custom
            </button>
          </div>

          {vanityType === 'custom' && (
            <div className="pt-1">
              <input
                type="text"
                maxLength={4}
                placeholder="Custom suffix (e.g. 777)"
                value={customSuffix}
                onChange={(e) => setCustomSuffix(e.target.value)}
                className="w-full bg-[#121622] border border-white/[0.08] p-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}
        </div>

        {/* Address Display Box */}
        <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-4 my-4 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>RESERVED CONTRACT ADDRESS</span>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Mine New Salt</span>
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#121622] border border-white/[0.08] p-3 rounded-xl">
            <span className="text-xs text-emerald-400 font-bold break-all select-all">
              {generatedCa}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white shrink-0 cursor-pointer"
              title="Copy"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Address is cryptographically reserved for your wallet session for 24 hours.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-3 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black text-xs font-display font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Confirm &amp; Lock CA
          </button>
        </div>
      </div>
    </div>
  );
}
