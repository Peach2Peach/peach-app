import { account } from '../utils/account'
import { info } from '../utils/log'
import { createWebsocket } from '../utils/peachAPI/websocket'

/**
 * @description Method to initialize web socket
 * @param updatePeachWS update function
 */
const initWebSocket = (updatePeachWS: Function) => {
  if (!account.publicKey) {
    setTimeout(() => {
      initWebSocket(updatePeachWS)
    }, 10000)
    return
  }

  const ws = createWebsocket()

  updatePeachWS(ws)

  ws.on('message', (message: Message) => {
    info('MESSAGE', message)
  })
  ws.on('close', () => {
    info('CLOSE')
    setTimeout(() => {
      initWebSocket(updatePeachWS)
    }, 3000)
  })
}

export default initWebSocket