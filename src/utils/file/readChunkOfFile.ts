import RNFS from 'react-native-fs'

export const readChunkOfFile = async (uri: string, chunksize: number, index: number): Promise<string> =>
  await RNFS.read(uri, chunksize, index, 'utf8')
