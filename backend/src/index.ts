import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { claimsRouter } from './routes/claims'
import { leaderboardRouter } from './routes/leaderboard'
import { usersRouter } from './routes/users'

const app = express()
const PORT = process.env.PORT || 4000

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))
app.use(express.json())

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.use('/api/claims', claimsRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/users', usersRouter)

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
