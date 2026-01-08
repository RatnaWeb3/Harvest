-- Users table
CREATE TABLE users (
  address VARCHAR(66) PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Claims history
CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  user_address VARCHAR(66) NOT NULL,
  protocol VARCHAR(50) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  amount DECIMAL(36, 18) NOT NULL,
  token_symbol VARCHAR(20) NOT NULL,
  value_usd DECIMAL(20, 2),
  claimed_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard (aggregated)
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_address VARCHAR(66) NOT NULL,
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'all-time'
  total_claimed_usd DECIMAL(20, 2) NOT NULL,
  claim_count INTEGER NOT NULL,
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_address, period)
);

-- Indexes
CREATE INDEX idx_claims_user ON claims(user_address);
CREATE INDEX idx_claims_protocol ON claims(protocol);
CREATE INDEX idx_leaderboard_period_rank ON leaderboard(period, rank);
