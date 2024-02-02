import { fireEvent, render } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { useConfigStore } from "../store/configStore/configStore";
import { WronglyFundedPopup } from "./WronglyFundedPopup";

const mockCancelAndStartRefundPopup = jest.fn();
jest.mock("./useCancelAndStartRefundPopup", () => ({
  useCancelAndStartRefundPopup: () => mockCancelAndStartRefundPopup,
}));

describe("useShowWronglyFundedPopup", () => {
  const maxTradingAmount = 2000000;
  const amount = 100000;
  const actualAmount = 110000;

  const wronglyFundedOffer = {
    ...sellOffer,
    amount,
    funding: { txIds: ["1"], amounts: [actualAmount] } as FundingStatus,
  };
  const incorrectlyFundedOffer = {
    ...sellOffer,
    amount,
    funding: { txIds: ["1", "2"], amounts: [amount] } as FundingStatus,
  };

  beforeEach(() => {
    useConfigStore.setState({ maxTradingAmount });
  });
  it("uses WrongFundingAmount as content if there is only one utxo", () => {
    const { queryByText } = render(
      <WronglyFundedPopup sellOffer={wronglyFundedOffer} />,
    );

    expect(queryByText("trading limit exceeded")).not.toBeNull();
    expect(queryByText("Incorrect funding")).toBeNull();
  });
  it("opens Incorrect Funding popup when funded with multiple transactions", () => {
    const { queryByText } = render(
      <WronglyFundedPopup sellOffer={incorrectlyFundedOffer} />,
    );

    expect(queryByText("Incorrect funding")).not.toBeNull();
    expect(queryByText("trading limit exceeded")).toBeNull();
  });
  it("starts refund process", () => {
    const { getByText } = render(
      <WronglyFundedPopup sellOffer={wronglyFundedOffer} />,
    );
    fireEvent.press(getByText("refund escrow"));
    expect(mockCancelAndStartRefundPopup).toHaveBeenCalledWith(
      wronglyFundedOffer,
    );
  });
});
