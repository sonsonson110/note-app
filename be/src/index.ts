import express, { Express } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'reflect-metadata'

import { errorHandler } from './middlewares/error-handler.middleware'
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import notebookRoutes from './routes/notebook.route'
import noteRoutes from './routes/note.route'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000']
app.use(
    cors({
        origin: corsOrigins,
        credentials: process.env.CORS_CREDENTIALS === 'true',
    })
)

app.use(helmet())
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/notebooks', notebookRoutes)
app.use('/api/notes', noteRoutes)

app.get('/api/health', async (req, res) => {
    try {
        // Check database connectivity
        await new PrismaClient().$queryRaw`SELECT 1`
        res.status(200).json({
            status: 'ok',
            database: 'connected',
        })
    } catch (error) {
        console.error('Health check failed:', error)
        res.status(500).json({
            status: 'error',
            database: 'disconnected',
            message: 'Database connection failed',
        })
    }
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
