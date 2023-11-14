import { Dispatch, EffectCallback } from 'react'
import { useAccountStore } from '../utils/account/account'
import { info } from '../utils/log'
import { createWebsocket } from '../utils/peachAPI/websocket/createWebsocket'

export const initWebSocket
  = (updatePeachWS: Function, updateMessage: Dispatch<MessageState>): EffectCallback =>
    () => {
      const publicKey = useAccountStore.getState().account.publicKey
      if (!publicKey) {
        setTimeout(() => {
          initWebSocket(updatePeachWS, updateMessage)()
        }, 10000)
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
        }, 3000)
      }

      if (!ws.listeners.message.some((cllbck) => cllbck.toString() === onMessageHandler.toString())) {
        ws.on('message', onMessageHandler)
      }
      if (!ws.listeners.message.some((cllbck) => cllbck.toString() === onCloseHandler.toString())) {
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
