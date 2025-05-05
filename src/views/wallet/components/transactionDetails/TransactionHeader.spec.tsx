import { fireEvent, render, waitFor } from "test-utils";
import { getResult } from "../../../../../peach-api/src/utils/result";
import { contractSummary } from "../../../../../tests/unit/data/contractSummaryData";
import { buyOfferSummary } from "../../../../../tests/unit/data/offerSummaryData";
import { queryClient } from "../../../../queryClient";
import { peachAPI } from "../../../../utils/peachAPI";
import { TransactionHeader } from "./TransactionHeader";

const goToOfferMock = jest.fn();
const navigateToOfferOrContractMock = jest.fn().mockReturnValue(goToOfferMock);
jest.mock("../../../../hooks/useTradeNavigation");
jest
  .requireMock("../../../../hooks/useTradeNavigation")
  .useTradeNavigation.mockImplementation(navigateToOfferOrContractMock);

jest.useFakeTimers();

describe("TransactionHeader", () => {
  const buyOfferData: OfferData = {
    offerId: buyOfferSummary.id,
    address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
    amount: contractSummary.amount,
    contractId: undefined,
    currency: undefined,
    price: undefined,
  };

  const buyOfferWithContractData: OfferData = {
    offerId: buyOfferSummary.id,
    contractId: contractSummary.id,
    amount: contractSummary.amount,
    address: "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
    currency: "EUR",
    price: 21,
  };

  jest
    .spyOn(peachAPI.private.offer, "getOfferSummaries")
    .mockResolvedValue(getResult([buyOfferSummary]));
  jest
    .spyOn(peachAPI.private.contract, "getContractSummaries")
    .mockResolvedValue(getResult([contractSummary]));

  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly buy trade", async () => {
    const { toJSON } = render(
      <TransactionHeader type="TRADE" offerData={[buyOfferData]} />,
    );

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a receiving transaction", async () => {
    const { toJSON } = render(
      <TransactionHeader type="DEPOSIT" offerData={[]} />,
    );

    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a funding escrow transaction with offer id", async () => {
    const { toJSON } = render(
      <TransactionHeader type="ESCROWFUNDED" offerData={[buyOfferData]} />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a funding escrow transaction with contract id", async () => {
    const { toJSON } = render(
      <TransactionHeader
        type="ESCROWFUNDED"
        offerData={[buyOfferWithContractData]}
      />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for an outgoing transaction", async () => {
    const { toJSON } = render(
      <TransactionHeader type="WITHDRAWAL" offerData={[]} />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a refund transaction", async () => {
    const { toJSON } = render(
      <TransactionHeader
        type="REFUND"
        offerData={[buyOfferWithContractData]}
      />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(toJSON()).toMatchSnapshot();
  });
  it("should go to contract", async () => {
    const { getByText } = render(
      <TransactionHeader
        type="REFUND"
        offerData={[buyOfferWithContractData]}
      />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(contractSummary);
    fireEvent.press(getByText("PC‑7B‑1C8"));
    expect(goToOfferMock).toHaveBeenCalled();
  });
  it("should go to offer", async () => {
    const { getByText } = render(
      <TransactionHeader type="ESCROWFUNDED" offerData={[buyOfferData]} />,
    );
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(navigateToOfferOrContractMock).toHaveBeenCalledWith(buyOfferSummary);
    fireEvent.press(getByText("P‑1C8"));
    expect(goToOfferMock).toHaveBeenCalled();
  });
});
