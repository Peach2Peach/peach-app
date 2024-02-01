import CryptoJS from "react-native-crypto-js";
import RNFS from "react-native-fs";
import { writeFile } from "./writeFile";

describe("writeFile", () => {
  it("should handle encrypt error", async () => {
    CryptoJS.AES.encrypt.mockImplementationOnce(() => {
      throw new Error("test");
    });
    const path = "test.txt";
    const content = "test";
    const password = "test";

    const wasSuccess = await writeFile(path, content, password);
    expect(wasSuccess).toBe(false);
  });

  it("should handle write error", async () => {
    jest.spyOn(RNFS, "writeFile").mockRejectedValueOnce(new Error("test"));
    const path = "test.txt";
    const content = "test";
    const password = "test";

    const wasSuccess = await writeFile(path, content, password);
    expect(wasSuccess).toBe(false);
  });

  it("should write file", async () => {
    const path = "test.txt";
    const content = "test";

    const wasSuccess = await writeFile(path, content);
    expect(wasSuccess).toBe(true);
  });

  it("should write encrypted file", async () => {
    const path = "test.txt";
    const content = "test";
    const password = "test";

    const wasSuccess = await writeFile(path, content, password);
    expect(wasSuccess).toBe(true);
  });
});
