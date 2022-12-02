import { IOSAccessibleStates, MMKVLoader } from 'react-native-mmkv-storage'

const createStorage = (id: string) =>
  new MMKVLoader()
    .setAccessibleIOS(IOSAccessibleStates.AFTER_FIRST_UNLOCK)
    .withEncryption()
    .withInstanceID(id)
    .initialize()

export const accountStorage = createStorage('account')
export const offerStorage = createStorage('offers')
export const contractStorage = createStorage('contracts')
export const chatStorage = createStorage('chats')
