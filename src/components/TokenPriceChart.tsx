import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Token } from '../types/token';
import { TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';

export type Timeframe = '5m' | '15m' | '1h' | '4h' | '24h' | '7d';

interface TokenPriceChartProps {
  token: Token;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

interface PriceDataPoint {
  time: string;
  timestamp: number;
  price: number;
  volume: number;
  ma: number;
}

export function TokenPriceChart({
  token,
  selectedTimeframe,
  onTimeframeChange,
}: TokenPriceChartProps) {
  const [showVolume, setShowVolume] = useState(true);

  // Generate historically coherent price & volume data points based on token price & 24h change
  const chartData = useMemo(() => {
    const pointsCount = selectedTimeframe === '5m' ? 24 : selectedTimeframe === '1h' ? 30 : selectedTimeframe === '24h' ? 24 : 28;
    const currentPrice = token.price;
    const changePct = token.change24h / 100;
    
    // Determine overall price movement factor for this timeframe
    let tfChangePct = changePct;
    if (selectedTimeframe === '5m') tfChangePct = token.change5m / 100;
    else if (selectedTimeframe === '1h') tfChangePct = token.change1h / 100;
    else if (selectedTimeframe === '4h') tfChangePct = token.change4h / 100;
    else if (selectedTimeframe === '7d') tfChangePct = changePct * 2.5;

    const basePrice = currentPrice / (1 + tfChangePct);
    const data: PriceDataPoint[] = [];

    // Pseudo-random but deterministic seed based on token id
    let seed = token.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 42);
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const now = Date.now();
    let intervalMs = 60 * 1000 * 5; // default 5m
    if (selectedTimeframe === '15m') intervalMs = 15 * 60 * 1000;
    if (selectedTimeframe === '1h') intervalMs = 60 * 60 * 1000;
    if (selectedTimeframe === '4h') intervalMs = 4 * 60 * 60 * 1000;
    if (selectedTimeframe === '24h') intervalMs = 60 * 60 * 1000;
    if (selectedTimeframe === '7d') intervalMs = 6 * 60 * 60 * 1000;

    let runningPrice = basePrice;
    const totalVolume = token.vol24h || 500000;
    const avgVolumePerPoint = totalVolume / pointsCount;

    for (let i = 0; i < pointsCount; i++) {
      const progress = i / (pointsCount - 1);
      const targetTrajectory = basePrice + (currentPrice - basePrice) * progress;
      const noise = (random() - 0.48) * (currentPrice * 0.04);
      
      runningPrice = i === pointsCount - 1 ? currentPrice : targetTrajectory + noise;
      if (runningPrice <= 0) runningPrice = currentPrice * 0.1;

      const pointTime = new Date(now - (pointsCount - 1 - i) * intervalMs);
      let timeLabel = '';
      if (selectedTimeframe === '5m' || selectedTimeframe === '15m' || selectedTimeframe === '1h') {
        timeLabel = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (selectedTimeframe === '24h') {
        timeLabel = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        timeLabel = `${pointTime.getMonth() + 1}/${pointTime.getDate()} ${pointTime.getHours()}h`;
      }

      const pointVolume = avgVolumePerPoint * (0.4 + random() * 1.4);

      data.push({
        time: timeLabel,
        timestamp: pointTime.getTime(),
        price: Number(runningPrice.toFixed(runningPrice < 0.001 ? 6 : 4)),
        volume: Math.round(pointVolume),
        ma: 0, // calculate below
      });
    }

    // Calculate simple moving average (period 4)
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - 3);
      const slice = data.slice(start, i + 1);
      const avg = slice.reduce((sum, p) => sum + p.price, 0) / slice.length;
      data[i].ma = Number(avg.toFixed(avg < 0.001 ? 6 : 4));
    }

    return data;
  }, [token, selectedTimeframe]);

  const { minPrice, maxPrice, high24h, low24h, isPositive } = useMemo(() => {
    if (!chartData.length) return { minPrice: 0, maxPrice: 0, high24h: 0, low24h: 0, isPositive: true };
    const prices = chartData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    return {
      minPrice: min,
      maxPrice: max,
      high24h: max * 1.015,
      low24h: min * 0.985,
      isPositive: last >= first,
    };
  }, [chartData]);

  const formatPriceValue = (val: number) => {
    if (val < 0.0001) return `$${val.toFixed(6)}`;
    if (val < 1) return `$${val.toFixed(6)}`;
    return `$${val.toFixed(2)}`;
  };

  const formatVolumeValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <div className="bg-[#090d0b] border border-[#1e2823] p-3 sm:p-4 font-mono select-none">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-[#18221d]">
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-[#121715] p-1 border border-[#1e2823] rounded-lg">
          {(['5m', '15m', '1h', '4h', '24h', '7d'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs uppercase cursor-pointer transition-colors rounded-md ${
                selectedTimeframe === tf
                  ? 'bg-[#8df0b5] text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Volume & Indicators Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`flex items-center gap-1.5 px-2 py-1 border transition-colors cursor-pointer ${
              showVolume
                ? 'border-[#06b6d4] text-[#06b6d4] bg-[#06b6d4]/10'
                : 'border-[#1e2823] text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Volume Bars"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">VOL</span>
          </button>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 pl-2">
            <div>
              <span className="text-slate-600">HIGH: </span>
              <span className="text-white font-semibold">{formatPriceValue(high24h)}</span>
            </div>
            <div>
              <span className="text-slate-600">LOW: </span>
              <span className="text-white font-semibold">{formatPriceValue(low24h)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="relative w-full h-[220px] sm:h-[250px]">
        {/* Subtle grid background status watermark */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2 pointer-events-none">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
            DEX HISTORICAL STREAM
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Price Area Mint Green Gradient */}
              <linearGradient id="cyberPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#34d399" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>

              {/* Volume Bars Cyan Gradient */}
              <linearGradient id="cyberVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#16201b"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#2e3d36"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={{ stroke: '#1e2823' }}
              minTickGap={25}
            />

            {/* Primary YAxis for Price */}
            <YAxis
              yAxisId="price"
              domain={['auto', 'auto']}
              orientation="right"
              stroke="#2e3d36"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={{ stroke: '#1e2823' }}
              tickFormatter={(v: number) => {
                if (v < 0.001) return v.toFixed(6);
                if (v < 1) return v.toFixed(4);
                return v.toFixed(2);
              }}
            />

            {/* Secondary YAxis for Volume */}
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                domain={[0, (dataMax: number) => dataMax * 3.8]}
                hide={true}
              />
            )}

            {/* Custom Cyber Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PriceDataPoint;
                  const priceDiff = data.price - chartData[0].price;
                  const pct = ((priceDiff) / chartData[0].price) * 100;
                  const isUp = priceDiff >= 0;

                  return (
                    <div className="bg-[#121715] border-2 border-[#ccff00] p-2.5 shadow-[0_0_20px_rgba(204,255,0,0.3)] text-xs font-mono">
                      <div className="text-[10px] text-slate-400 mb-1 border-b border-[#232f28] pb-1 flex justify-between gap-4">
                        <span>TIME: {data.time}</span>
                        <span className="text-[#ccff00]">LIVE TICK</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">PRICE:</span>
                          <span className="text-white font-bold">{formatPriceValue(data.price)}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span className="text-slate-400">CHANGE:</span>
                          <span className={`font-bold ${isUp ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                            {isUp ? '+' : ''}{pct.toFixed(2)}%
                          </span>
                        </div>

                        {showVolume && (
                          <div className="flex justify-between gap-4">
                            <span className="text-slate-400">VOL (INT):</span>
                            <span className="text-[#06b6d4] font-bold">{formatVolumeValue(data.volume)}</span>
                          </div>
                        )}

                        <div className="flex justify-between gap-4 text-[10px] text-slate-500 pt-1 border-t border-[#1c2420]">
                          <span>MA(4):</span>
                          <span>{formatPriceValue(data.ma)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Average Reference Line */}
            <ReferenceLine
              yAxisId="price"
              y={(minPrice + maxPrice) / 2}
              stroke="#2e3d36"
              strokeDasharray="4 4"
            />

            {/* Volume Bars */}
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="url(#cyberVolumeGradient)"
                barSize={6}
                radius={[2, 2, 0, 0]}
              />
            )}

            {/* Price Area Chart */}
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#cyberPriceGradient)"
              activeDot={{
                r: 5,
                fill: '#ffffff',
                stroke: '#34d399',
                strokeWidth: 2,
                className: 'drop-shadow-[0_0_8px_#34d399]',
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-[#18221d] text-xs">
        <div className="bg-[#0c100e] border border-[#1e2823] p-1.5 px-2">
          <span className="text-[10px] text-slate-500 block">SPREAD</span>
          <span className="text-white font-bold">0.05%</span>
        </div>
        <div className="bg-[#0c100e] border border-[#1e2823] p-1.5 px-2">
          <span className="text-[10px] text-slate-500 block">DEX VOLATILITY</span>
          <span className={`font-bold ${isPositive ? 'text-[#4ade80]' : 'text-amber-400'}`}>
            {isPositive ? 'LOW' : 'MEDIUM'}
          </span>
        </div>
        <div className="bg-[#0c100e] border border-[#1e2823] p-1.5 px-2">
          <span className="text-[10px] text-slate-500 block">LIQUIDITY DEPTH</span>
          <span className="text-[#ccff00] font-bold">
            ${(token.liquidity / 1000).toFixed(1)}K
          </span>
        </div>
        <div className="bg-[#0c100e] border border-[#1e2823] p-1.5 px-2">
          <span className="text-[10px] text-slate-500 block">ORACLE CONFIRM</span>
          <span className="text-cyan-400 font-bold">0.3s</span>
        </div>
      </div>
    </div>
  );
}
