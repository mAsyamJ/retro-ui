import React, { useState } from 'react';
import { Settings, X, SlidersHorizontal, ShieldCheck, Zap, Bell, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [slippage, setSlippage] = useState('1.0');
  const [mevProtection, setMevProtection] = useState(true);
  const [fastExecution, setFastExecution] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c100e] border border-[#1b2620] rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-[#16201b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b2520] border border-[#27372e] flex items-center justify-center text-[#8df0b5]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Trading Preferences</h3>
              <p className="text-xs text-slate-400">Configure slippage and protocol execution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#16201b] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* Slippage */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Default Slippage Tolerance</label>
            <div className="grid grid-cols-4 gap-2">
              {['0.5', '1.0', '2.5', '5.0'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSlippage(val)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    slippage === val
                      ? 'bg-[#8df0b5] text-black shadow-[0_0_12px_rgba(141,240,181,0.2)]'
                      : 'bg-[#121815] text-slate-300 border border-[#1f2a23] hover:border-slate-500'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* MEV Protection */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101613] border border-[#1b2620]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8df0b5]" />
              <div>
                <span className="font-semibold text-white block text-xs">Anti-MEV Frontrunning</span>
                <span className="text-[11px] text-slate-400">Route via private mempools</span>
              </div>
            </div>
            <button
              onClick={() => setMevProtection(!mevProtection)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                mevProtection ? 'bg-[#8df0b5]' : 'bg-[#1c2621]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  mevProtection ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Fast execution */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101613] border border-[#1b2620]">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-semibold text-white block text-xs">Turbo Gas Priority</span>
                <span className="text-[11px] text-slate-400">Increase bribe for 1-block fills</span>
              </div>
            </div>
            <button
              onClick={() => setFastExecution(!fastExecution)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                fastExecution ? 'bg-[#8df0b5]' : 'bg-[#1c2621]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  fastExecution ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Sound notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#101613] border border-[#1b2620]">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-semibold text-white block text-xs">Sound Alerts</span>
                <span className="text-[11px] text-slate-400">Chime on order fills & target triggers</span>
              </div>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundEffects ? 'bg-[#8df0b5]' : 'bg-[#1c2621]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-black transition-transform absolute top-1 ${
                  soundEffects ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-[#16201b] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#8df0b5] hover:bg-[#7ceaa8] text-black font-bold text-xs rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(141,240,181,0.25)]"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
