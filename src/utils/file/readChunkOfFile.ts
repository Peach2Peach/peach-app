import RNFS from "react-native-fs";

export const readChunkOfFile = (
  uri: string,
  chunksize: number,
  index: number,
) => RNFS.read(uri, chunksize, index, "utf8");
