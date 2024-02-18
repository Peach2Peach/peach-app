import RNFS from "react-native-fs";
import Share from "react-native-share";
import { fireEvent, render, waitFor } from "test-utils";
import { ExportTransactionHistory } from "./ExportTransactionHistory";

jest.mock("../../utils/date/toShortDateFormat");
const toShortDateFormatMock = jest.requireMock(
  "../../utils/date/toShortDateFormat",
).toShortDateFormat;

const mockUseTxSummaries = jest.fn();
jest.mock("./helpers/useTxSummaries", () => ({
  useTxSummaries: () => mockUseTxSummaries(),
}));

jest.useFakeTimers();
describe("ExportTransactionHistory", () => {
  const firstCSVRow = "Date, Type, Amount, Transaction ID\n";
  it("should render correctly", () => {
    const { toJSON } = render(<ExportTransactionHistory />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should create a csv with date, type, amount, and transaction ID", () => {
    mockUseTxSummaries.mockReturnValue([]);
    const { getByText } = render(<ExportTransactionHistory />);
    const exportButton = getByText("export");

    fireEvent.press(exportButton);

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      "DDirPath//transaction-history.csv",
      firstCSVRow,
      "utf8",
    );
  });
  it("should add a row for each transaction", () => {
    mockUseTxSummaries.mockReturnValue([
      {
        data: { id: "1", date: new Date(), type: "WITHDRAWAL", amount: 189000 },
      },
      {
        data: { id: "2", date: new Date(), type: "WITHDRAWAL", amount: 42000 },
      },
    ]);
    const { getByText } = render(<ExportTransactionHistory />);
    const exportButton = getByText("export");
    toShortDateFormatMock.mockReturnValue("18/08/2023 19:50");

    fireEvent.press(exportButton);

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      "DDirPath//transaction-history.csv",
      `${firstCSVRow}18/08/2023 19:50, WITHDRAWAL, 189000, 1\n18/08/2023 19:50, WITHDRAWAL, 42000, 2\n`,
      "utf8",
    );
  });

  it("should open the native share sheet when the export button is pressed", async () => {
    const { getByText } = render(<ExportTransactionHistory />);
    const exportButton = getByText("export");

    fireEvent.press(exportButton);

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: "transaction-history.csv",
        url: "file://DDirPath//transaction-history.csv",
      });
    });
  });
});
