import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
} from "@dr.pogodin/react-native-fs";
import { Platform } from "react-native";
import Share from "react-native-share";
import { writeFile } from "../utils/file/writeFile";
import { info } from "../utils/log/info";

export const writeCSV = async (
  csvValue: string,
  destinationFileName: string,
) => {
  await writeFile(`/${destinationFileName}`, csvValue);
  const dir =
    Platform.OS === "android" ? CachesDirectoryPath : DocumentDirectoryPath;
  await Share.open({
    title: destinationFileName,
    url: `file://${dir}/${destinationFileName}`,
  }).catch((err) => info("Error sharing file", err));
};
