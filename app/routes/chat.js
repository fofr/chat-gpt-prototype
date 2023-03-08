import ChatAgent from '../models/chat-agent.js'
import prompts from '../models/prompts.js'

export default (router) => {
  router.get('/', (req, res, next) => {
    res.locals.prompts = prompts()
    next()
  })

  router.all('/chat/:type/new', (req, res, next) => {
    const id = Math.random().toString(36).slice(2, 5).toUpperCase()
    res.redirect(`/chat/${req.params.type}/${id}`)
  })

  router.all([
    '/chat/:type/:id',
    '/chat/:type/:id/*'
  ], (req, res, next) => {
    const id = req.params.id
    const type = req.params.type
    const prompt = prompts()[type]
    const chatAgent = ChatAgent.get(id) || new ChatAgent({
      id,
      type,
      systemMessage: prompt.systemMessage,
      useMarkdown: prompt.markdown
    })

    res.locals.prompt = prompt
    res.locals.chatId = id
    res.locals.type = type
    res.locals.chatAgent = chatAgent
    next()
  })

  router.get('/chat/conversation/:id', (req, res) => {
    res.render('conversation')
  })

  router.get('/chat/:type/:id', (req, res) => {
    res.render('chat')
  })

  router.post('/chat/:type/:id/stream', async (req, res) => {
    res.set({
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    })

    const stream = res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    await res.locals.chatAgent.chat(req.body.message, (response) => {
      stream.write(response)
    })

    stream.end()
  })
}
