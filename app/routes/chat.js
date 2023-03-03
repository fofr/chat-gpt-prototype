import MarkdownIt from 'markdown-it'
import { ChatGPTAPI } from 'chatgpt'
import { DateTime } from 'luxon'
import systemPrompts from '../helpers/system-prompts.js'
const md = new MarkdownIt()
const chatAgents = {}
const chatAgent = (systemMessage) => {
  return new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    systemMessage
  })
}

const toHtml = (markdown) => {
  return md.render(markdown)
}

const addResponseToMessage = (message, response) => {
  message.id = response.id
  message.message = response.text
  message.messageHtml = toHtml(response.text)
}

const getChatMessage = (req, response) => {
  return {
    request: req.body.message,
    requestHtml: toHtml(req.body.message),
    ...(response ? addResponseToMessage({}, response) : {})
  }
}

const getChatAgent = (res) => {
  return chatAgents[res.locals.type][res.locals.chatId]
}

const parentMessageId = (chatHistory) => {
  const parentMessage = chatHistory.messages[chatHistory.messages.length - 1]
  return parentMessage ? parentMessage.id : null
}

export default (router) => {
  router.all('/chat/:type/new', (req, res, next) => {
    const chatId = Math.random().toString(36).slice(2, 5).toUpperCase()
    res.redirect(`/chat/${req.params.type}/${chatId}`)
  })

  router.all([
    '/chat/:type/:id',
    '/chat/:type/:id/*'
  ], (req, res, next) => {
    const type = req.params.type
    const chatId = req.params.id
    const chats = req.session.data.chats
    const chatHistory = chats[chatId] || {
      id: chatId,
      messages: [],
      type,
      createdAt: DateTime.now().toISO()
    }

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

  router.get('/chat/conversation/:id', (req, res) => {
    res.render('conversation')
  })

  router.post('/chat/:type/:id/stream', async (req, res) => {
    const chatAgent = getChatAgent(res)
    const chatHistory = res.locals.chatHistory
    const chatMessage = getChatMessage(req)

    res.set({
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    })

    const stream = res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    const response = await chatAgent.sendMessage(req.body.message, {
      parentMessageId: parentMessageId(chatHistory),
      onProgress: (partialResponse) => {
        addResponseToMessage(chatMessage, partialResponse)
        stream.write(JSON.stringify(chatMessage))
      }
    })

    addResponseToMessage(chatMessage, response)
    chatMessage.response = response
    chatHistory.messages.push(chatMessage)
    stream.end()
  })

  router.post('/chat/:type/:id/endpoint', async (req, res) => {
    const chatAgent = getChatAgent(res)
    const chatHistory = res.locals.chatHistory
    const response = await chatAgent.sendMessage(req.body.message, {
      parentMessageId: parentMessageId(chatHistory)
    })

    const chatMessage = getChatMessage(req, response)
    chatMessage.response = response
    chatHistory.messages.push(chatMessage)
    res.json(chatMessage)
  })
}
