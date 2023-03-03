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
  const systemPrompt = `
  Give all responses in markdown format.
  Using headings to break down long answers, starting from h3 level (\`###\`).
  Write all content in GOV.UK style. Be concise and use active voice.
  Limit responses to 2 paragraphs.`
  const markdownChatAgent = chatAgent(systemPrompt)

  router.post('/chat-endpoint', async (req, res) => {
    console.log(req.body)
    const chatId = req.body['chat-id']
    const chats = req.session.data.chats
    const chatHistory = chats[chatId] || { id: chatId, messages: [] }
    if (!chats[chatId]) {
      chats[chatId] = chatHistory
    }

    // get id of last message
    const parentMessage = chatHistory.messages[chatHistory.messages.length - 1]
    const parentMessageId = parentMessage ? parentMessage.id : null
    let response

    if (parentMessageId) {
      response = await markdownChatAgent.sendMessage(req.body.message, { parentMessageId })
    } else {
      response = await markdownChatAgent.sendMessage(req.body.message)
    }

    const chatMessage =
      {
        request: req.body.message,
        requestHtml: toHtml(req.body.message),
        id: response.id,
        message: response.text,
        messageHtml: toHtml(response.text),
        response
      }

    chatHistory.messages.push(chatMessage)
    // console.log(response)
    res.json(chatMessage)
  })
}
