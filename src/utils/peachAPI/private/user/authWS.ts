import { crypto } from 'bitcoinjs-lib'
import { error } from '../../../log'
import { getPeachAccount } from '../../peachAccount'

/**
 * @description Method to authenticate with Peach WS API
 * @param ws the websocket
 */
export const authWS = (ws: WebSocket) => {
  const peachAccount = getPeachAccount()
  const message = 'Peach Registration ' + new Date().getTime()

  if (!peachAccount) {
    const authError = new Error('Peach Account not set')
    error(authError)
    throw authError
  }

  ws.send(
    JSON.stringify({
      path: '/v1/user/auth',
      publicKey: peachAccount.publicKey.toString('hex'),
      message,
      signature: peachAccount.sign(crypto.sha256(Buffer.from(message))).toString('hex'),
    }),
  )
}
