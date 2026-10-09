export interface Token {
  id: string;
  symbol: string;
  name: string;
  koreanName?: string;
  icon: string;
  verified?: boolean;
  hasGTag?: boolean;
  price: number;
  payToken: string;
  payTokenIcon: 'bnb' | 'skhyb' | 'bncb' | 'eth' | 'sol';
  mcap: number; // in USD
  ath?: number; // all-time-high USD
  age?: string; // e.g. "23m", "15m", "2mo", "3y"
  txns?: number; // total transactions count
  traders?: number; // unique traders count
  sparkline?: number[]; // normalized mini graph points
  chain?: 'solana' | 'base' | 'ethereum' | 'bsc' | 'arbitrum';
  creator?: {
    handle: string;
    avatar: string;
    verified?: boolean;
    earningsUsd?: number;
    followers?: string;
  };
  buyTax: number;
  sellTax: number;
  vol24h: number; // in USD
  holders: number;
  liquidity: number; // in USD
  change5m: number;
  change1h: number;
  change4h: number;
  change24h: number;
  category: 'movers' | 'new' | 'custom-pairs' | 'charities' | 'market-cap' | 'oldest' | 'last-trade' | 'trending' | 'seed-alpha' | 'stocks' | 'bonding' | 'listadao' | 'gift-token' | 'innovation' | 'low-risk';
  bondingProgress?: number; // 0 - 100%
  rwaAsset?: string; // e.g. "NVDA", "AAPL", "TSLA"
  rwaYieldApy?: number;
  auditScore?: number;
  contractAddress: string;
  description: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  createdAt: string;
}

export type CategoryTab = 
  | 'movers'
  | 'new'
  | 'custom-pairs'
  | 'charities'
  | 'market-cap'
  | 'oldest'
  | 'last-trade'
  | 'trending'
  | 'seed-alpha'
  | 'stocks'
  | 'bonding'
  | 'listadao'
  | 'gift-token'
  | 'innovation'
  | 'low-risk';

export type SidebarNavView = 'home' | 'earn' | 'trade' | 'create';

export interface PortfolioHolding {
  tokenId: string;
  token: Token;
  amount: number; // amount of tokens held
  avgBuyPrice: number; // cost basis per token in USD
  accumulatedRwaReward: {
    asset: 'NVDA' | 'AAPL' | 'TSLA' | 'GOOGL' | 'BNB';
    amount: number;
    valueUsd: number;
  };
  lastUpdated: string;
}

export interface PortfolioTransaction {
  id: string;
  type: 'buy' | 'sell' | 'claim_rwa' | 'create_token';
  tokenSymbol: string;
  tokenName: string;
  amount: number;
  valueUsd: number;
  txHash: string;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  tokenId: string;
  tokenSymbol: string;
  tokenName: string;
  tokenIcon: string;
  currentPriceAtCreation: number;
  targetPrice: number;
  direction: 'above' | 'below';
  status: 'active' | 'triggered';
  createdAt: string;
  triggeredAt?: string;
  note?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  balanceBNB: number;
}
