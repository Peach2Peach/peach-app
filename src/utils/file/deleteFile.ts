import RNFS from "react-native-fs";
import { error } from "../log/error";

export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    await RNFS.unlink(RNFS.DocumentDirectoryPath + path);
    return true;
  } catch (e) {
    error("File could not be deleted", e);
    return false;
  }
};
