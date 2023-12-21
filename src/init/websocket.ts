import { Dispatch, EffectCallback } from 'react'
import { useAccountStore } from '../utils/account/account'
import { info } from '../utils/log'
import { createWebsocket } from '../utils/peachAPI/websocket/createWebsocket'

const RETRY_INTERVAL = 3000
const INIT_RETRY_INTERVAL = 10000

export const initWebSocket
  = (updatePeachWS: Function, updateMessage: Dispatch<MessageState>): EffectCallback =>
    () => {
      const publicKey = useAccountStore.getState().account.publicKey
      if (!publicKey) {
        setTimeout(() => {
          initWebSocket(updatePeachWS, updateMessage)()
        }, INIT_RETRY_INTERVAL)
        return () => {}
      }

      const ws = createWebsocket()

      updatePeachWS(ws)

      const onMessageHandler = (message: any) => {
        info('MESSAGE', JSON.stringify(message).length)
        if (message?.error) updateMessage({
          msgKey: message.error,
          level: 'ERROR',
        })
      }

      const onCloseHandler = () => {
        info('CLOSE')
        setTimeout(() => {
          initWebSocket(updatePeachWS, updateMessage)()
        }, RETRY_INTERVAL)
      }

      if (!ws.listeners.message.some((cllbck) => cllbck.toString() === onMessageHandler.toString())) {
        ws.on('message', onMessageHandler)
      }
      if (!ws.listeners.message.some((cllbck) => cllbck.toString() === onCloseHandler.toString())) {
        ws.on('close', onCloseHandler)
      }

      return () => {
        ws.listeners = { message: [], close: [] }
        ws.close()
      }
    }
