import RNFS from "react-native-fs";

export const exists = (path: string) =>
  RNFS.exists(RNFS.DocumentDirectoryPath + path);
