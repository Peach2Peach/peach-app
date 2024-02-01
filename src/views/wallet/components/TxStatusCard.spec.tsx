import { fireEvent, render } from "test-utils";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { TxStatusCard } from "./TxStatusCard";

describe("TxStatusCard", () => {
  const date = new Date("2022-09-15T07:23:25.797Z");
  const baseTx: Pick<TransactionSummary, "amount" | "date"> = {
    amount: 123456,
    date,
  };
  const buyTradeTx = {
    ...baseTx,
    id: "buyTradeTx",
    type: "TRADE",
  } as const;
  const sentTx = {
    ...baseTx,
    id: "sendTx",
    type: "WITHDRAWAL",
  } as const;
  const refundTx = {
    ...baseTx,
    id: "refundTx",
    type: "REFUND",
  } as const;
  const receiveTx = {
    ...baseTx,
    id: "receiveTx",
    type: "DEPOSIT",
  } as const;
  const escrowFundedTx = {
    ...baseTx,
    id: "receiveTx",
    type: "ESCROWFUNDED",
  } as const;

  it("should render correctly for a pending buy trade tx", () => {
    const { toJSON } = render(<TxStatusCard item={buyTradeTx} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a pending sent tx", () => {
    const { toJSON } = render(<TxStatusCard item={sentTx} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a pending refund tx", () => {
    const { toJSON } = render(<TxStatusCard item={refundTx} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a pending receive tx", () => {
    const { toJSON } = render(<TxStatusCard item={receiveTx} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for a escrow funded tx", () => {
    const { toJSON } = render(<TxStatusCard item={escrowFundedTx} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should navigate to the transaction details screen when pressed", () => {
    const { getByText } = render(<TxStatusCard item={receiveTx} />);
    fireEvent.press(getByText("received"));
    expect(navigateMock).toHaveBeenCalledWith("transactionDetails", {
      txId: "receiveTx",
    });
  });
  it("should not render the fiat price", () => {
    const { queryByText } = render(<TxStatusCard item={receiveTx} />);
    expect(queryByText("100.00 EUR")).toBeFalsy();
  });
});
