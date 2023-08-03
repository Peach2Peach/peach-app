import { info } from '../../log'
import { dateTimeReviver } from '../../system'
import { peachWS } from '.'

export const onMessageHandler = (msg: WebSocketMessageEvent) => {
  const message = JSON.parse(msg.data, dateTimeReviver)

  if (!peachWS.authenticated && message.accessToken) {
    info('Peach WS API - authenticated')
    peachWS.authenticated = true
    return
  }
  if (!peachWS.authenticated) return

  peachWS.listeners.message.forEach((listener) => listener(message))
}
