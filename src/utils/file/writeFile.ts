import * as RNFS from "@dr.pogodin/react-native-fs";
import { Platform } from "react-native";
import { encrypt } from "../crypto/encrypt";
import { error } from "../log/error";
import { info } from "../log/info";

export const writeFile = async (
  path: string,
  content: string,
  password?: string,
) => {
  info(password ? "Writing encrypted file" : "Writing file", path);
  let encrypted;
  try {
    if (password) {
      encrypted = encrypt(content, password);
    } else {
      encrypted = content;
    }
  } catch (e) {
    error("Data could not be encrypted", e);
    return false;
  }
  try {
    await RNFS.writeFile(
      (Platform.OS === "ios"
        ? RNFS.DocumentDirectoryPath
        : RNFS.CachesDirectoryPath) + path,
      encrypted,
      "utf8",
    );
    return true;
  } catch (e) {
    error("File could not be written", e);
    return false;
  }
};
