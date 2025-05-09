import { renderHook, waitFor } from "test-utils";
import { contractSummary } from "../../../peach-api/src/testData/contractSummary";
import { buyOfferSummary } from "../../../tests/unit/data/offerSummaryData";
import { useTradeSummaries } from "./useTradeSummaries";

jest.useFakeTimers();

describe("useTradeSummaries", () => {
  it("should return a list of trade summaries", async () => {
    const { result } = renderHook(useTradeSummaries);

    await waitFor(() => {
      expect(result.current.summaries).toEqual({
        "yourTrades.buy": [contractSummary, buyOfferSummary],
        "yourTrades.sell": [],
        "yourTrades.history": [],
      });
    });
  });
});
