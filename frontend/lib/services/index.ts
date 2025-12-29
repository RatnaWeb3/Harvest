/**
 * Services Layer - Public Exports
 */

// Protocol interface and types
export type {
  ProtocolId,
  PositionType,
  Position,
  RewardItem,
  ProtocolService,
  ProtocolConfig,
} from './protocol-interface'

// Protocol registry
export {
  getProtocolService,
  getAllProtocols,
  getActiveProtocols,
  isProtocolActive,
  getProtocolIds,
  getActiveProtocolIds,
} from './protocol-registry'

// Individual protocol services
export { yuzuService } from './yuzu-service'
export { jouleService } from './joule-service'
export { meridianService } from './meridian-service'

// Aggregated Harvest service
export { harvestService } from './harvest-service'
export type { ClaimRequest, PortfolioSummary } from './harvest-service'

// Claim history service
export { historyService } from './history-service'

// Leaderboard service
export { leaderboardService } from './leaderboard-service'
