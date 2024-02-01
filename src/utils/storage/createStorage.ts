import { IOSAccessibleStates, MMKVLoader } from "react-native-mmkv-storage";

export const createStorage = (instanceId: string) =>
  new MMKVLoader()
    .setAccessibleIOS(IOSAccessibleStates.AFTER_FIRST_UNLOCK)
    .withEncryption()
    .withInstanceID(instanceId)
    .initialize();
