import { act, fireEvent, render, waitFor } from "test-utils";
import { getResult } from "../../peach-api/src/utils/result";
import { buyOffer } from "../../tests/unit/data/offerData";
import { GlobalPopup } from "../components/popup/GlobalPopup";
import { peachAPI } from "../utils/peachAPI";
import { CancelOfferPopup } from "./CancelOfferPopup";

jest.mock("../utils/offer/saveOffer");
jest.useFakeTimers();
jest
  .spyOn(peachAPI.private.offer, "getOfferDetails")
  .mockResolvedValue(getResult(buyOffer));

describe("CancelOfferPopup", () => {
  it("should show cancel offer confirmation popup", async () => {
    const { getAllByText } = render(<CancelOfferPopup offerId={buyOffer.id} />);
    await act(async () => {
      await jest.runAllTimersAsync();
    });
    fireEvent.press(getAllByText("cancel offer")[1]);

    const { queryByText } = render(<GlobalPopup />);

    await waitFor(() => {
      expect(queryByText("offer canceled!")).toBeTruthy();
    });
  });
});
