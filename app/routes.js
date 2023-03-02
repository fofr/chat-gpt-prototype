import express from 'express'
import MarkdownIt from 'markdown-it'
import { ChatGPTAPI } from 'chatgpt'
import * as dotenv from 'dotenv'
const md = new MarkdownIt()
const router = express.Router()
dotenv.config()

router.post('/chat-endpoint', async (req, res) => {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    systemMessage: 'Give all responses in markdown format. Using headings to break down long answers, starting from h2 level (`##`). Write all content in GOV.UK style.'
  })

  const response = await api.sendMessage(req.body.message)
  console.log(response)
  res.json({ requestHtml: markdownToHtml(req.body.message), message: response.text, messageHtml: markdownToHtml(response.text) })
})

const markdownToHtml = (markdown) => {
  return md.render(markdown)
}

export default router
