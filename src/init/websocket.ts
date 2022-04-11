import { EffectCallback } from 'react'
import { account } from '../utils/account'
import { info } from '../utils/log'
import { createWebsocket } from '../utils/peachAPI/websocket'

/**
 * @description Method to initialize web socket
 * @param updatePeachWS update function
 */
const initWebSocket = (updatePeachWS: Function): EffectCallback => () => {
  if (!account.publicKey) {
    setTimeout(() => {
      initWebSocket(updatePeachWS)()
    }, 10000)
    return () => {}
  }

  const ws = createWebsocket()

  updatePeachWS(ws)

  const onMessageHandler = (message: Message) => {
    info('MESSAGE', message)
  }

  const onCloseHandler = () => {
    info('CLOSE')
    setTimeout(() => {
      initWebSocket(updatePeachWS)()
    }, 3000)
  }

  if (!ws.listeners.message.some(cllbck => cllbck.toString() === onMessageHandler.toString())) {
    ws.on('message', onMessageHandler)
  }
  if (!ws.listeners.message.some(cllbck => cllbck.toString() === onCloseHandler.toString())) {
    ws.on('close', onCloseHandler)
  }

  return () => {
    ws.listeners = {
      message: [],
      close: [],
    }
    ws.close()
  }
}

export default initWebSocket