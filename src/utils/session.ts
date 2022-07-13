import EncryptedStorage from 'react-native-encrypted-storage' // TODO can be removed before September
import { MMKVLoader } from 'react-native-mmkv-storage'

const storage = new MMKVLoader()
  .withEncryption()
  .withInstanceID('session')
  .initialize()

export let session: Session = {
  initialized: false,
  notifications: 0,
}

/**
 * @description Method to update session with new values
 * WARNING: do no call this method from background tasks (i.e. phone is locked)
 * @param sess updated session
 * @returns new sessions
 */
export const setSession = async (sess: object): Promise<Session> => {
  session = {
    ...session,
    ...sess,
    initialized: true
  }
  await storage.setItem('session', JSON.stringify(session))

  return session
}

/**
 * @description Method to get session
 * @returns session
 */
export const getSession = () => session

/**
 * @description Method to initialise local user session from encrypted storage
 */
export const initSession = async (): Promise<Session> => {
  let result = await storage.getItem('session')
  if (!result) {
    // TODO remove fallback before September
    result = await EncryptedStorage.getItem('session') as string
  }

  if (result) {
    session = JSON.parse(result)
    delete session.peachInfo // TODO remove with EncryptedStorage
    return session
  }

  return session
}