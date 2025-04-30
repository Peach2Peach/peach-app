import * as RNFS from "@dr.pogodin/react-native-fs";
import { appendFile } from "./appendFile";

describe("appendFile", () => {
  it("should append content to a file", async () => {
    const path = "test.txt";
    const content = "test";

    const wasSuccess = await appendFile(path, content);
    expect(wasSuccess).toBe(true);
    expect(RNFS.appendFile).toHaveBeenCalledWith(
      RNFS.DocumentDirectoryPath + path,
      content,
      "utf8",
    );
  });

  it("should append content to a file with newline", async () => {
    const path = "test.txt";
    const content = "test";

    const wasSuccess = await appendFile(path, content, true);
    expect(wasSuccess).toBe(true);
    expect(RNFS.appendFile).toHaveBeenCalledWith(
      RNFS.DocumentDirectoryPath + path,
      "\ntest",
      "utf8",
    );
  });

  it("should catch error", async () => {
    const path = "test.txt";
    const content = "test";

    const appendFileSpy = jest.spyOn(RNFS, "appendFile");
    appendFileSpy.mockRejectedValueOnce(new Error("test"));

    const wasSuccess = await appendFile(path, content);
    expect(wasSuccess).toBe(false);
  });
});
