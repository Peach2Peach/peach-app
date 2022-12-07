import { IOSAccessibleStates, MMKVLoader } from 'react-native-mmkv-storage'

export const sessionStorage = new MMKVLoader()
  .setAccessibleIOS(IOSAccessibleStates.AFTER_FIRST_UNLOCK)
  .withEncryption()
  .withInstanceID('peachSession')
  .initialize()
