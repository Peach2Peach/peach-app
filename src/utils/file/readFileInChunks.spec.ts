import { DocumentDirectoryPath, writeFile } from "@dr.pogodin/react-native-fs";
import { readFileInChunks } from "./readFileInChunks";

describe("readFileInChunks", () => {
  it("should return the file content", async () => {
    const uri = `${DocumentDirectoryPath}test.txt`;
    await writeFile(uri, "this is a really big file", "utf8");

    const result = await readFileInChunks(uri);
    expect(result).toBe("this is a really big file");
  });
});
