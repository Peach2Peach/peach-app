import { info } from '../../log'
import { onMessageHandler } from './onMessageHandler'
import { peachWS, ws } from '.'

export const onCloseHandler = () => {
  info('Peach WS API - connection closed.')
  peachWS.connected = false
  peachWS.listeners.close.forEach((listener) => listener())
  peachWS.listeners.close = []
  ws.removeEventListener('message', onMessageHandler)
}
