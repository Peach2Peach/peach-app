import RNFS from 'react-native-fs'

export const readDir = async (path: string): Promise<string[]> =>
  (await RNFS.readDir(RNFS.DocumentDirectoryPath + path)).map((file) =>
    file.path.replace(RNFS.DocumentDirectoryPath, ''),
  )
