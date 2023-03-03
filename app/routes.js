import express from 'express'
import * as dotenv from 'dotenv'
import chatRoutes from './routes/chat.js'
const router = express.Router()
dotenv.config()
chatRoutes(router)
export default router
