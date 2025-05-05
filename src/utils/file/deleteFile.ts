import { DocumentDirectoryPath, unlink } from "@dr.pogodin/react-native-fs";
import { error } from "../log/error";

export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    await unlink(DocumentDirectoryPath + path);
    return true;
  } catch (e) {
    error("File could not be deleted", e);
    return false;
  }
};
