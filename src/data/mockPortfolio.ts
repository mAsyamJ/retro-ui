import { PortfolioHolding, PortfolioTransaction, Token } from '../types/token';
import { INITIAL_TOKENS } from './mockTokens';

export function getInitialHoldings(tokens: Token[]): PortfolioHolding[] {
  const flapToken = tokens.find((t) => t.id === 'flap-protocol') || tokens[4] || tokens[0];
  const banToken = tokens.find((t) => t.id === 'ban-token') || tokens[1];
  const zeroToken = tokens.find((t) => t.id === 'zero-token') || tokens[0];
  const gmToken = tokens.find((t) => t.id === 'gm-token') || tokens[2];
  const fomoToken = tokens.find((t) => t.id === 'fomo-token') || tokens[3];

  return [
    {
      tokenId: flapToken.id,
      token: flapToken,
      amount: 25000,
      avgBuyPrice: 0.1150,
      accumulatedRwaReward: {
        asset: 'NVDA',
        amount: 0.85,
        valueUsd: 105.80,
      },
      lastUpdated: '10 mins ago',
    },
    {
      tokenId: banToken.id,
      token: banToken,
      amount: 32500,
      avgBuyPrice: 0.0680,
      accumulatedRwaReward: {
        asset: 'AAPL',
        amount: 0.52,
        valueUsd: 115.40,
      },
      lastUpdated: '22 mins ago',
    },
    {
      tokenId: zeroToken.id,
      token: zeroToken,
      amount: 450000,
      avgBuyPrice: 0.00085,
      accumulatedRwaReward: {
        asset: 'NVDA',
        amount: 0.38,
        valueUsd: 47.30,
      },
      lastUpdated: '5 mins ago',
    },
    {
      tokenId: gmToken.id,
      token: gmToken,
      amount: 180000,
      avgBuyPrice: 0.0052,
      accumulatedRwaReward: {
        asset: 'TSLA',
        amount: 0.32,
        valueUsd: 69.80,
      },
      lastUpdated: '1 hour ago',
    },
    {
      tokenId: fomoToken.id,
      token: fomoToken,
      amount: 120000,
      avgBuyPrice: 0.0071,
      accumulatedRwaReward: {
        asset: 'GOOGL',
        amount: 0.12,
        valueUsd: 20.40,
      },
      lastUpdated: '3 hours ago',
    },
  ];
}

export const INITIAL_TRANSACTIONS: PortfolioTransaction[] = [
  {
    id: 'tx-1',
    type: 'buy',
    tokenSymbol: '$BAN',
    tokenName: 'Break And Reclaim',
    amount: 12500,
    valueUsd: 1006.05,
    txHash: '0x8f2a...c391',
    timestamp: '2 hours ago',
  },
  {
    id: 'tx-2',
    type: 'claim_rwa',
    tokenSymbol: 'sNVDA',
    tokenName: 'Nvidia RWA Dividend',
    amount: 0.45,
    valueUsd: 56.02,
    txHash: '0x3e11...99bb',
    timestamp: '14 hours ago',
  },
  {
    id: 'tx-3',
    type: 'buy',
    tokenSymbol: '$제로',
    tokenName: 'Zero Protocol',
    amount: 200000,
    valueUsd: 704.60,
    txHash: '0x1c94...821a',
    timestamp: '1 day ago',
  },
  {
    id: 'tx-4',
    type: 'sell',
    tokenSymbol: '$GM',
    tokenName: 'GREEN MORNING',
    amount: 50000,
    valueUsd: 371.65,
    txHash: '0xaa42...104f',
    timestamp: '2 days ago',
  },
];

export const INITIAL_PRICE_ALERTS: import('../types/token').PriceAlert[] = [
  {
    id: 'alert-1',
    tokenId: 'ban-token',
    tokenSymbol: '$BAN',
    tokenName: 'Break And Reclaim',
    tokenIcon: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop&q=80',
    currentPriceAtCreation: 0.080484,
    targetPrice: 0.0950,
    direction: 'above',
    status: 'active',
    createdAt: '2 days ago',
    note: 'Take profit target (+18%)',
  },
  {
    id: 'alert-2',
    tokenId: 'zero-token',
    tokenSymbol: '$제로',
    tokenName: 'Zero Protocol',
    tokenIcon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
    currentPriceAtCreation: 0.003523,
    targetPrice: 0.0050,
    direction: 'above',
    status: 'active',
    createdAt: '1 day ago',
    note: 'Breakout watch level',
  },
  {
    id: 'alert-3',
    tokenId: 'flap-protocol',
    tokenSymbol: '$FLAP',
    tokenName: 'Flap Protocol',
    tokenIcon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
    currentPriceAtCreation: 0.1428,
    targetPrice: 0.1200,
    direction: 'below',
    status: 'active',
    createdAt: '3 days ago',
    note: 'Dip buy zone on PancakeSwap',
  },
  {
    id: 'alert-4',
    tokenId: 'fomo-token',
    tokenSymbol: '$FOMO人生',
    tokenName: 'FOMO金库',
    tokenIcon: 'https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=100&h=100&fit=crop&q=80',
    currentPriceAtCreation: 0.0082,
    targetPrice: 0.0090,
    direction: 'above',
    status: 'triggered',
    createdAt: '4 days ago',
    triggeredAt: 'Yesterday at 18:42',
    note: 'Resistance flip notification',
  },
];
