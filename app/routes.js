import express from 'express'
import { exampleWizardRoutes } from './routes/example-wizard.js'
import { ChatGPTAPI } from 'chatgpt'
import * as dotenv from 'dotenv'
dotenv.config()

async function example () {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const res = await api.sendMessage('Hello World!')
  console.log(res.text)
}

example()

const router = express.Router()
exampleWizardRoutes(router)

export default router
