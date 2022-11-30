import RNFS from 'react-native-fs'

export const mkdir = async (path: string): Promise<void> => await RNFS.mkdir(RNFS.DocumentDirectoryPath + path)
