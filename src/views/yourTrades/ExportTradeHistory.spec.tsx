import * as RNFS from "@dr.pogodin/react-native-fs";
import Share from "react-native-share";
import { fireEvent, render, waitFor } from "test-utils";
import { ContractSummary } from "../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../peach-api/src/@types/offer";
import { tradeSummary } from "../../../tests/unit/data/tradeSummaryData";
import { MSINAMONTH } from "../../constants";
import { ExportTradeHistory } from "./ExportTradeHistory";

jest.mock("../../hooks/query/useTradeSummaries");
const useTradeSummariesMock = jest
  .requireMock("../../hooks/query/useTradeSummaries")
  .useTradeSummaries.mockImplementation(
    (): {
      summaries: {
        "yourTrades.buy": (ContractSummary | OfferSummary)[];
        "yourTrades.sell": (ContractSummary | OfferSummary)[];
        "yourTrades.history": (ContractSummary | OfferSummary)[];
      };
    } => ({
      summaries: {
        "yourTrades.buy": [tradeSummary],
        "yourTrades.sell": [],
        "yourTrades.history": [],
      },
    }),
  );

jest.useFakeTimers();

describe("ExportTradeHistory", () => {
  const firstCSVRow = "Date, Trade ID, Type, Amount, Price, Currency\n";
  it("should render correctly", () => {
    const { toJSON } = render(<ExportTradeHistory />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should create a csv with correct columns", () => {
    const { getByText } = render(<ExportTradeHistory />);
    const exportButton = getByText("export");

    fireEvent.press(exportButton);

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      "DDirPath//trade-history.csv",
      firstCSVRow,
      "utf8",
    );
  });
  it("should add a row for each transaction", () => {
    const dateLastTrade = new Date(
      tradeSummary.lastModified.getTime() - MSINAMONTH,
    );
    useTradeSummariesMock.mockReturnValueOnce({
      summaries: {
        "yourTrades.buy": [],
        "yourTrades.sell": [],
        "yourTrades.history": [
          tradeSummary,
          {
            ...tradeSummary,
            id: "1-2",
            currency: "EUR",
            price: 10,
            creationDate: dateLastTrade,
          },
        ],
      },
    });
    const { getByText } = render(<ExportTradeHistory />);
    const exportButton = getByText("export");

    fireEvent.press(exportButton);

    expect(RNFS.writeFile).toHaveBeenCalledWith(
      "DDirPath//trade-history.csv",
      `${firstCSVRow}02/12/2022, PC-1-2, sold, 50000, 10.00, EUR\n01/01/2023, P-27D, canceled, 50000, , \n`,
      "utf8",
    );
  });

  it("should open the native share sheet when the export button is pressed", async () => {
    const { getByText } = render(<ExportTradeHistory />);
    const exportButton = getByText("export");

    fireEvent.press(exportButton);

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: "trade-history.csv",
        url: "file://DDirPath//trade-history.csv",
      });
    });
  });
});
