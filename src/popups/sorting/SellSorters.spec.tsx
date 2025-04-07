import { fireEvent, render, waitFor } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";
import { SellSorters } from "./SellSorters";

jest.useFakeTimers();

const closePopup = jest.fn();
jest.mock("../../components/popup/GlobalPopup");
jest
  .requireMock("../../components/popup/GlobalPopup")
  .useClosePopup.mockReturnValue(closePopup);

describe("SellSorters", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<SellSorters onApply={placeholderFunction} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

const placeholderFunction = () => {};

describe("ApplySellSorterAction", () => {
  it("should apply the selected sorter", () => {
    const { getByText } = render(<SellSorters onApply={placeholderFunction} />);
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
    queryClient.setQueryData(matchesKeys.matchesForOffer(sellOffer.id), {
      matches: [],
    });
    queryClient.setQueryData(
      matchesKeys.sortedMatchesForOffer(sellOffer.id, ["bestReputation"]),
      {
        matches: [],
      },
    );

    const { getByText } = render(<SellSorters onApply={placeholderFunction} />);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);

    await waitFor(() => {
      expect(
        queryClient.getQueryState(matchesKeys.matches)?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(matchesKeys.matchesForOffer(sellOffer.id))
          ?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(
          matchesKeys.sortedMatchesForOffer(sellOffer.id, ["bestReputation"]),
        )?.isInvalidated,
      ).toBe(true);
    });
  });

  it("should close the popup", async () => {
    const { getByText } = render(<SellSorters onApply={placeholderFunction} />);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);
    await waitFor(() => {
      expect(closePopup).toHaveBeenCalled();
    });
  });
});
