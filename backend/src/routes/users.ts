import { Router } from 'express'
import { pool } from '../db'

const router = Router()

router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params
    const result = await pool.query(
      'SELECT * FROM users WHERE address = $1',
      [address.toLowerCase()]
    )
    res.json(result.rows[0] || null)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export { router as usersRouter }
