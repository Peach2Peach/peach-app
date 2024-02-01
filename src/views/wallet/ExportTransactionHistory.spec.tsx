import RNFS from "react-native-fs";
import Share from "react-native-share";
import { fireEvent, render, waitFor } from "test-utils";
import { useWalletState } from "../../utils/wallet/walletStore";
import { ExportTransactionHistory } from "./ExportTransactionHistory";

const toShortDateFormatMock = jest.fn();
jest.mock("../../utils/date/toShortDateFormat", () => ({
  toShortDateFormat: (...args: unknown[]) => toShortDateFormatMock(...args),
}));
jest.useFakeTimers();
describe("ExportTransactionHistory", () => {
  const firstCSVRow = "Date, Type, Amount, Transaction ID\n";
  it("should render correctly", () => {
    const { toJSON } = render(<ExportTransactionHistory />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should create a csv with date, type, amount, and transaction ID", () => {
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
    useWalletState.setState({
      transactions: [
        { txid: "1", sent: 21000, received: 210000 },
        { txid: "2", sent: 42000, received: 0 },
      ],
      txOfferMap: { "1": ["1"], "2": ["2"] },
    });
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
