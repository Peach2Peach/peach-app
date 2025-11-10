import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
  appendFile as appendFSFile,
  exists,
} from "@dr.pogodin/react-native-fs";
import { Platform } from "react-native";
import { error } from "../log/error";
import { writeFile } from "./writeFile";

export const appendFile = async (
  path: string,
  content: string,
  newline = false,
): Promise<boolean> => {
  let newFile;

  const dir =
    Platform.OS === "android" ? CachesDirectoryPath : DocumentDirectoryPath;

  if (!(await exists(dir + path))) {
    newFile = true;
    await writeFile(path, "");
  }

  try {
    await appendFSFile(
      dir + path,
      (!newFile && newline ? "\n" : "") + content,
      "utf8",
    );
    return true;
  } catch (e) {
    error("File could not be written", e);
    return false;
  }
};
