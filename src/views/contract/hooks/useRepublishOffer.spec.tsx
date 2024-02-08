import {
  fireEvent,
  render,
  renderHook,
  responseUtils,
  waitFor,
} from "test-utils";
import { replaceMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { Popup } from "../../../components/popup/Popup";
import { peachAPI } from "../../../utils/peachAPI";
import { useRepublishOffer } from "./useRepublishOffer";

const reviveSellOfferMock = jest.spyOn(
  peachAPI.private.offer,
  "republishSellOffer",
);

const mockSellOffer = {
  id: "offerId",
};
jest.mock("../../../utils/contract/getSellOfferFromContract", () => ({
  getSellOfferFromContract: jest.fn(() => mockSellOffer),
}));

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

jest.useFakeTimers();

describe("useRepublishOffer", () => {
  const contract = {
    id: "contractId",
    cancelConfirmationDismissed: false,
    cancelConfirmationPending: true,
  } as unknown as Contract;

  it("should revive the sell offer", async () => {
    const { result } = renderHook(useRepublishOffer);
    result.current.mutate(contract);
    await waitFor(() => {
      expect(reviveSellOfferMock).toHaveBeenCalledWith({
        offerId: mockSellOffer.id,
      });
    });
  });

  it("should show an error banner and close the popup if the sell offer could not be revived", async () => {
    reviveSellOfferMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useRepublishOffer);
    result.current.mutate(contract);
    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith("UNAUTHORIZED");
    });
    const { queryByText } = render(<Popup />);
    expect(queryByText("offer re-published")).toBeFalsy();
  });

  it("should show the offer republished popup", async () => {
    const { result } = renderHook(useRepublishOffer);
    result.current.mutate(contract);

    const { queryByText } = render(<Popup />);
    await waitFor(() => {
      expect(queryByText("offer re-published")).toBeTruthy();
    });
  });

  it("should close the popup, save the contract and navigate to contract when the close is pressed", async () => {
    const { result } = renderHook(useRepublishOffer);
    result.current.mutate(contract);
    const { getByText, queryByText } = render(<Popup />);
    await waitFor(() => {
      expect(queryByText("close")).toBeTruthy();
    });
    fireEvent.press(getByText("close"));
    expect(queryByText("offer re-published")).toBeFalsy();
    expect(replaceMock).toHaveBeenCalledWith("contract", {
      contractId: contract.id,
    });
  });

  it("should close the popup, save the contract and navigate to search when the go to offer is pressed", async () => {
    const { result } = renderHook(useRepublishOffer);
    result.current.mutate(contract);
    const { getByText, queryByText } = render(<Popup />);
    await waitFor(() => {
      expect(queryByText("go to offer")).toBeTruthy();
    });
    fireEvent.press(getByText("go to offer"));
    expect(queryByText("offer re-published")).toBeFalsy();
    expect(replaceMock).toHaveBeenCalledWith("search", {
      offerId: "newOfferId",
    });
  });
});
