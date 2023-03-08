export default () => {
  const messageForm = document.querySelector('.app-conversation-form')
  const startConversationForm = document.querySelector('.app-start-conversation-form')
  const endpoint = messageForm.getAttribute('data-endpoint')
  const chatOutput = document.getElementById('chat-output')

  messageForm.addEventListener('submit', (event) => {
    sendValue(event)
  })

  startConversationForm.addEventListener('submit', (event) => {
    sendValue(event, true)
  })

  const sendValue = (event, isStarting) => {
    event.preventDefault()
    streamChat(isStarting)
  }

  // method to use the fetch api to stream responses from a server
  const streamChat = async (isStarting) => {
    const personId = messageForm.getAttribute('data-person-id')
    const body = {
      person: `person${personId}`
    }

    if (isStarting) {
      body.message = document.getElementById('first-message').value
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('message')
    messageContainer.classList.add(`message--person${personId}`)
    chatOutput.appendChild(messageContainer)

    if (isStarting) {
      startConversationForm.style.display = 'none'
      messageForm.style.display = 'block'
      chatOutput.style.display = 'block'
    }

    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) { break }

      try {
        const json = JSON.parse(new TextDecoder('utf-8').decode(value))
        messageContainer.innerHTML = json.messageHtml
        window.scrollTo(0, document.body.scrollHeight)
      } catch (e) {}
    }

    const nextPerson = personId === '1' ? '2' : '1'
    messageForm.setAttribute('data-person-id', nextPerson)
  }

  // if no messages have been sent, start the conversation
  // if (chatOutput.children.length === 0) {
  //   streamChat()
  // }
}
