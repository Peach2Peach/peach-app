import { fireEvent, render } from "test-utils";
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from "../../../tests/unit/data/transactionDetailData";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../utils/wallet/setWallet";
import { TransactionHistoryLiquid } from "./TransactionHistoryLiquid";

const transactions: { data: TransactionSummary }[] = [
  { data: pendingTransactionSummary },
  { data: confirmedTransactionSummary },
];
jest.mock("./helpers/useTxSummariesLiquid");
const mockUseTxSummaries = jest
  .requireMock("./helpers/useTxSummariesLiquid")
  .useTxSummariesLiquid.mockReturnValue(transactions);

jest.useFakeTimers();

describe("TransactionHistoryLiquid", () => {
  let peachLiquidWallet: PeachLiquidJSWallet;
  beforeAll(() => {
    peachLiquidWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
    setLiquidWallet(peachLiquidWallet);
  });
  it("should render correctly when empty", () => {
    mockUseTxSummaries.mockReturnValueOnce([]);
    const { toJSON } = render(<TransactionHistoryLiquid />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with tx", () => {
    const { toJSON } = render(<TransactionHistoryLiquid />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should navigate to "exportTransactionHistory" when share icon is pressed', () => {
    const { getByAccessibilityHint } = render(<TransactionHistoryLiquid />);
    const shareIcon = getByAccessibilityHint(
      "go to export transaction history",
    );
    fireEvent.press(shareIcon);

    expect(navigateMock).toHaveBeenCalledWith("exportTransactionHistoryLiquid");
  });
});
