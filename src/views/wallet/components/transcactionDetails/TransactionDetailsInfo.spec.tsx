import { createRenderer } from "react-test-renderer/shallow";
import { fireEvent, render } from "test-utils";
import {
  bdkTransactionWithRBF1,
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1Summary,
} from "../../../../../tests/unit/data/transactionDetailData";
import { TransactionDetailsInfo } from "./TransactionDetailsInfo";

const receivingAddress = "receivingAddress";
const goToBumpNetworkFeesMock = jest.fn();
const openInExplorerMock = jest.fn();
const useTransactionDetailsInfoSetupReturnValue = {
  receivingAddress,
  canBumpFees: true,
  goToBumpNetworkFees: goToBumpNetworkFeesMock,
  openInExplorer: openInExplorerMock,
};
jest.mock("../../hooks/useTransactionDetailsInfoSetup");
const useTransactionDetailsInfoSetupMock = jest
  .requireMock("../../hooks/useTransactionDetailsInfoSetup")
  .useTransactionDetailsInfoSetup.mockReturnValue(
    useTransactionDetailsInfoSetupReturnValue,
  );

jest.mock("../../hooks/useTxFeeRate", () => ({
  useTxFeeRate: jest.fn().mockReturnValue(2),
}));

jest.useFakeTimers();

describe("TransactionDetailsInfo", () => {
  const renderer = createRenderer();
  it("should render correctly for a pending transaction", () => {
    renderer.render(
      <TransactionDetailsInfo
        localTx={bdkTransactionWithRBF1}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{ ...transactionWithRBF1Summary, confirmed: false }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for a confirmed transaction", () => {
    useTransactionDetailsInfoSetupMock.mockReturnValueOnce({
      ...useTransactionDetailsInfoSetupReturnValue,
      canBumpFees: false,
    });

    renderer.render(
      <TransactionDetailsInfo
        localTx={bdkTransactionWithRBF1}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{
          ...transactionWithRBF1Summary,
          height: 1,
          confirmed: true,
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for a deposit transaction", () => {
    renderer.render(
      <TransactionDetailsInfo
        localTx={bdkTransactionWithRBF1}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{ ...transactionWithRBF1Summary, type: "DEPOSIT" }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it("should go to increase network fee screen if rbf is possible", () => {
    const { getByText } = render(
      <TransactionDetailsInfo
        localTx={bdkTransactionWithRBF1}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={transactionWithRBF1Summary}
      />,
    );
    fireEvent(getByText("increase network fee"), "onPress");
    expect(goToBumpNetworkFeesMock).toHaveBeenCalled();
  });
});
