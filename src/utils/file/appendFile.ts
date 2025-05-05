import {
  appendFile as appendFSFile,
  DocumentDirectoryPath,
  exists,
} from "@dr.pogodin/react-native-fs";
import { error } from "../log/error";
import { writeFile } from "./writeFile";

export const appendFile = async (
  path: string,
  content: string,
  newline = false,
): Promise<boolean> => {
  let newFile;

  if (!(await exists(DocumentDirectoryPath + path))) {
    newFile = true;
    await writeFile(path, "");
  }

  try {
    await appendFSFile(
      DocumentDirectoryPath + path,
      (!newFile && newline ? "\n" : "") + content,
      "utf8",
    );
    return true;
  } catch (e) {
    error("File could not be written", e);
    return false;
  }
};
