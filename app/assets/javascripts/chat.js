import processors from './processors'

export default () => {
  const messageForm = document.querySelector('.app-chat-form')
  const endpoint = messageForm.getAttribute('data-endpoint')
  const chatOutput = document.getElementById('chat-output')
  const messageInput = document.getElementById('chat')

  messageInput.addEventListener('keyup', (event) => {
    if (event.shiftKey || event.ctrlKey || event.altKey) {
      return
    }
    if (event.key === 'Enter') {
      sendValue(event)
    }
  })

  messageForm.addEventListener('submit', (event) => {
    sendValue(event)
  })

  const sendValue = (event) => {
    event.preventDefault()
    if (messageInput && messageInput.value) {
      const value = messageInput.value
      messageInput.value = ''
      streamChat(value.replace(/\n+$/, ''))
    }
  }

  // method to use the fetch api to stream responses from a server
  const streamChat = async (value) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: value
      })
    })

    const userMessageContainer = document.createElement('div')
    userMessageContainer.classList.add('message', 'message--user')
    chatOutput.appendChild(userMessageContainer)

    const assistantMessageContainer = document.createElement('div')
    assistantMessageContainer.classList.add('message', 'message--assistant')
    chatOutput.appendChild(assistantMessageContainer)

    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        const processor = chatOutput.getAttribute('data-processor')
        if (processor && typeof processors[processor] === 'function') {
          processors[processor](assistantMessageContainer)
        }
        break
      }

      try {
        const json = JSON.parse(new TextDecoder('utf-8').decode(value))
        userMessageContainer.innerHTML = json.messageHtml
        assistantMessageContainer.innerHTML = json.html
        chatOutput.style.display = 'block'
        window.scrollTo(0, document.body.scrollHeight)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
