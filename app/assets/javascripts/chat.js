export default () => {
  const endpoint = document.querySelector('form').getAttribute('data-endpoint')
  const chatOutput = document.getElementById('chat-output')

  // when I hit enter, submit the form
  document.getElementById('chat').addEventListener('keyup', (event) => {
    if (event.shiftKey || event.ctrlKey || event.altKey) {
      return
    }

    if (event.key === 'Enter') {
      sendValue(event)
    }
  })

  // when I submit the form, send the message
  document.querySelector('form').addEventListener('submit', (event) => {
    sendValue(event)
  })

  const sendValue = (event) => {
    event.preventDefault()
    const value = document.getElementById('chat').value
    document.getElementById('chat').value = ''
    streamChat(value.replace(/\n+$/, ''))
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

    const user = document.createElement('div')
    user.classList.add('message')
    user.classList.add('message--user')
    chatOutput.appendChild(user)

    const assistant = document.createElement('div')
    assistant.classList.add('message')
    assistant.classList.add('message--assistant')
    chatOutput.appendChild(assistant)

    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const message = new TextDecoder('utf-8').decode(value)
      try {
        const json = JSON.parse(message)
        user.innerHTML = `<p>${json.requestHtml}</p>`
        assistant.innerHTML = `<p>${json.messageHtml}</p>`
        window.scrollTo(0, document.body.scrollHeight)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
