import { Router } from 'express'
import { pool } from '../db'

const router = Router()

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { period = 'weekly', limit = 100 } = req.query

    const result = await pool.query(`
      SELECT user_address, total_claimed_usd, claim_count,
             ROW_NUMBER() OVER (ORDER BY total_claimed_usd DESC) as rank
      FROM leaderboard
      WHERE period = $1
      ORDER BY total_claimed_usd DESC
      LIMIT $2
    `, [period, limit])

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard' })
  }
})

// Get user's rank
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { period = 'weekly' } = req.query

    const result = await pool.query(`
      WITH ranked AS (
        SELECT user_address, total_claimed_usd, claim_count,
               ROW_NUMBER() OVER (ORDER BY total_claimed_usd DESC) as rank
        FROM leaderboard
        WHERE period = $1
      )
      SELECT * FROM ranked WHERE user_address = $2
    `, [period, address.toLowerCase()])

    res.json(result.rows[0] || {
      user_address: address.toLowerCase(),
      total_claimed_usd: 0,
      claim_count: 0,
      rank: null
    })
  } catch (error) {
    console.error('Error fetching user rank:', error)
    res.status(500).json({ error: 'Failed to fetch rank' })
  }
})

export { router as leaderboardRouter }
