import { Linking } from "react-native";
import { renderHook } from "test-utils";
import {
  bdkTransactionWithRBF2,
  bitcoinJSTransactionWithRBF2,
  bitcoinJSTransactionWithoutRBF1,
  transactionWithRBF2,
  transactionWithRBF2Summary,
  transactionWithoutRBF1Summary,
} from "../../../../tests/unit/data/transactionDetailData";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useTransactionDetailsInfoSetup } from "./useTransactionDetailsInfoSetup";

jest.mock("../../../utils/wallet/getNetwork", () => {
  const networks = jest.requireActual("bitcoinjs-lib").networks;
  return {
    getNetwork: jest.fn(() => networks.bitcoin),
  };
});
jest.mock("../../../hooks/wallet/useIsMyAddress", () => ({
  useAreMyAddresses: jest.fn().mockReturnValue([true, false]),
}));

describe("useTransactionDetailsInfoSetup", () => {
  const initialProps = {
    transactionDetails: bitcoinJSTransactionWithRBF2,
    transactionSummary: transactionWithRBF2Summary,
  };
  const peachWallet = new PeachWallet({ wallet: createTestWallet() });

  beforeAll(() => {
    useWalletState.getState().setTransactions([bdkTransactionWithRBF2]);
    peachWallet.transactions = [bdkTransactionWithRBF2];

    setPeachWallet(peachWallet);
  });

  it("should return defaults", () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps,
    });
    expect(result.current).toEqual({
      receivingAddress: transactionWithRBF2.vout[1].scriptpubkey_address,
      canBumpFees: true,
      goToBumpNetworkFees: expect.any(Function),
      openInExplorer: expect.any(Function),
    });
  });
  it("should set canBumpFees to false if tx is confirmed", () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps: {
        transactionDetails: bitcoinJSTransactionWithRBF2,
        transactionSummary: { ...transactionWithRBF2Summary, confirmed: true },
      },
    });
    expect(result.current.canBumpFees).toBeFalsy();
  });
  it("should set canBumpFees to false if tx does not support rbf", () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps: {
        transactionDetails: bitcoinJSTransactionWithoutRBF1,
        transactionSummary: {
          ...transactionWithoutRBF1Summary,
          confirmed: true,
        },
      },
    });
    expect(result.current.canBumpFees).toBeFalsy();
  });
  it("should go to bump network fees", () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps,
    });
    result.current.goToBumpNetworkFees();
    expect(navigateMock).toHaveBeenCalledWith("bumpNetworkFees", {
      txId: transactionWithRBF2Summary.id,
    });
  });
  it("should open transaction in explorer", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);

    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps,
    });
    await result.current.openInExplorer();
    expect(openURL).toHaveBeenCalledWith(
      `https://localhost:3000/tx/${transactionWithRBF2Summary.id}`,
    );
  });
});
