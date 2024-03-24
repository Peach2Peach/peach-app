import { ReactTestRendererJSON } from "react-test-renderer";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render } from "test-utils";
import { sellOffer } from "../../tests/unit/data/offerData";
import { useConfigStore } from "../store/configStore/configStore";
import { WronglyFundedPopup } from "./WronglyFundedPopup";
expect.extend({ toMatchDiffSnapshot });

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
    fundingLiquid: { txIds: ["1"], amounts: [actualAmount] } as FundingStatus,
  };
  const incorrectlyFundedOffer = {
    ...sellOffer,
    amount,
    funding: { txIds: ["1", "2"], amounts: [amount] } as FundingStatus,
    fundingLiquid: { txIds: ["1", "2"], amounts: [amount] } as FundingStatus,
  };
  let base: ReactTestRendererJSON | ReactTestRendererJSON[] | null;

  beforeEach(() => {
    useConfigStore.setState({ maxTradingAmount });
  });
  it("uses WrongFundingAmount as content if there is only one utxo", () => {
    const { toJSON, queryByText } = render(
      <WronglyFundedPopup sellOffer={wronglyFundedOffer} />,
    );

    base = toJSON();
    expect(queryByText("trading limit exceeded")).not.toBeNull();
    expect(base).toMatchSnapshot();
  });
  it("uses WrongFundingAmount as content if there is only one utxo for liquid", () => {
    const { toJSON } = render(
      <WronglyFundedPopup
        sellOffer={{ ...wronglyFundedOffer, escrowType: "liquid" }}
      />,
    );

    expect(toJSON()).toMatchDiffSnapshot(base);
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
