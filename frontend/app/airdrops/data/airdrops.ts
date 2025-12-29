/**
 * Mock Airdrop Data
 * Movement ecosystem airdrop information
 */

import type { Airdrop } from '../types'

// Helper to create dates relative to now
const daysFromNow = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const daysAgo = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export const MOCK_AIRDROPS: Airdrop[] = [
  {
    id: 'cornucopia-rush',
    name: 'Cornucopia Rush',
    protocol: 'Movement',
    status: 'live',
    eligible: true,
    allocation: '5,000 MOVE',
    allocationUsd: 7500,
    claimDeadline: daysFromNow(14),
    snapshotDate: daysAgo(7),
    requirements: [
      'Hold at least 100 MOVE',
      'Complete 5+ transactions on Movement',
      'Participate in governance vote',
    ],
    checkUrl: 'https://movement.xyz/cornucopia',
    claimUrl: 'https://movement.xyz/cornucopia/claim',
    description: 'Seasonal rewards for active Movement ecosystem participants.',
  },
  {
    id: 'matrix-quest',
    name: 'Matrix.fun Quest',
    protocol: 'Matrix.fun',
    status: 'live',
    eligible: null,
    snapshotDate: daysFromNow(30),
    requirements: [
      'Complete daily engagement tasks',
      'Refer 3+ new users',
      'Achieve 2,500+ points',
    ],
    checkUrl: 'https://matrix.fun/quests',
    description: 'Earn points through engagement and convert to token rewards.',
  },
  {
    id: 'yuzu-lp-rewards',
    name: 'Yuzu LP Incentives',
    protocol: 'Yuzu',
    status: 'claimable',
    eligible: true,
    allocation: '850 YUZU',
    allocationUsd: 425,
    claimDeadline: daysFromNow(7),
    snapshotDate: daysAgo(30),
    requirements: ['Provide liquidity to eligible pools', 'Maintain position for 14+ days'],
    claimUrl: 'https://yuzu.exchange/rewards',
    description: 'Retroactive rewards for early liquidity providers.',
  },
  {
    id: 'joule-early-adopter',
    name: 'Early Adopter Bonus',
    protocol: 'Joule',
    status: 'upcoming',
    eligible: null,
    snapshotDate: daysFromNow(21),
    requirements: [
      'Supply assets to lending markets',
      'Maintain $500+ TVL',
      'Active before snapshot date',
    ],
    checkUrl: 'https://joule.finance/airdrop',
    description: 'Rewards for early Joule lending protocol users.',
  },
  {
    id: 'meridian-genesis',
    name: 'Genesis Distribution',
    protocol: 'Meridian',
    status: 'upcoming',
    eligible: null,
    snapshotDate: daysFromNow(45),
    requirements: ['Use Meridian DeFi hyperapp', 'Complete at least 10 swaps', 'Stake MOVE'],
    description: 'Token distribution for Meridian genesis participants.',
  },
  {
    id: 'thunderhead-stakers',
    name: 'Staker Rewards S1',
    protocol: 'Thunderhead',
    status: 'ended',
    eligible: true,
    allocation: '1,200 MOVE',
    allocationUsd: 1800,
    claimDeadline: daysAgo(5),
    snapshotDate: daysAgo(60),
    requirements: ['Stake MOVE via Thunderhead', 'Hold stMOVE for 30+ days'],
    description: 'Season 1 rewards for liquid staking participants.',
  },
  {
    id: 'canopy-yield',
    name: 'Yield Optimizer Drop',
    protocol: 'Canopy',
    status: 'upcoming',
    eligible: null,
    snapshotDate: daysFromNow(60),
    requirements: [
      'Deposit into Canopy vaults',
      'Maintain position through snapshot',
      'Follow @CanopyFinance',
    ],
    description: 'Airdrop for early Canopy yield marketplace users.',
  },
  {
    id: 'movement-testnet',
    name: 'Testnet Contributors',
    protocol: 'Movement',
    status: 'claimable',
    eligible: false,
    claimDeadline: daysFromNow(30),
    snapshotDate: daysAgo(90),
    requirements: ['Participated in Movement testnet', 'Submitted bug reports', 'Ran validator node'],
    claimUrl: 'https://movement.xyz/testnet-rewards',
    description: 'Rewards for testnet contributors and validators.',
  },
]
