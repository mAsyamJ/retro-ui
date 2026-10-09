import React from 'react';
import {
  Bell,
  X,
  Trash2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';
import { PriceAlert, Token } from '../types/token';

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceAlerts: PriceAlert[];
  onDeletePriceAlert: (id: string) => void;
  onSimulateTriggerAlert: (id: string) => void;
  onSelectTokenForTrade?: (token: Token) => void;
  tokens?: Token[];
}

export function PriceAlertsModal({
  isOpen,
  onClose,
  priceAlerts,
  onDeletePriceAlert,
  onSimulateTriggerAlert,
  onSelectTokenForTrade,
  tokens = [],
}: PriceAlertsModalProps) {
  if (!isOpen) return null;

  const activeAlerts = priceAlerts.filter((a) => a.status === 'active');
  const triggeredAlerts = priceAlerts.filter((a) => a.status === 'triggered');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c100e] border border-[#1b2620] rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#16201b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8df0b5]/15 border border-[#8df0b5]/30 flex items-center justify-center text-[#8df0b5]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Price Alerts</h3>
              <p className="text-xs text-slate-400">
                {activeAlerts.length} active notifications · Real-time DEX triggers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#16201b] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {priceAlerts.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#080b09] border border-dashed border-[#1a251f]">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white mb-1">No Price Alerts Configured</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Open any coin detail chart to set target alerts for automatic notifications when prices cross your threshold.
              </p>
            </div>
          ) : (
            <>
              {/* Active Alerts */}
              {activeAlerts.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                    <span>ACTIVE TARGETS ({activeAlerts.length})</span>
                    <span className="text-[#8df0b5]">Monitoring Live</span>
                  </div>

                  {activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-2xl bg-[#111714] border border-[#1c2721] hover:border-[#2b3c33] transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={alert.tokenIcon}
                          alt={alert.tokenSymbol}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#223129]"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white truncate">
                              {alert.tokenSymbol}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                alert.direction === 'above'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {alert.direction === 'above' ? (
                                <>
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Above</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-3 h-3" />
                                  <span>Below</span>
                                </>
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            Target: <span className="text-white font-bold">${alert.targetPrice < 0.001 ? alert.targetPrice.toFixed(6) : alert.targetPrice.toFixed(4)}</span>
                            {alert.note && <span className="text-slate-500 ml-2 italic truncate">"{alert.note}"</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onSimulateTriggerAlert(alert.id)}
                          className="px-2.5 py-1.5 bg-[#1b2520] hover:bg-[#8df0b5] hover:text-black text-[#8df0b5] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          title="Simulate Price Crossing Alert"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span className="hidden sm:inline">Test</span>
                        </button>
                        <button
                          onClick={() => onDeletePriceAlert(alert.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Triggered Alerts */}
              {triggeredAlerts.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                    <span>TRIGGERED HISTORY ({triggeredAlerts.length})</span>
                    <span className="text-slate-500">Recently reached</span>
                  </div>

                  {triggeredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-2xl bg-[#0a0e0c] border border-[#16201b] opacity-80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={alert.tokenIcon}
                          alt={alert.tokenSymbol}
                          className="w-8 h-8 rounded-full object-cover shrink-0 grayscale opacity-70"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-300 truncate">
                              {alert.tokenSymbol}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                              Triggered {alert.triggeredAt || 'earlier'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Target was ${alert.targetPrice < 0.001 ? alert.targetPrice.toFixed(6) : alert.targetPrice.toFixed(4)}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeletePriceAlert(alert.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#16201b] flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Alerts persist in browser local state</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-black font-bold rounded-full transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
