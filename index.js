const startBtn = document.getElementById('startBtn')
const startScreen = document.getElementById('start-screen')
const chatScreen = document.getElementById('chat-screen')

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none'
  chatScreen.classList.remove('hidden')
})

flaps.addEventListener('click', () => {
  location.reload()
})

const send = document.getElementById('send')
const messageInput = document.getElementById('messageInput')
const chatMain = document.getElementById('chatMain')

function createMessage(text, sender = 'user') {
  const msg = document.createElement('div')
  msg.textContent = text
  msg.style.padding = '10px'
  msg.style.margin = '5px 0'
  msg.style.borderRadius = '8px'
  msg.style.maxWidth = '70%'
  msg.style.fontFamily = 'sans-serif'
  msg.style.backgroundColor = sender === 'user' ? '#e0e0e0' : '#fff3cd'
  msg.style.alignSelf = sender === 'user' ? 'flex-end' : 'flex-start'
  chatMain.appendChild(msg)
  chatMain.scrollTop = chatMain.scrollHeight
}

send.addEventListener('click', () => {
  const text = messageInput.value.trim()
  if (text === '') return

  createMessage(text, 'user')
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(text)
  } else {
    createMessage(
      '❗ Невозможно отправить: нет подключения к серверу.',
      'server'
    )
  }
  messageInput.value = ''
})

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    send.click()
  }
})

let socket
function connectWebSocket() {
  socket = new WebSocket('wss://ws.ifelse.io')
  // socket = new WebSocket('ws://ws.ifelse404')

  socket.addEventListener('open', () => {
    createMessage('✅ Подключение установлено!', 'server')
  })

  socket.addEventListener('message', (event) => {
    createMessage(event.data, 'server')
  })

  socket.addEventListener('error', () => {
    createMessage('❌ Ошибка соединения с сервером.', 'server')
  })

  socket.addEventListener('close', () => {
    createMessage('🔄 Соединение потеряно. Переподключаюсь...', 'server')
    setTimeout(connectWebSocket, 3000)
  })
}
connectWebSocket()
const geoBtn = document.getElementById('geolocation')

const phrases = [
  'Теперь я знаю, где ты живёшь... 👀',
  'Мы встретимся раньше, чем ты думаешь...',
  'Я уже рядом... 👣',
  'Приятный район 😏',
  'Кажется, это твоя улица…',
  'Я вижу твой дом',
  'Выгляни в окно 😈',
  'Иди открывай дверь, я уже поднимаюсь…',
  'Ты хорошо спрятался… почти',
  'Хорошее местечко у тебя!',
  'Открой дверь я жду 🚪',
  'Ладно… я приду в следующий раз.',
  'Только будь готов — я знаю, где ты живёшь 😉',
]
geoBtn.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude.toFixed(6)
      const lon = pos.coords.longitude.toFixed(6)

      const now = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
      const link = `https://www.openstreetmap.org/#map=17/${lat}/${lon}`

      const geoMessage = document.createElement('div')
      geoMessage.className = 'message user'
      geoMessage.innerHTML = `📍 <a href="${link}" target="_blank">Моё местоположение(${now})</a>`
      chatMain.appendChild(geoMessage)

      chatMain.scrollTop = chatMain.scrollHeight

      let index = 0
      const interval = setInterval(() => {
        if (index >= phrases.length) {
          clearInterval(interval)
          return
        }
        const reply = document.createElement('div')
        reply.className = 'message server'
        reply.textContent = phrases[index]
        chatMain.appendChild(reply)
        chatMain.scrollTop = chatMain.scrollHeight

        index++
      }, 3000)
    })
  } else {
    alert('Геолокация не поддерживается этим браузером.')
  }
})
