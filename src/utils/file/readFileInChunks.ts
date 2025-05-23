import RNFS from "react-native-fs";

const CHUNKSIZE = 1048576;

/**
 * @description This method is more leightweight on memory when reading bigger files
 */
export const readFileInChunks = async (uri: string) => {
  let content = "";
  let chunk = "";
  let index = 0;

  do {
    // eslint-disable-next-line no-await-in-loop
    chunk = await RNFS.read(uri, CHUNKSIZE, index * CHUNKSIZE, "utf8");
    content += chunk;
    index++;
  } while (chunk.length);
  return content;
};
