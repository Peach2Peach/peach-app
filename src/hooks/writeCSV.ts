import * as RNFS from "@dr.pogodin/react-native-fs";
import Share from "react-native-share";
import { writeFile } from "../utils/file/writeFile";
import { info } from "../utils/log/info";

export const writeCSV = async (
  csvValue: string,
  destinationFileName: string,
) => {
  await writeFile(`/${destinationFileName}`, csvValue);
  await Share.open({
    title: destinationFileName,
    url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
  }).catch((err) => info("Error sharing file", err));
};
