import { IOSAccessibleStates, MMKVLoader } from 'react-native-mmkv-storage'
import { info, error } from './log'
import { isIOS } from './system'

const storage = new MMKVLoader()
  .setAccessibleIOS(IOSAccessibleStates.AFTER_FIRST_UNLOCK)
  .withEncryption()
  .withInstanceID('peachSession')
  .initialize()

export let session: Session = {
  initialized: false,
  notifications: 0,
}

/**
 * @description Method to update session item with new value
 * WARNING: do no call this method from background tasks (i.e. phone is locked)
 * @param key key to store under
 * @param value value to store
 * @returns new sessions
 */
export const setSessionItem = async (key: string, value: any): Promise<void> => {
  info(`setSessionItem - ${key}`)
  if (!session.initialized) storage.setBool('initialized', true)

  session = {
    ...session,
    initialized: true,
    [key]: value,
  }

  if (value instanceof Object) {
    await storage.setItem(key, JSON.stringify(value))
  } else {
    await storage.setItem(key, String(value))
  }
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
  if (isIOS()) info('Initialised secure storage with accessible mode: ', storage.options.accessibleMode)

  const [initialized, password, notifications, peachInfo, unsavedPaymentData] = await Promise.all([
    storage.getBoolAsync('initialized'),
    storage.getItem('password'),
    storage.getItem('notifications'),
    storage.getItem('peachInfo'),
    storage.getItem('unsavedPaymentData'),
  ])

  let parsedPeachInfo
  let parsedPaymentData: PaymentData[] = []
  try {
    if (peachInfo) {
      parsedPeachInfo = JSON.parse(peachInfo)
    }
    if (unsavedPaymentData) {
      parsedPaymentData = JSON.parse(unsavedPaymentData) as PaymentData[]
    }
  } catch (e) {
    error(e)
  }

  session = {
    ...session,
    initialized: Boolean(initialized),
    password: password || undefined,
    notifications: notifications ? Number(notifications) : 0,
    peachInfo: parsedPeachInfo,
    unsavedPaymentData: parsedPaymentData,
  }

  if (!initialized) {
    const oldStorage = new MMKVLoader().withEncryption()
      .withInstanceID('session')
      .initialize()

    if (isIOS()) info('Initialised old secure storage with accessible mode: ', oldStorage.options.accessibleMode)

    const dbSess = await oldStorage.getItem('session')
    if (dbSess) {
      const parsedDbSess = JSON.parse(dbSess)
      // migrate to new data structure
      // @TODO remove by June 2023
      await Promise.all(Object.keys(parsedDbSess).map((key) => setSessionItem(key, parsedDbSess[key])))
      return session
    }
  }

  return session
}
