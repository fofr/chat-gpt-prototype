import MarkdownIt from 'markdown-it'
import { ChatGPTAPI } from 'chatgpt'
const md = new MarkdownIt()
const chatAgents = {}

const systemPrompts = {
  markdown: `
Give all responses in markdown format.
Using headings to break down long answers, starting from h3 level (\`###\`).
Write all content in GOV.UK style. Be concise and use active voice.
Limit responses to 2 paragraphs.`
}

const chatAgent = (systemMessage) => {
  return new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    systemMessage
  })
}

const toHtml = (markdown) => {
  return md.render(markdown)
}

const parentMessageId = (chatHistory) => {
  const parentMessage = chatHistory.messages[chatHistory.messages.length - 1]
  return parentMessage ? parentMessage.id : null
}

export default (router) => {
  router.all([
    '/chat/:type/:id',
    '/chat/:type/:id/*'
  ], (req, res, next) => {
    const type = req.params.type
    const chatId = req.params.id
    const chats = req.session.data.chats
    const chatHistory = chats[chatId] || { id: chatId, messages: [] }

    if (!chats[chatId]) {
      chats[chatId] = chatHistory
    }

    if (!chatAgents[type]) {
      chatAgents[type] = {}
    }

    if (!chatAgents[type][chatId]) {
      chatAgents[type][chatId] = chatAgent(systemPrompts[type] || '')
    }

    res.locals.chatId = chatId
    res.locals.type = type
    res.locals.chatHistory = chatHistory

    next()
  })

  router.get('/chat/:type/:id', (req, res) => {
    res.render('chat')
  })

  router.post('/chat/:type/:id/endpoint', async (req, res) => {
    const chatAgent = chatAgents[res.locals.type][res.locals.chatId]
    const chatHistory = res.locals.chatHistory
    const response = await chatAgent.sendMessage(req.body.message, {
      parentMessageId: parentMessageId(chatHistory)
    })

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
    res.json(chatMessage)
  })

  // router.post('/chat-endpoint', async (req, res) => {
  //   const chatId = req.body['chat-id']
  //   const chats = req.session.data.chats
  //   const chatHistory = chats[chatId] || { id: chatId, messages: [] }
  //   if (!chats[chatId]) {
  //     chats[chatId] = chatHistory
  //   }

  //   const parentMessage = chatHistory.messages[chatHistory.messages.length - 1]
  //   const parentMessageId = parentMessage ? parentMessage.id : null
  //   let response

  //   if (parentMessageId) {
  //     response = await markdownChatAgent.sendMessage(req.body.message, { parentMessageId })
  //   } else {
  //     response = await markdownChatAgent.sendMessage(req.body.message)
  //   }

  //   const chatMessage =
  //     {
  //       request: req.body.message,
  //       requestHtml: toHtml(req.body.message),
  //       id: response.id,
  //       message: response.text,
  //       messageHtml: toHtml(response.text),
  //       response
  //     }

  //   chatHistory.messages.push(chatMessage)
  //   res.json(chatMessage)
  // })
}
