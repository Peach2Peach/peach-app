import * as RNFS from "@dr.pogodin/react-native-fs";
import CryptoJS from "react-native-crypto-js";
import { readFile } from "./readFile";

describe("readFile", () => {
  it("should handle readFile error", async () => {
    jest.spyOn(RNFS, "readFile").mockRejectedValueOnce(new Error("test"));
    const path = "test.txt";

    const result = await readFile(path);
    expect(result).toBe("");
  });

  it("should handle decrypt error", async () => {
    await RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}test.txt`,
      "encryptedtest",
      "utf8",
    );
    CryptoJS.AES.decrypt.mockImplementationOnce(() => {
      throw new Error("test");
    });
    const path = "test.txt";
    const password = "test";

    const result = await readFile(path, password);
    expect(result).toBe("encryptedtest");
  });

  it("should return the file content", async () => {
    await RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}test.txt`,
      "test",
      "utf8",
    );

    const path = "test.txt";

    const result = await readFile(path);
    expect(result).toBe("test");
  });

  it("should decrypt the file content", async () => {
    await RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}test.txt`,
      "encryptedtest",
      "utf8",
    );

    const path = "test.txt";
    const password = "test";

    const result = await readFile(path, password);
    expect(result).toBe("decryptedtest");
  });
});
