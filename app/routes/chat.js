import MarkdownIt from 'markdown-it'
import { ChatGPTAPI } from 'chatgpt'
const md = new MarkdownIt()

const chatAgent = (systemMessage) => {
  return new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    systemMessage
  })
}

const toHtml = (markdown) => {
  return md.render(markdown)
}

export default (router) => {
  router.post('/chat-endpoint', async (req, res) => {
    const systemPrompt = `
Give all responses in markdown format.
Using headings to break down long answers, starting from h3 level (\`###\`).
Write all content in GOV.UK style.
`
    const markdownChatAgent = chatAgent(systemPrompt)
    const response = await markdownChatAgent.sendMessage(req.body.message)
    console.log(response)
    res.json({
      requestHtml: toHtml(req.body.message),
      message: response.text,
      messageHtml: toHtml(response.text)
    })
  })
}
