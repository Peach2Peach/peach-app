/* eslint-disable no-magic-numbers */
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { act } from "react-test-renderer";
import { fireEvent, render, renderHook, responseUtils } from "test-utils";
import { defaultUser } from "../../../../peach-api/src/testData/userData";
import { estimatedFees as mockEstimatedFees } from "../../../../tests/unit/data/bitcoinNetworkData";
import { utxo } from "../../../../tests/unit/data/liquidBlockExplorerData";
import { liquidTransactionHex } from "../../../../tests/unit/data/liquidNetworkData";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { GlobalPopup } from "../../../components/popup/GlobalPopup";
import { useConfigStore } from "../../../store/configStore/configStore";
import { getDefaultFundingStatus } from "../../../utils/offer/constants";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { setLiquidWallet } from "../../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../../utils/wallet/useLiquidWalletState";
import { useFundFromPeachLiquidWallet } from "./useFundFromPeachLiquidWallet";

const transactionError = new Error(
  `InsufficientFunds: Insufficient funds: 78999997952 sat available of 1089000 sat needed`,
);
jest.mock("../../../hooks/query/useLiquidFeeEstimate", () => ({
  useLiquidFeeEstimate: () => ({ estimatedFees: mockEstimatedFees }),
}));

jest.mock("../../../utils/wallet/liquid/buildTransactionWithFeeRate");
const liquidTransaction = LiquidTransaction.fromHex(liquidTransactionHex);
const buildTransactionWithFeeRateMock = jest
  .requireMock("../../../utils/wallet/liquid/buildTransactionWithFeeRate")
  .buildTransactionWithFeeRate.mockReturnValue(liquidTransaction);

jest.mock("../../../utils/wallet/bitcoin/transaction/setMultipleRecipients");

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));
jest.useFakeTimers();

jest.spyOn(peachAPI.private.user, "getSelfUser").mockResolvedValue({
  result: { ...defaultUser, feeRate: mockEstimatedFees.halfHourFee },
  ...responseUtils,
});

const mockSyncWallet = jest.fn().mockResolvedValue(undefined);

describe("useFundFromPeachLiquidWallet", () => {
  const amount = sellOffer.amount;
  const minTradingAmount = 50000;
  const address = sellOffer.escrows.liquid;
  const offerId = sellOffer.id;
  const initialProps = {
    offerId,
    address,
    amount: 615000,
    ...getDefaultFundingStatus(sellOffer.id),
  };
  const postTxSpy = jest.spyOn(peachAPI.public.liquid, "postTx");

  beforeAll(() => {
    useConfigStore.getState().setMinTradingAmount(minTradingAmount);
  });

  let peachLiquidWallet: PeachLiquidJSWallet;
  beforeEach(() => {
    peachLiquidWallet = new PeachLiquidJSWallet({
      wallet: createTestWallet(),
      network: getLiquidNetwork(),
    });
    peachLiquidWallet.syncWallet = mockSyncWallet;

    setLiquidWallet(peachLiquidWallet);
  });
  it("should return default values", () => {
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    expect(result.current).toEqual(expect.any(Function));
  });
  it("should return undefined if escrow is already funded", async () => {
    useLiquidWalletState.getState().setBalance(amount);
    const { result } = renderHook(useFundFromPeachLiquidWallet);
    const res = await result.current({
      offerId,
      address,
      amount: 615000,
      fundingStatus: "FUNDED",
    });
    expect(res).toBeUndefined();
  });
  it("should handle other finishTransaction transaction errors", async () => {
    useLiquidWalletState.getState().setBalance(amount);
    buildTransactionWithFeeRateMock.mockImplementationOnce(() => {
      throw Error("UNAUTHORIZED");
    });
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith(new Error("UNAUTHORIZED"));
  });
  it("should open confirmation popup", async () => {
    useLiquidWalletState.getState().setBalance(amount);

    const { result } = renderHook(useFundFromPeachLiquidWallet);
    await act(async () => {
      await result.current(initialProps);
    });

    expect(buildTransactionWithFeeRateMock).toHaveBeenCalledWith({
      feeRate: 4,
      inputs: [],
      recipients: [
        {
          address:
            "ert1qrxl2jwt08lnzxn77hrtdlhrqtr8q9vj2tucmxfw9tla59ws6jxwqw0qh3e",
          amount: 615000,
        },
      ],
    });
    expect(render(<GlobalPopup />)).toMatchSnapshot();
  });
  it("should set multiple recipients if addresses is passed", async () => {
    useLiquidWalletState.getState().setBalance(amount);
    const addresses = ["a", "b"];
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });
    expect(buildTransactionWithFeeRateMock).toHaveBeenCalledWith({
      feeRate: 4,
      inputs: [],
      recipients: [
        { address: "a", amount: 307500 },
        { address: "b", amount: 307500 },
      ],
    });
  });
  it("should broadcast transaction on confirm", async () => {
    useLiquidWalletState.getState().setBalance(amount);

    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    const { getByText, queryByText } = render(<GlobalPopup />);

    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(postTxSpy).toHaveBeenCalledWith({ tx: liquidTransactionHex });
    expect(queryByText("confirm & send")).toBeFalsy();
  });

  it("should open insufficient funds popup", async () => {
    let call = 0;
    useLiquidWalletState.getState().setBalance(amount);
    buildTransactionWithFeeRateMock.mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return liquidTransaction;
    });

    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });

    expect(render(<GlobalPopup />)).toMatchSnapshot();
  });

  it("should open handle insufficient funds error for building drain wallet transactions", async () => {
    useLiquidWalletState.getState().setBalance(sellOffer.amount - 1);
    useLiquidWalletState
      .getState()
      .setUTXO([{ ...utxo, value: 1000, derivationPath: "m/84'/1'/0'/0/0" }]);
    buildTransactionWithFeeRateMock.mockImplementation(() => {
      throw transactionError;
    });

    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "249999",
      "1000",
    ]);
  });
  it("should open handle other errors for building drain wallet transactions", async () => {
    let call = 0;
    useLiquidWalletState.getState().setBalance(amount);
    buildTransactionWithFeeRateMock.mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      // eslint-disable-next-line no-throw-literal
      throw [new Error("UNKNOWN")];
    });

    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "250000",
      "1000",
    ]);
  });

  it("should not show insufficient funds popup but error for multiple addresses", async () => {
    let call = 0;
    useLiquidWalletState.getState().setBalance(amount);
    buildTransactionWithFeeRateMock.mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return liquidTransaction;
    });
    const addresses = ["a", "b"];
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "615000",
      "78999997952",
    ]);
  });

  it("should broadcast withdraw all transaction on confirm", async () => {
    let call = 0;
    useLiquidWalletState.getState().setBalance(amount);
    useLiquidWalletState
      .getState()
      .setUTXO([{ ...utxo, value: amount, derivationPath: "m/84'/1'/0'/0/0" }]);
    buildTransactionWithFeeRateMock.mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return liquidTransaction;
    });

    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });

    const { getByText, queryByText } = render(<GlobalPopup />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(postTxSpy).toHaveBeenCalledWith({ tx: liquidTransactionHex });
    expect(queryByText("confirm & send")).toBeFalsy();
  });

  it("should open amount too low popup", async () => {
    useLiquidWalletState.getState().setBalance(0);
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    const { getByText } = render(<GlobalPopup />);
    expect(getByText("amount too low")).toBeTruthy();
  });
  it("should open amount too low popup when funding multiple", async () => {
    useLiquidWalletState.getState().setBalance(0);
    const addresses = ["a", "b", "c"];
    const { result } = renderHook(useFundFromPeachLiquidWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });

    const { getByText } = render(<GlobalPopup />);
    expect(getByText("amount too low")).toBeTruthy();
  });
});
