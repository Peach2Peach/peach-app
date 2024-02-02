import { fireEvent, render, waitFor } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";
import { SellSorters } from "./SellSorters";

jest.useFakeTimers();

const closePopup = jest.fn();
jest.mock("../../components/popup/Popup");
jest
  .requireMock("../../components/popup/Popup")
  .useClosePopup.mockReturnValue(closePopup);

describe("SellSorters", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<SellSorters />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("ApplySellSorterAction", () => {
  it("should apply the selected sorter", () => {
    const { getByText } = render(<SellSorters />);
    const applyButton = getByText("apply");
    const highestPriceButton = getByText("highest price first");

    fireEvent.press(highestPriceButton);
    fireEvent.press(applyButton);

    expect(useOfferPreferences.getState().sortBy.sellOffer).toEqual([
      "highestPrice",
    ]);
  });

  it("should invalidate all matches queries", async () => {
    queryClient.setQueryData(matchesKeys.matches, { matches: [] });
    queryClient.setQueryData(matchesKeys.matchesByOfferId(sellOffer.id), {
      matches: [],
    });
    queryClient.setQueryData(
      matchesKeys.sortedMatchesByOfferId(sellOffer.id, ["bestReputation"]),
      {
        matches: [],
      },
    );

    const { getByText } = render(<SellSorters />);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);

    await waitFor(() => {
      expect(
        queryClient.getQueryState(matchesKeys.matches)?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(matchesKeys.matchesByOfferId(sellOffer.id))
          ?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(
          matchesKeys.sortedMatchesByOfferId(sellOffer.id, ["bestReputation"]),
        )?.isInvalidated,
      ).toBe(true);
    });
  });

  it("should close the popup", async () => {
    const { getByText } = render(<SellSorters />);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);
    await waitFor(() => {
      expect(closePopup).toHaveBeenCalled();
    });
  });
});
