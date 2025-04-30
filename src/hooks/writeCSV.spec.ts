import * as RNFS from "@dr.pogodin/react-native-fs";
import Share from "react-native-share";
import { waitFor } from "test-utils";
import { writeCSV } from "./writeCSV";

jest.useFakeTimers();
describe("useWriteCSV", () => {
  const csvValue = "header 1, header 2\nvalue 1, value 2\n";
  const destinationFileName = "test.csv";
  it("should create a CSV file", async () => {
    await writeCSV(csvValue, destinationFileName);

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
