import { ChatGPTAPI } from 'chatgpt'
import MarkdownIt from 'markdown-it'
import { DateTime } from 'luxon'
const md = new MarkdownIt()
const chatAgents = {}

class ChatAgent {
  static get (id) {
    return chatAgents[id]
  }

  constructor (options) {
    this.chatAgent = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
      systemMessage: options.systemMessage || ''
    })

    this.systemMessage = options.systemMessage || ''
    this.type = options.type
    this.createdAt = DateTime.now().toISO()
    this.useMarkdown = options.useMarkdown || false
    this.messages = []
    this.id = options.id

    chatAgents[options.id] = this
  }

  toHtml = (markdown) => {
    return md.render(markdown)
  }

  parentMessageId = () => {
    const parentMessage = this.messages[this.messages.length - 1]
    return parentMessage ? parentMessage.id : null
  }

  processResponse = (message, response) => {
    const r = {
      id: response.id,
      text: response.text,
      message,
      messageHtml: this.toHtml(message)
    }

    if (this.useMarkdown) {
      r.html = this.toHtml(response.text)
    }

    return r
  }

  async chat (message, fn) {
    const response = await this.chatAgent.sendMessage(message, {
      parentMessageId: this.parentMessageId(),
      onProgress: (response) => {
        const processedResponse = JSON.stringify(this.processResponse(message, response))
        fn(processedResponse)
      }
    })

    this.messages.push(this.processResponse(message, response))
  }
}

export default ChatAgent
