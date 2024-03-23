import { render, waitFor } from "test-utils";
import { getResult } from "../../../peach-api/src/utils/result";
import { transaction } from "../../../tests/unit/data/liquidBlockExplorerData";
import { liquidTransactionHex } from "../../../tests/unit/data/liquidNetworkData";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../utils/wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { setLiquidWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { TransactionDetailsLiquid } from "./TransactionDetailsLiquid";

jest.mock("../../utils/liquid/getTxHex");
const getTxHexMock = jest
  .requireMock("../../utils/liquid/getTxHex")
  .getTxHex.mockResolvedValue(getResult(liquidTransactionHex));

describe("TransactionDetailsLiquid", () => {
  beforeAll(() => {
    setRouteMock({
      name: "transactionDetailsLiquid",
      key: "transactionDetailsLiquid",
      params: { txId: transaction.txid },
    });
    const wallet = createTestWallet();
    setPeachWallet(new PeachWallet({ wallet }));
    setLiquidWallet(new PeachLiquidJSWallet({ wallet }));
    useLiquidWalletState.getState().setTransactions([transaction]);
  });
  it("should render correctly when loading", () => {
    const { toJSON } = render(<TransactionDetailsLiquid />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when loaded", async () => {
    const { toJSON, getByText } = render(<TransactionDetailsLiquid />);
    await waitFor(() => expect(getTxHexMock).toHaveBeenCalled());
    await waitFor(() => expect(getByText("amount")).toBeDefined());
    expect(toJSON()).toMatchSnapshot();
  });
});
