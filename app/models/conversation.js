import ChatAgent from './chat-agent'
const conversations = {}

class Conversation {
  static get (id) {
    return conversations[id]
  }

  constructor (options) {
    const useMarkdown = true
    this.id = options.id
    this.type = options.type

    this.firstAgent = new ChatAgent({
      id: `${options.id}-1`,
      type: 'conversation',
      systemMessage: '',
      useMarkdown
    })

    this.secondAgent = new ChatAgent({
      id: `${options.id}-2`,
      type: 'conversation',
      systemMessage: '',
      useMarkdown
    })

    conversations[options.id] = this
  }
}

export default Conversation
