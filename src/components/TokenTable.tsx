import React from 'react';
import { ShieldCheck, ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Token } from '../types/token';
import { BnbIcon, SkhybIcon, BncbIcon } from './Icons';

interface TokenTableProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  onOpenTaxInfo: (token: Token, e: React.MouseEvent) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function TokenTable({
  tokens,
  onSelectToken,
  onOpenTaxInfo,
  sortField,
  sortDirection,
  onSort,
}: TokenTableProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(2)}`;
  };

  const renderPercentage = (val: number) => {
    const isPositive = val >= 0;
    return (
      <span
        className={`font-mono tabular-nums text-xs font-semibold ${
          isPositive ? 'text-[#4ade80]' : 'text-[#f87171]'
        }`}
      >
        {isPositive ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`}
      </span>
    );
  };

  const renderPayToken = (icon: 'bnb' | 'skhyb' | 'bncb' | 'eth' | 'sol', name: string) => {
    return (
      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
        {icon === 'bnb' && <BnbIcon className="w-3.5 h-3.5" />}
        {icon === 'skhyb' && <SkhybIcon className="w-3.5 h-3.5" />}
        {icon === 'bncb' && <BncbIcon className="w-3.5 h-3.5" />}
        {icon === 'eth' && <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />}
        {icon === 'sol' && <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195]" />}
        <span className="font-medium">{name}</span>
      </div>
    );
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return <span className="opacity-30 text-[10px] ml-1">↕</span>;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-[#ccff00] inline ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 text-[#ccff00] inline ml-1" />
    );
  };

  if (tokens.length === 0) {
    return (
      <div className="py-20 text-center font-mono">
        <p className="text-slate-400 text-sm mb-2">No tokens found matching this filter.</p>
        <p className="text-xs text-slate-600">Try adjusting your search query or category.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1100px]">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-[#1c2420] text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#0a0e0c]">
            <th
              className="py-3 px-4 font-semibold hover:text-white cursor-pointer select-none"
              onClick={() => onSort('name')}
            >
              COIN {renderSortIndicator('name')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('price')}
            >
              PRICE {renderSortIndicator('price')}
            </th>
            <th className="py-3 px-3 font-semibold">PAY TOKEN</th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('mcap')}
            >
              MCAP {renderSortIndicator('mcap')}
            </th>
            <th className="py-3 px-3 font-semibold text-center">TAX</th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('vol24h')}
            >
              24H VOL {renderSortIndicator('vol24h')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('holders')}
            >
              HOLDERS {renderSortIndicator('holders')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('liquidity')}
            >
              LIQ {renderSortIndicator('liquidity')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('change5m')}
            >
              5M {renderSortIndicator('change5m')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('change1h')}
            >
              1H {renderSortIndicator('change1h')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('change4h')}
            >
              4H {renderSortIndicator('change4h')}
            </th>
            <th
              className="py-3 px-3 font-semibold hover:text-white cursor-pointer select-none text-right"
              onClick={() => onSort('change24h')}
            >
              24H {renderSortIndicator('change24h')}
            </th>
            <th className="py-3 px-4 font-semibold text-right">TAX INFO</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#161e1a]">
          {tokens.map((token) => (
            <tr
              key={token.id}
              onClick={() => onSelectToken(token)}
              className="group hover:bg-[#121916] transition-colors cursor-pointer"
            >
              {/* COIN Column */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded bg-[#16201b] border border-[#23312a] overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-pixel text-[10px] text-[#ccff00] uppercase">
                      {token.symbol.slice(1, 3)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-white group-hover:text-[#ccff00] transition-colors">
                        {token.symbol}
                      </span>

                      {/* Verified Badge */}
                      {token.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                      )}

                      {/* G Tag Badge */}
                      {token.hasGTag && (
                        <span className="w-4 h-4 rounded-full border border-emerald-500/60 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          G
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[140px]">
                      {token.name}
                    </span>
                  </div>
                </div>
              </td>

              {/* PRICE */}
              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-100 font-medium">
                {formatPrice(token.price)}
              </td>

              {/* PAY TOKEN */}
              <td className="py-3 px-3">
                {renderPayToken(token.payTokenIcon, token.payToken)}
              </td>

              {/* MCAP */}
              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-200 font-medium">
                {formatCurrency(token.mcap)}
              </td>

              {/* TAX */}
              <td className="py-3 px-3 text-center">
                <button
                  onClick={(e) => onOpenTaxInfo(token, e)}
                  className="font-mono text-xs text-slate-300 hover:text-[#ccff00] border-b border-dotted border-slate-500 hover:border-[#ccff00] transition-colors cursor-pointer"
                >
                  {token.buyTax}%/{token.sellTax}%
                </button>
              </td>

              {/* 24H VOL */}
              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-300">
                {formatCurrency(token.vol24h)}
              </td>

              {/* HOLDERS */}
              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-300">
                {token.holders.toLocaleString()}
              </td>

              {/* LIQ */}
              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-300">
                {formatCurrency(token.liquidity)}
              </td>

              {/* 5M */}
              <td className="py-3 px-3 text-right">
                {renderPercentage(token.change5m)}
              </td>

              {/* 1H */}
              <td className="py-3 px-3 text-right">
                {renderPercentage(token.change1h)}
              </td>

              {/* 4H */}
              <td className="py-3 px-3 text-right">
                {renderPercentage(token.change4h)}
              </td>

              {/* 24H */}
              <td className="py-3 px-3 text-right">
                {renderPercentage(token.change24h)}
              </td>

              {/* TAX INFO */}
              <td className="py-3 px-4 text-right">
                <button
                  onClick={(e) => onOpenTaxInfo(token, e)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#ccff00] hover:underline hover:text-white transition-colors cursor-pointer"
                >
                  <span>TAX INFO</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
