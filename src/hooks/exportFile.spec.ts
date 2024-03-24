import RNFS from "react-native-fs";
import Share from "react-native-share";
import { waitFor } from "test-utils";
import { exportFile } from "./exportFile";

jest.useFakeTimers();
describe("useWriteCSV", () => {
  const csvValue = "header 1, header 2\nvalue 1, value 2\n";
  const destinationFileName = "test.csv";
  it("should create a file", async () => {
    exportFile(csvValue, destinationFileName);

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      `DDirPath//${destinationFileName}`,
      csvValue,
      "utf8",
    );

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: destinationFileName,
        url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
      });
    });
  });
});
