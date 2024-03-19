import RNFS from "react-native-fs";
import Share from "react-native-share";
import { writeFile } from "../utils/file/writeFile";
import { info } from "../utils/log/info";

export const exportFile = async (
  content: string,
  destinationFileName: string,
) => {
  await writeFile(`/${destinationFileName}`, content);
  await Share.open({
    title: destinationFileName,
    url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
  }).catch((err) => info("Error sharing file", err));
};
