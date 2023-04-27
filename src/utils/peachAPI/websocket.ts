import { createContext, ReducerState, useContext } from 'react'
import { API_URL } from '@env'
import { info } from '../log'
import { authWS } from './private/user'
import { dateTimeReviver } from '../system'

let ws: WebSocket
let peachWS: PeachWS = {
  authenticated: false,
  connected: false,
  queue: [],
  listeners: {
    message: [],
    close: [],
  },
  send: () => true,
  on: (listener: 'message' | 'close', callback: WSCallback) => {
    peachWS.listeners[listener].push(callback)
    peachWS.listeners[listener] = peachWS.listeners[listener].filter(
      (cllbck, index, self) => self.findIndex((c) => c.toString() === cllbck.toString()) === index,
    )
  },
  off: (listener: 'message' | 'close', callback: WSCallback) => {
    peachWS.listeners[listener] = peachWS.listeners[listener].filter(
      (cllbck) => cllbck.toString() !== callback.toString(),
    ) as WSCallback[]
  },
  close: () => {},
}

const onOpenHandler = () => {
  peachWS.connected = true
  authWS(ws)

  // if a queue built up while offline, now send what has queued up
  peachWS.queue = peachWS.queue.filter((callback) => !callback())
}

const onMessageHandler = (msg: WebSocketMessageEvent) => {
  const message = JSON.parse(msg.data, dateTimeReviver)

  if (!peachWS.authenticated && message.accessToken) {
    info('Peach WS API - authenticated')
    peachWS.authenticated = true
    return
  }
  if (!peachWS.authenticated) return

  peachWS.listeners.message.forEach((listener) => listener(message))
}

const onCloseHandler = () => {
  info('Peach WS API - connection closed.')
  peachWS.connected = false
  peachWS.listeners.close.forEach((listener) => listener())
  peachWS.listeners.close = []
  ws.removeEventListener('message', onMessageHandler)
}

export const createWebsocket = (oldPeachWS?: PeachWS): PeachWS => {
  if (ws) {
    ws.removeEventListener('open', onOpenHandler)
    ws.removeEventListener('message', onMessageHandler)
    ws.removeEventListener('close', onCloseHandler)
  }

  ws = new WebSocket(`${API_URL.replace('http', 'ws')}/`)
  peachWS = {
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
  }

  peachWS.send = (data: string): boolean => {
    if (!peachWS.connected) {
      info('Peach WS API - reestablishing connection.')

      peachWS.queue.push(() => peachWS.send(data))
      ws.close()
      peachWS = createWebsocket(peachWS)

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

export const getWebSocket = () => peachWS

export const PeachWSContext = createContext(peachWS)
export const useWebsocketContext = () => useContext(PeachWSContext)

/**
 * @description Method to set new peach websocket
 * @param state the state object (can be ignored)
 * @param newPeachWS the new peach websocket
 * @returns peach websocket
 */
export const setPeachWS = (state: ReducerState<any>, newPeachWS: PeachWS): PeachWS => {
  peachWS = newPeachWS

  return peachWS
}
