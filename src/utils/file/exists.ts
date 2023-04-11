import RNFS from 'react-native-fs'

export const exists = async (path: string): Promise<boolean> => await RNFS.exists(RNFS.DocumentDirectoryPath + path)
