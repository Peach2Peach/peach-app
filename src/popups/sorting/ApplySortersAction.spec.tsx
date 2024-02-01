import { fireEvent, render, waitFor } from "test-utils";
import { buyOffer } from "../../../tests/unit/data/offerData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { ApplySortersAction } from "./ApplySortersAction";

const setSorterAction = jest.fn();
const defaultComponent = (
  <ApplySortersAction setSorterAction={setSorterAction} />
);
const closePopup = jest.fn();
jest.mock("../../components/popup/Popup", () => ({
  useClosePopup: () => closePopup,
}));
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
    queryClient.setQueryData(["matches"], { matches: [] });
    queryClient.setQueryData(["matches", buyOffer.id], { matches: [] });
    queryClient.setQueryData(["matches", buyOffer.id, "bestReputation"], {
      matches: [],
    });

    const { getByText } = render(defaultComponent);
    const applyButton = getByText("apply");

    fireEvent.press(applyButton);

    await waitFor(() => {
      expect(queryClient.getQueryState(["matches"])?.isInvalidated).toBe(true);
      expect(
        queryClient.getQueryState(["matches", buyOffer.id])?.isInvalidated,
      ).toBe(true);
      expect(
        queryClient.getQueryState(["matches", buyOffer.id, "bestReputation"])
          ?.isInvalidated,
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
