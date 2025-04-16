import RNFS from "react-native-fs";
import { readFileInChunks } from "./readFileInChunks";

describe("readFileInChunks", () => {
  it("should return the file content", async () => {
    const uri = `${RNFS.DocumentDirectoryPath}test.txt`;
    await RNFS.writeFile(uri, "this is a really big file", "utf8");

    const result = await readFileInChunks(uri);
    expect(result).toBe("this is a really big file");
  });
});
