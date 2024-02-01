import RNFS from "react-native-fs";
import { deleteFile } from "./deleteFile";

describe("deleteFile", () => {
  it("should catch error", async () => {
    const path = "test.txt";
    jest.spyOn(RNFS, "unlink").mockRejectedValueOnce(new Error("test"));

    const wasSuccess = await deleteFile(path);
    expect(wasSuccess).toBe(false);
  });

  it("should delete a file", async () => {
    const path = "test.txt";

    const wasSuccess = await deleteFile(path);
    expect(wasSuccess).toBe(true);
  });
});
