import { fireEvent, render } from "test-utils";
import { contractSummary } from "../../../../../tests/unit/data/contractSummaryData";
import { offerSummary } from "../../../../../tests/unit/data/offerSummaryData";
import { useTradeSummaryStore } from "../../../../store/tradeSummaryStore";
import { TransactionHeader } from "./TransactionHeader";

const goToOfferMock = jest.fn();
const navigateToOfferOrContractMock = jest.fn().mockReturnValue(goToOfferMock);
jest.mock("../../../../hooks/useTradeNavigation");
jest
  .requireMock("../../../../hooks/useTradeNavigation")
  .useTradeNavigation.mockImplementation(navigateToOfferOrContractMock);

describe("TransactionHeader", () => {
  const buyOfferData: OfferData = {
    offerId: offerSummary.id,
    address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
    amount: contractSummary.amount,
    contractId: undefined,
    currency: undefined,
    price: undefined,
  };

  const buyOfferWithContractData: OfferData = {
    offerId: offerSummary.id,
    contractId: contractSummary.id,
    amount: contractSummary.amount,
    address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
    currency: "EUR",
    price: 21,
  };

  beforeAll(() => {
    useTradeSummaryStore
      .getState()
      .setContract(contractSummary.id, contractSummary);
    useTradeSummaryStore.getState().setOffer(offerSummary.id, offerSummary);
  });
  it("should render correctly buy trade", () => {
    const { toJSON } = render(
      <TransactionHeader type="TRADE" offerData={[buyOfferData]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a receiving transaction", () => {
    const { toJSON } = render(
      <TransactionHeader type="DEPOSIT" offerData={[]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a funding escrow transaction with offer id", () => {
    const { toJSON } = render(
      <TransactionHeader type="ESCROWFUNDED" offerData={[buyOfferData]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a funding escrow transaction with contract id", () => {
    const { toJSON } = render(
      <TransactionHeader
        type="ESCROWFUNDED"
        offerData={[buyOfferWithContractData]}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for an outgoing transaction", () => {
    const { toJSON } = render(
      <TransactionHeader type="WITHDRAWAL" offerData={[]} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a refund transaction", () => {
    const { toJSON } = render(
      <TransactionHeader
        type="REFUND"
        offerData={[buyOfferWithContractData]}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should go to contract", () => {
    const { getByText } = render(
      <TransactionHeader
        type="REFUND"
        offerData={[buyOfferWithContractData]}
      />,
    );
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(contractSummary);
    fireEvent.press(getByText("PC‑7B‑1C8"));
    expect(goToOfferMock).toHaveBeenCalled();
  });
  it("should go to offer", () => {
    const { getByText } = render(
      <TransactionHeader type="ESCROWFUNDED" offerData={[buyOfferData]} />,
    );
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(offerSummary);
    fireEvent.press(getByText("P‑1C8"));
    expect(goToOfferMock).toHaveBeenCalled();
  });
});
