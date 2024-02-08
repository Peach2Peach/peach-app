import { createRenderer } from "react-test-renderer/shallow";
import {
  bdkTransactionWithRBF1,
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1Summary,
} from "../../../tests/unit/data/transactionDetailData";
import { TransactionDetails } from "./TransactionDetails";

const transactionDetailsSetupReturnValue = {
  localTx: bdkTransactionWithRBF1,
  transactionSummary: transactionWithRBF1Summary,
  transactionDetails: bitcoinJSTransactionWithRBF1,
};

jest.mock("./hooks/useTransactionDetailsSetup");
const useTransactionDetailsSetupMock = jest
  .requireMock("./hooks/useTransactionDetailsSetup")
  .useTransactionDetailsSetup.mockReturnValue(
    transactionDetailsSetupReturnValue,
  );

jest.mock("./hooks/useSyncWallet", () => ({
  useSyncWallet: jest.fn(() => ({ refetch: jest.fn(), isRefetching: false })),
}));

describe("TransactionDetails", () => {
  const renderer = createRenderer();
  it("renders correctly", () => {
    renderer.render(<TransactionDetails />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders loading screen if transaction has not been loaded yet", () => {
    useTransactionDetailsSetupMock.mockReturnValueOnce({
      ...transactionDetailsSetupReturnValue,
      localTx: undefined,
      transactionDetails: undefined,
      transactionSummary: undefined,
    });
    renderer.render(<TransactionDetails />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
