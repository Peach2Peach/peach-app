import { createContext, Dispatch, ReducerState } from 'react'
import { API_URL } from '@env'
import { info } from '../log'
import { authWS } from './private/user'

let ws: WebSocket
let peachWS: PeachWS = {
  authenticated: false,
  connected: false,
  queue: [],
  listeners: {
    message: [],
    close: [],
  },
  send: (data: string) => true,
  on: (listener: 'message'|'close', callback: (message?: any) => void) => peachWS.listeners[listener].push(callback),
  close: () => {},
}

export const createWebsocket = (oldPeachWS?: PeachWS): PeachWS => {
  ws = new WebSocket(`${API_URL.replace('http', 'ws')}/`)
  peachWS = {
    ws,
    authenticated: false,
    connected: false,
    queue: oldPeachWS?.queue || [],
    listeners: oldPeachWS?.listeners || {
      message: [],
      close: [],
    },
    send: (data: string) => true,
    on: (listener: 'message'|'close', callback: (message?: any) => void) => peachWS.listeners[listener].push(callback),
    // TODO add off listenter
    close: ws.close,
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


  ws.onopen = () => {
    peachWS.connected = true
    authWS(ws)

    // if a queue built up while offline, now send what has queued up
    peachWS.queue = peachWS.queue.filter(callback => !callback())
  }
  ws.onmessage = (msg) => {
    const message = JSON.parse(msg.data)

    if (!peachWS.authenticated && message.accessToken) {
      info('Peach WS API - authenticated')
      peachWS.authenticated = true
      return
    }
    if (!peachWS.authenticated) return

    peachWS.listeners.message.forEach(listener => listener(message))
  }

  ws.onclose = () => {
    info('Peach WS API - connection closed.')
    peachWS.connected = false
    peachWS.listeners.close.forEach(listener => listener())
  }

  return peachWS
}

export const getWebSocket = () => peachWS


export const PeachWSContext = createContext(peachWS)

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