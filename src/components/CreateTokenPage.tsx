import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  FileText,
  Upload,
  ArrowRight,
  Shield,
  Coins,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Zap,
  Layers,
  Lock,
  Fuel,
  TrendingUp,
  Cpu,
  Share2
} from 'lucide-react';
import { BnbIcon, NvidiaIcon, AppleIcon, TeslaIcon, MicrosoftIcon, GoogleIcon } from './Icons';
import { Token, WalletState } from '../types/token';

interface CreateTokenPageProps {
  onBack: () => void;
  onTokenCreated: (token: Token) => void;
  onOpenReserveCa: () => void;
  reservedCa: string | null;
  wallet: WalletState;
  onOpenWalletModal: () => void;
}

export function CreateTokenPage({
  onBack,
  onTokenCreated,
  onOpenReserveCa,
  reservedCa,
  wallet,
  onOpenWalletModal,
}: CreateTokenPageProps) {
  // Form State
  const [tokenName, setTokenName] = useState('Flap Cyber Doge');
  const [tokenSymbol, setTokenSymbol] = useState('FDOGE');
  const [network, setNetwork] = useState('BSC');
  const [description, setDescription] = useState(
    'Algorithmic meme token with automated liquidity burning and real-world asset dividends in synthetic NVIDIA equity.'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80'
  );
  const [buyTax, setBuyTax] = useState<number>(1);
  const [sellTax, setSellTax] = useState<number>(2);
  const [rwaRewardAsset, setRwaRewardAsset] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'GOOGL' | 'MSFT'>('NVDA');
  const [telegram, setTelegram] = useState('https://t.me/flapdoge');
  const [twitter, setTwitter] = useState('https://x.com/flapdoge');
  const [website, setWebsite] = useState('https://flapdoge.io');
  const [initialLiquidity, setInitialLiquidity] = useState('1.5');
  const [maxWallet, setMaxWallet] = useState('2.0');

  // Deployment simulation state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [createdTokenData, setCreatedTokenData] = useState<Token | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&h=200&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=200&h=200&fit=crop&q=80',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeployToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenName.trim()) {
      alert("Please specify a Token Name.");
      return;
    }
    if (!tokenSymbol.trim()) {
      alert("Please specify a Token Symbol.");
      return;
    }

    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }

    setIsDeploying(true);
    setDeployStep(1); // Compiling Solidity byte-code

    setTimeout(() => {
      setDeployStep(2); // Mining & Binding Contract Address
    }, 1100);

    setTimeout(() => {
      setDeployStep(3); // Setting up PancakeSwap V3 Liquidity Pool & RWA Oracle
    }, 2200);

    setTimeout(() => {
      setDeployStep(4); // Launch confirmed
      const contract = reservedCa || `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const symbolFormatted = tokenSymbol.startsWith('$') ? tokenSymbol.toUpperCase() : `$${tokenSymbol.toUpperCase()}`;

      const newToken: Token = {
        id: `token-${Date.now()}`,
        symbol: symbolFormatted,
        name: tokenName,
        icon: imagePreview || presetImages[0],
        price: 0.00035,
        payToken: 'BNB',
        payTokenIcon: 'bnb',
        mcap: 35000,
        buyTax: buyTax,
        sellTax: sellTax,
        vol24h: 3400,
        holders: 1,
        liquidity: parseFloat(initialLiquidity) * 580,
        change5m: 0,
        change1h: 0,
        change4h: 0,
        change24h: 0,
        category: 'bonding',
        bondingProgress: 14.8,
        rwaAsset: rwaRewardAsset,
        rwaYieldApy: 26.5,
        auditScore: 100,
        sparkline: [25, 28, 30, 32, 35, 34, 38, 42, 45, 48, 50],
        contractAddress: contract,
        description: description || `${tokenName} launched on FLAP Foundry.`,
        website: website || undefined,
        twitter: twitter || undefined,
        telegram: telegram || undefined,
        createdAt: new Date().toISOString(),
        verified: false,
        hasGTag: true
      };

      setCreatedTokenData(newToken);
      setDeploySuccess(true);
      setIsDeploying(false);
      onTokenCreated(newToken);
    }, 3500);
  };

  return (
    <div className="w-full bg-[#08090d] min-h-screen text-slate-100 bg-mesh-dark pb-24">
      {/* Top Banner Navigation */}
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121622] border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
              title="Return to screener"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Token Foundry Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                  BNB CHAIN COMPILER
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Generate, reserve, and deploy custom auditable tax tokens with real-world asset reflection mechanics.
              </p>
            </div>
          </div>

          {/* Reserved CA quick trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenReserveCa}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121622] hover:bg-[#181e2e] border border-white/[0.1] text-xs font-mono text-slate-200 hover:text-emerald-400 transition-all cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{reservedCa ? `CA: ${reservedCa.slice(0, 6)}...${reservedCa.slice(-4)}` : 'Reserve Vanity Address (CA)'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 lg:px-6">
        <form onSubmit={handleDeployToken} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Token Identity */}
            <div className="bg-[#0e121a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-display font-bold text-xs">
                    01
                  </div>
                  <h2 className="font-display font-bold text-base text-white">
                    Token Identity &amp; Branding
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">Step 1 of 3</span>
              </div>

              {/* Logo Drag-Drop & Name/Symbol inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Logo Box (4 cols) */}
                <div className="sm:col-span-4">
                  <label className="block text-xs font-mono text-slate-400 mb-2">
                    TOKEN LOGO / AVATAR
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group border-2 border-dashed border-white/[0.12] hover:border-emerald-500/50 bg-black/40 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square text-center cursor-pointer transition-all overflow-hidden"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-mono text-emerald-400 transition-opacity">
                          Change Logo
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2 text-slate-400">
                        <Upload className="w-6 h-6 text-emerald-400 mb-2" />
                        <span className="text-xs font-medium text-white">Upload Avatar</span>
                        <span className="text-[10px] text-slate-500 mt-1">PNG, JPG, WebP</span>
                      </div>
                    )}
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {presetImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImagePreview(img)}
                        className="w-7 h-7 rounded-lg border border-white/[0.1] hover:border-emerald-500 overflow-hidden cursor-pointer"
                      >
                        <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields (8 cols) */}
                <div className="sm:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      TOKEN NAME <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flap Cyber Doge"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      required
                      className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white px-3.5 py-2.5 rounded-xl outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        SYMBOL (TICKER) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="FDOGE"
                        value={tokenSymbol}
                        onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                        required
                        className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white px-3.5 py-2.5 rounded-xl outline-none font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        BLOCKCHAIN NETWORK
                      </label>
                      <div className="w-full bg-[#121622] border border-white/[0.08] px-3 py-2.5 rounded-xl text-xs text-white flex items-center justify-between font-mono">
                        <div className="flex items-center gap-1.5">
                          <BnbIcon className="w-4 h-4" />
                          <span className="font-bold">BSC Mainnet</span>
                        </div>
                        <span className="text-[10px] text-emerald-400">Gas: 3 Gwei</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      TOKEN DESCRIPTION &amp; LORE
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your meme token lore, RWA strategy, and community goals..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs text-white p-3 rounded-xl outline-none font-sans resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Tax & RWA Engine */}
            <div className="bg-[#0e121a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-display font-bold text-xs">
                    02
                  </div>
                  <h2 className="font-display font-bold text-base text-white">
                    Tax Engine &amp; RWA Equity Reflection
                  </h2>
                </div>
                <span className="text-xs font-mono text-emerald-400">Automated Smart Contract</span>
              </div>

              {/* Tax Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-300">Buy Tax (%)</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      {buyTax}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={buyTax}
                    onChange={(e) => setBuyTax(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">Deducted when traders purchase from PancakeSwap.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-300">Sell Tax (%)</span>
                    <span className="text-xs font-mono text-rose-400 font-bold px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                      {sellTax}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="0.5"
                    value={sellTax}
                    onChange={(e) => setSellTax(parseFloat(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">Distributed to holder wallets as RWA synthetic equity.</p>
                </div>
              </div>

              {/* RWA Equity Picker */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <label className="block text-xs font-mono text-slate-300 mb-2">
                  TARGET RWA SYNTHETIC ASSET (HOLDER REWARDS)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['NVDA', 'AAPL', 'TSLA', 'GOOGL', 'MSFT'] as const).map((asset) => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setRwaRewardAsset(asset)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        rwaRewardAsset === asset
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                          : 'bg-[#121622] border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      {asset === 'NVDA' && <NvidiaIcon className="w-5 h-5 mb-1" />}
                      {asset === 'AAPL' && <AppleIcon className="w-5 h-5 mb-1" />}
                      {asset === 'TSLA' && <TeslaIcon className="w-5 h-5 mb-1" />}
                      {asset === 'GOOGL' && <GoogleIcon className="w-5 h-5 mb-1" />}
                      {asset === 'MSFT' && <MicrosoftIcon className="w-5 h-5 mb-1" />}
                      <span className="text-xs font-mono">{asset}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5">
                  Every trade automatically purchases fractional shares of <strong>{rwaRewardAsset}</strong> via the BSC synthetic oracle and streams it to holders hourly.
                </p>
              </div>
            </div>

            {/* Step 3: Socials & Anti-Whale Parameters */}
            <div className="bg-[#0e121a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-display font-bold text-xs">
                    03
                  </div>
                  <h2 className="font-display font-bold text-base text-white">
                    Liquidity Curve &amp; Community Links
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Telegram Community</label>
                  <input
                    type="url"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="https://t.me/..."
                    className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 text-xs text-white p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Twitter / X Handle</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/..."
                    className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 text-xs text-white p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Official Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#121622] border border-white/[0.08] focus:border-emerald-500 text-xs text-white p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Launch Action Bar */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-black/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Non-Custodial Liquidity Lock</h4>
                  <p className="text-[11px] text-slate-400">100% of initial LP is permanently burned or locked on BSC.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isDeploying}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-display font-extrabold text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeploying ? 'Deploying to BSC...' : 'Deploy Smart Contract Now →'}
              </button>
            </div>
          </div>

          {/* Right Live Token Preview: 5 Columns */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-[#0e121a] border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> LIVE TOKEN CARD PREVIEW
                </span>
                <span className="text-[10px] font-mono text-slate-500">Real-Time Screener Preview</span>
              </div>

              {/* Rendered Live Card */}
              <div className="bg-[#131722] border border-white/[0.1] rounded-2xl p-5 shadow-inner">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/[0.1] overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-emerald-400 text-sm">
                          {tokenSymbol.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-base text-white">
                          ${tokenSymbol || 'SYMBOL'}
                        </span>
                        <span className="w-4 h-4 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center justify-center font-bold">
                          G
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{tokenName || 'Token Name'}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    +0.00%
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans line-clamp-2 mb-4 leading-relaxed">
                  {description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-500 block">INITIAL MCAP</span>
                    <span className="font-bold text-white">$35,000 USD</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                    <span className="text-[10px] text-slate-500 block">TAX RATE</span>
                    <span className="font-bold text-emerald-400">{buyTax}% Buy / {sellTax}% Sell</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">RWA Reflection Target</span>
                  <span className="text-cyan-400 font-bold">{rwaRewardAsset} Synthetics</span>
                </div>
              </div>

              {/* Contract Deployment Info */}
              <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/[0.04] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Contract Standard:</span>
                  <span className="text-white">BEP-20 (Tax Reflection)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Network:</span>
                  <span className="text-white">BNB Smart Chain (BSC)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vanity Address:</span>
                  <span className="text-emerald-400">
                    {reservedCa ? `${reservedCa.slice(0, 8)}...${reservedCa.slice(-6)}` : 'Auto-Mined at deploy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Deployment Modal Progress */}
      {isDeploying && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e121a] border border-emerald-500/40 rounded-3xl p-7 font-mono shadow-2xl">
            <h3 className="font-display font-extrabold text-lg text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
              COMPILING &amp; DEPLOYING...
            </h3>

            <div className="space-y-3 mb-6 text-xs">
              <div className={`flex items-center gap-2.5 ${deployStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{deployStep > 1 ? '✓' : '▶'}</span>
                <span>Compiling Solidity 0.8.24 Smart Contract bytecode...</span>
              </div>
              <div className={`flex items-center gap-2.5 ${deployStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{deployStep > 2 ? '✓' : deployStep === 2 ? '▶' : '○'}</span>
                <span>Binding Contract Address ({reservedCa ? 'Reserved CA' : 'Mining vanity address'})...</span>
              </div>
              <div className={`flex items-center gap-2.5 ${deployStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{deployStep > 3 ? '✓' : deployStep === 3 ? '▶' : '○'}</span>
                <span>Seeding PancakeSwap V3 Liquidity &amp; RWA Oracle...</span>
              </div>
              <div className={`flex items-center gap-2.5 ${deployStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}`}>
                <span>{deployStep >= 4 ? '✓' : '○'}</span>
                <span>Confirming transaction on BNB Chain block #38,912,412...</span>
              </div>
            </div>

            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${(deployStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Deployment Success Celebration */}
      {deploySuccess && createdTokenData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e121a] border border-emerald-500/40 rounded-3xl p-7 sm:p-8 font-mono shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white">
                TOKEN LIVE ON BNB CHAIN!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your token has been deployed and is ready for trading on FLAP and PancakeSwap.
              </p>
            </div>

            <div className="bg-black/50 border border-white/[0.08] rounded-2xl p-4 space-y-2.5 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">TOKEN:</span>
                <span className="text-white font-bold">{createdTokenData.name} ({createdTokenData.symbol})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CONTRACT ADDRESS:</span>
                <span className="text-emerald-400 break-all text-right ml-4">
                  {createdTokenData.contractAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RWA DIVIDEND:</span>
                <span className="text-cyan-400">{createdTokenData.rwaAsset} Synthetics</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setDeploySuccess(false);
                onBack();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer"
            >
              VIEW ON SCREENER TERMINAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
