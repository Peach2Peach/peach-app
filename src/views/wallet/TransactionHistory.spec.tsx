import { fireEvent, render } from "test-utils";
import {
  confirmedTransactionSummary,
  pendingTransactionSummary,
} from "../../../tests/unit/data/transactionDetailData";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { TransactionHistory } from "./TransactionHistory";

const transactions: { data: TransactionSummary }[] = [
  { data: pendingTransactionSummary },
  { data: confirmedTransactionSummary },
];
jest.mock("./helpers/useTxSummaries");
const mockUseTxSummaries = jest
  .requireMock("./helpers/useTxSummaries")
  .useTxSummaries.mockReturnValue(transactions);

jest.useFakeTimers();

describe("TransactionHistory", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    peachWallet.initialized = true;
  });
  it("should render correctly when empty", () => {
    mockUseTxSummaries.mockReturnValueOnce([]);
    const { toJSON } = render(<TransactionHistory />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with tx", () => {
    const { toJSON } = render(<TransactionHistory />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should navigate to "exportTransactionHistory" when share icon is pressed', () => {
    const { getByAccessibilityHint } = render(<TransactionHistory />);
    const shareIcon = getByAccessibilityHint(
      "go to export transaction history",
    );
    fireEvent.press(shareIcon);

    expect(navigateMock).toHaveBeenCalledWith("exportTransactionHistory");
  });
});
