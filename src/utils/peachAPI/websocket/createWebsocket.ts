import { API_URL } from '@env'
import { info } from '../../log'
import { ws, peachWS, setPeachWS, setWS } from '.'
import { onCloseHandler } from './onCloseHandler'
import { onMessageHandler } from './onMessageHandler'
import { onOpenHandler } from './onOpenHandler'

export const createWebsocket = (oldPeachWS?: PeachWS): PeachWS => {
  if (ws) {
    ws.removeEventListener('open', onOpenHandler)
    ws.removeEventListener('message', onMessageHandler)
    ws.removeEventListener('close', onCloseHandler)
  }

  setWS(new WebSocket(`${API_URL.replace('http', 'ws')}/`))
  setPeachWS(undefined, {
    ...peachWS,
    ws,
    authenticated: false,
    connected: false,
    queue: oldPeachWS?.queue || [],
    listeners: oldPeachWS?.listeners || {
      message: [],
      close: [],
    },
    close: () => {
      ws.removeEventListener('message', onMessageHandler)
      ws.close()
    },
  })

  peachWS.send = (data: string): boolean => {
    if (!peachWS.connected) {
      info('Peach WS API - reestablishing connection.')

      peachWS.queue.push(() => peachWS.send(data))
      ws.close()
      setPeachWS(undefined, createWebsocket(peachWS))

      return false
    }

    ws.send(data)
    return true
  }

  ws.addEventListener('open', onOpenHandler)
  ws.addEventListener('message', onMessageHandler)
  ws.addEventListener('close', onCloseHandler)
  return peachWS
}
