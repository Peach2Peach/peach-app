import { authWS } from '../private/user'
import { peachWS, ws } from '.'

export const onOpenHandler = () => {
  peachWS.connected = true
  authWS(ws)

  // if a queue built up while offline, now send what has queued up
  peachWS.queue = peachWS.queue.filter((callback) => !callback())
}
