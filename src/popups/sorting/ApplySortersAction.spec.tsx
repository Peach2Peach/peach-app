import { fireEvent, render, waitFor } from "test-utils";
import { buyOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { matchesKeys } from "../../views/search/hooks/useOfferMatches";
import { ApplySortersAction } from "./ApplySortersAction";

const setSorterAction = jest.fn();
const defaultComponent = (
  <ApplySortersAction setSorterAction={setSorterAction} />
);
const closePopup = jest.fn();
jest.mock("../../components/popup/Popup");
jest
  .requireMock("../../components/popup/Popup")
  .useClosePopup.mockReturnValue(closePopup);
jest.useFakeTimers();
describe("ApplyBuyFilterAction", () => {
  beforeEach(() => {
    queryClient.resetQueries();
  });

  it("should apply the selected sorter", () => {
    const { getByText } = render(defaultComponent);
    const applyButton = getByText("apply");
    fireEvent.press(applyButton);
    expect(setSorterAction).toHaveBeenCalled();
  });

  it("should invalidate all matches queries", async () => {
    queryClient.setQueryData(matchesKeys.matches, { matches: [] });
    queryClient.setQueryData(matchesKeys.matchesByOfferId(buyOffer.id), {
      matches: [],
    });
    queryClient.setQueryData(
      matchesKeys.sortedMatchesForOffer(buyOffer.id, ["bestReputation"]),
      {
        matches: [],
      },
    );

    const { getByText } = render(defaultComponent);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);

    await waitFor(() => {
      expect(
        queryClient.getQueryState(matchesKeys.matches)?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(matchesKeys.matchesByOfferId(buyOffer.id))
          ?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(
          matchesKeys.sortedMatchesForOffer(buyOffer.id, ["bestReputation"]),
        )?.isInvalidated,
      ).toBe(true);
    });
  });

  it("should close the popup", async () => {
    const { getByText } = render(defaultComponent);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);
    await waitFor(() => expect(closePopup).toHaveBeenCalled());
  });
});
