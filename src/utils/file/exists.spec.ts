import RNFS from "react-native-fs";
import { exists } from "./exists";

describe("exists", () => {
  it("should return false if file does not exist", async () => {
    const path = "test.txt";

    const doesExist = await exists(path);
    expect(doesExist).toBe(false);
  });

  it("should return true if file exists", async () => {
    const path = "test.txt";
    RNFS.writeFile(RNFS.DocumentDirectoryPath + path, "test", "utf8");

    const doesExist = await exists(path);
    expect(doesExist).toBe(true);
  });
});
