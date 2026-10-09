import React from 'react';

// Retro Distinctive Brandmark Logo
export function RetroLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="retroBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8df0b5" />
          <stop offset="50%" stopColor="#00ffa3" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="7" fill="#0d1410" stroke="#22392c" strokeWidth="1.5" />
      <path
        d="M9 8H17.8C20.8 8 23 10.05 23 12.6C23 14.85 21.3 16.65 19.1 17.05L23.5 24H18.8L14.9 18.2H13.2V24H9V8ZM13.2 11.6V15.2H17.3C18.4 15.2 19.2 14.4 19.2 13.4C19.2 12.4 18.4 11.6 17.3 11.6H13.2Z"
        fill="url(#retroBrandGrad)"
      />
    </svg>
  );
}

// Retro moneybag/terminal logo (BagsLogo alias for retro brand)
export function BagsLogo({ className = "w-7 h-7" }: { className?: string }) {
  return <RetroLogo className={className} />;
}

// Solana Gradient Icon
export function SolanaIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M26.2 86.8h78.3c1.7 0 3.3.7 4.5 1.9l16.1 16.1c2.1 2.1.6 5.7-2.3 5.7H44.5c-1.7 0-3.3-.7-4.5-1.9L23.9 92.5c-2.1-2.1-.6-5.7 2.3-5.7z" fill="#00FFA3"/>
      <path d="M26.2 17.5h78.3c1.7 0 3.3.7 4.5 1.9l16.1 16.1c2.1 2.1.6 5.7-2.3 5.7H44.5c-1.7 0-3.3-.7-4.5-1.9L23.9 23.2c-2.1-2.1-.6-5.7 2.3-5.7z" fill="#00FFA3"/>
      <path d="M101.8 52.2H23.5c-1.7 0-3.3.7-4.5 1.9L2.9 70.2c-2.1 2.1-.6 5.7 2.3 5.7h78.3c1.7 0 3.3-.7 4.5-1.9l16.1-16.1c2.1-2.1.6-5.7-2.3-5.7z" fill="#DC1FFF"/>
    </svg>
  );
}

// Base Blue Circle Icon
export function BaseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
      <path d="M55.5 28C70.6878 28 83 40.3122 83 55.5C83 70.6878 70.6878 83 55.5 83C40.3122 83 28 70.6878 28 55.5C28 40.3122 40.3122 28 55.5 28ZM55.5 35C44.1782 35 35 44.1782 35 55.5C35 66.8218 44.1782 76 55.5 76C66.8218 76 76 66.8218 76 55.5C76 44.1782 66.8218 35 55.5 35Z" fill="white" />
    </svg>
  );
}

// Ethereum Icon
export function EthereumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 3L7 17.5L16 23L25 17.5L16 3Z" fill="#627EEA"/>
      <path d="M16 24.5L7 19.5L16 30L25 19.5L16 24.5Z" fill="#627EEA"/>
      <path d="M16 3L16 17.5L25 17.5L16 3Z" fill="#8A92B2"/>
      <path d="M16 24.5L16 30L25 19.5L16 24.5Z" fill="#8A92B2"/>
    </svg>
  );
}

// Pixel art butterfly logo matching FLAP brand
export function FlapLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Pixelated butterfly wings */}
      <rect x="4" y="6" width="4" height="4" fill="#ccff00" />
      <rect x="8" y="10" width="4" height="4" fill="#ccff00" />
      <rect x="4" y="14" width="4" height="4" fill="#ccff00" />
      <rect x="24" y="6" width="4" height="4" fill="#ccff00" />
      <rect x="20" y="10" width="4" height="4" fill="#ccff00" />
      <rect x="24" y="14" width="4" height="4" fill="#ccff00" />
      <rect x="8" y="18" width="4" height="4" fill="#ccff00" />
      <rect x="20" y="18" width="4" height="4" fill="#ccff00" />
      <rect x="4" y="22" width="4" height="4" fill="#ccff00" />
      <rect x="24" y="22" width="4" height="4" fill="#ccff00" />
      <rect x="14" y="8" width="4" height="16" fill="#ccff00" />
    </svg>
  );
}

// Hero Big Pixel Art Butterfly (Gradient Violet / Cyan / Blue like in Screenshot 1)
export function HeroPixelButterfly({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left upper wing */}
      <rect x="4" y="10" width="6" height="6" fill="#6366f1" />
      <rect x="10" y="4" width="6" height="6" fill="#818cf8" />
      <rect x="16" y="4" width="6" height="6" fill="#06b6d4" />
      <rect x="10" y="10" width="6" height="6" fill="#06b6d4" />
      <rect x="16" y="10" width="6" height="6" fill="#38bdf8" />
      <rect x="22" y="10" width="6" height="6" fill="#818cf8" />
      <rect x="4" y="16" width="6" height="6" fill="#4f46e5" />
      <rect x="10" y="16" width="6" height="6" fill="#6366f1" />
      <rect x="16" y="16" width="6" height="6" fill="#22d3ee" />
      <rect x="22" y="16" width="6" height="6" fill="#6366f1" />
      {/* Left lower wing */}
      <rect x="10" y="28" width="6" height="6" fill="#4f46e5" />
      <rect x="16" y="28" width="6" height="6" fill="#6366f1" />
      <rect x="4" y="34" width="6" height="6" fill="#6366f1" />
      <rect x="10" y="34" width="6" height="6" fill="#06b6d4" />
      <rect x="16" y="34" width="6" height="6" fill="#38bdf8" />
      <rect x="22" y="34" width="6" height="6" fill="#818cf8" />
      <rect x="10" y="40" width="6" height="6" fill="#4f46e5" />
      <rect x="16" y="40" width="6" height="6" fill="#6366f1" />
      <rect x="4" y="46" width="6" height="6" fill="#818cf8" />
      <rect x="10" y="46" width="6" height="6" fill="#4f46e5" />

      {/* Center body */}
      <rect x="28" y="16" width="8" height="6" fill="#38bdf8" />
      <rect x="28" y="24" width="8" height="12" fill="#22d3ee" />
      <rect x="28" y="38" width="8" height="12" fill="#06b6d4" />
      
      {/* Right upper wing */}
      <rect x="54" y="10" width="6" height="6" fill="#6366f1" />
      <rect x="48" y="4" width="6" height="6" fill="#818cf8" />
      <rect x="42" y="4" width="6" height="6" fill="#06b6d4" />
      <rect x="48" y="10" width="6" height="6" fill="#06b6d4" />
      <rect x="42" y="10" width="6" height="6" fill="#38bdf8" />
      <rect x="36" y="10" width="6" height="6" fill="#818cf8" />
      <rect x="54" y="16" width="6" height="6" fill="#4f46e5" />
      <rect x="48" y="16" width="6" height="6" fill="#6366f1" />
      <rect x="42" y="16" width="6" height="6" fill="#22d3ee" />
      <rect x="36" y="16" width="6" height="6" fill="#6366f1" />
      {/* Right lower wing */}
      <rect x="48" y="28" width="6" height="6" fill="#4f46e5" />
      <rect x="42" y="28" width="6" height="6" fill="#6366f1" />
      <rect x="54" y="34" width="6" height="6" fill="#6366f1" />
      <rect x="48" y="34" width="6" height="6" fill="#06b6d4" />
      <rect x="42" y="34" width="6" height="6" fill="#38bdf8" />
      <rect x="36" y="34" width="6" height="6" fill="#818cf8" />
      <rect x="48" y="40" width="6" height="6" fill="#4f46e5" />
      <rect x="42" y="40" width="6" height="6" fill="#6366f1" />
      <rect x="54" y="46" width="6" height="6" fill="#818cf8" />
      <rect x="48" y="46" width="6" height="6" fill="#4f46e5" />
    </svg>
  );
}

// BNB Chain Yellow Hexagon Logo
export function BnbIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="16" fill="#F0B90B" />
      <path
        d="M16 6.5L19.7 10.2L13.8 16.1L10.1 12.4L16 6.5ZM21.9 12.4L25.6 16.1L21.9 19.8L18.2 16.1L21.9 12.4ZM16 25.7L10.1 19.8L13.8 16.1L19.7 22L16 25.7ZM10.1 19.8L6.4 16.1L10.1 12.4L13.8 16.1L10.1 19.8ZM16 13.9L18.1 16L16 18.1L13.9 16L16 13.9Z"
        fill="#0B0E0D"
      />
    </svg>
  );
}

// SKHYB Token Icon
export function SkhybIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="11" fill="#EA580C" />
      <path d="M7 12L12 7L17 12L12 17L7 12Z" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="2.5" fill="#EA580C" />
    </svg>
  );
}

// BNCB Token Icon
export function BncbIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="11" fill="#059669" />
      <rect x="8" y="8" width="8" height="8" rx="2" fill="#FFFFFF" />
      <circle cx="12" cy="12" r="2" fill="#059669" />
    </svg>
  );
}

// Nvidia Icon
export function NvidiaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-[#101010] flex items-center justify-center p-1 border border-emerald-900/40 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M12.2 4.5C8.3 4.5 5 7.1 3.5 10.8C4.5 8.2 7.2 6.3 10.3 6.3C14 6.3 17 9.1 17.3 12.8C18.6 11.2 19.4 9.2 19.4 7C17.4 5.4 14.9 4.5 12.2 4.5ZM3 12C3 13.8 3.6 15.4 4.6 16.8C6.1 13.6 9.2 11.4 12.8 11.4C14.7 11.4 16.5 12.1 17.8 13.4C17.9 12.9 18 12.5 18 12C18 9 15.8 6.5 12.8 6.5C8.8 6.5 5.3 8.9 3 12ZM12.8 13.1C10.7 13.1 9 14.8 9 16.9C9 17.5 9.1 18.1 9.4 18.6C10.3 19.2 11.5 19.6 12.8 19.6C16.4 19.6 19.4 16.8 19.7 13.2C17.8 13.1 15.2 13.1 12.8 13.1Z"
          fill="#76B900"
        />
      </svg>
    </div>
  );
}

// Apple Icon
export function AppleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-white flex items-center justify-center p-1 ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-black">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.93.04-2.02.63-2.66 1.38-.56.65-1.06 1.7-1.01 2.76 1.04.08 2.05-.52 2.66-1.27z" />
      </svg>
    </div>
  );
}

// Microsoft Icon
export function MicrosoftIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-[#101010] flex items-center justify-center p-1.5 border border-slate-800 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <rect x="2" y="2" width="9" height="9" fill="#F25022" />
        <rect x="13" y="2" width="9" height="9" fill="#7FBA00" />
        <rect x="2" y="13" width="9" height="9" fill="#00A4EF" />
        <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
      </svg>
    </div>
  );
}

// Google Icon
export function GoogleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-white flex items-center justify-center p-1 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
    </div>
  );
}

// Tesla Icon
export function TeslaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`rounded-full bg-[#E82127] flex items-center justify-center p-1 ${className}`}>
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
        <path d="M12 3.8C8.5 3.8 5.7 4.7 3.5 6.3L4.5 8C6.3 6.8 8.8 6 12 6c3.2 0 5.7.8 7.5 2l1-1.7C18.3 4.7 15.5 3.8 12 3.8zm0 4.6c-2.3 0-4.6.4-6.5 1.2l.6 1.7c1.7-.7 3.7-1 5.9-1 2.2 0 4.2.3 5.9 1l.6-1.7c-1.9-.8-4.2-1.2-6.5-1.2zM11 12v9h2v-9h-2z" />
      </svg>
    </div>
  );
}
