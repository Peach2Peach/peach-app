/* eslint-disable no-magic-numbers */
import { TxBuilder } from "bdk-rn";
import { act } from "react-test-renderer";
import { fireEvent, render, renderHook, responseUtils } from "test-utils";
import { defaultUser } from "../../../../peach-api/src/testData/userData";
import { estimatedFees as mockEstimatedFees } from "../../../../tests/unit/data/bitcoinNetworkData";
import { transactionError } from "../../../../tests/unit/data/errors";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import { GlobalPopup } from "../../../components/popup/GlobalPopup";
import { useConfigStore } from "../../../store/configStore/configStore";
import { defaultFundingStatus } from "../../../utils/offer/constants";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { setMultipleRecipients } from "../../../utils/wallet/transaction";
import { useFundFromPeachWallet } from "./useFundFromPeachWallet";

jest.mock("../../../hooks/query/useFeeEstimate", () => ({
  useFeeEstimate: () => ({ estimatedFees: mockEstimatedFees }),
}));

jest.mock("../../../utils/wallet/transaction/setMultipleRecipients");

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));
jest.useFakeTimers();

jest.spyOn(peachAPI.private.user, "getSelfUser").mockResolvedValue({
  result: { ...defaultUser, feeRate: mockEstimatedFees.halfHourFee },
  ...responseUtils,
});

describe("useFundFromPeachWallet", () => {
  const offerId = sellOffer.id;
  const amount = sellOffer.amount;
  const minTradingAmount = 50000;
  const address =
    "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh";
  const feeRate = mockEstimatedFees.halfHourFee;
  const initialProps = {
    offerId,
    address,
    amount: 615000,
    fundingStatus: defaultFundingStatus.status,
  };

  beforeAll(() => {
    useConfigStore.getState().setMinTradingAmount(minTradingAmount);
  });
  beforeEach(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  it("should return default values", () => {
    const { result } = renderHook(useFundFromPeachWallet);

    expect(result.current).toEqual(expect.any(Function));
  });
  it("should return undefined if escrow is already funded", async () => {
    peachWallet.balance = amount;
    const { result } = renderHook(useFundFromPeachWallet);
    const res = await result.current({
      offerId,
      address,
      amount: 615000,
      fundingStatus: "FUNDED",
    });
    expect(res).toBeUndefined();
  });
  it("should handle other finishTransaction transaction errors", async () => {
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementationOnce(() => {
      throw Error("UNAUTHORIZED");
    });
    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("UNAUTHORIZED");
  });
  it("should open confirmation popup", async () => {
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest
      .fn()
      .mockResolvedValue(getTransactionDetails(amount, feeRate));

    const { result } = renderHook(useFundFromPeachWallet);
    await act(async () => {
      await result.current(initialProps);
    });

    expect(render(<GlobalPopup />)).toMatchSnapshot();
  });
  it("should set multiple recipients if addresses is passed", async () => {
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest
      .fn()
      .mockResolvedValue(getTransactionDetails(amount, feeRate));
    const addresses = ["a", "b"];
    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });
    expect(setMultipleRecipients).toHaveBeenCalledWith(
      expect.any(TxBuilder),
      initialProps.amount,
      addresses,
    );
  });
  it("should broadcast transaction on confirm", async () => {
    const txDetails = getTransactionDetails(amount, feeRate);
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails);
    peachWallet.signAndBroadcastPSBT = jest
      .fn()
      .mockResolvedValue(txDetails.psbt);

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    const { getByText, queryByText } = render(<GlobalPopup />);

    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(
      txDetails.psbt,
    );
    expect(queryByText("confirm & send")).toBeFalsy();
  });
  it("should handle broadcast errors", async () => {
    peachWallet.balance = amount;
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError;
    });

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    const { getByText, queryByText } = render(<GlobalPopup />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "78999997952",
      "1089000",
    ]);
    expect(queryByText("confirm & send")).toBeFalsy();
  });

  it("should open insufficient funds popup", async () => {
    let call = 0;
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return getTransactionDetails(amount, feeRate);
    });

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });

    expect(render(<GlobalPopup />)).toMatchSnapshot();
  });

  it("should open handle insufficient funds error for building drain wallet transactions", async () => {
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError;
    });

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "78999997952",
      "1089000",
    ]);
  });
  it("should open handle other errors for building drain wallet transactions", async () => {
    let call = 0;
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      // eslint-disable-next-line no-throw-literal
      throw [new Error("UNKNOWN")];
    });

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("UNKNOWN", []);
  });

  it("should not show insufficient funds popup but error for multiple addresses", async () => {
    let call = 0;
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return getTransactionDetails(amount, feeRate);
    });
    const addresses = ["a", "b"];
    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      615000,
      "1089000",
    ]);
  });

  it("should broadcast withdraw all transaction on confirm", async () => {
    const txDetails = getTransactionDetails(amount, feeRate);
    let call = 0;
    peachWallet.balance = amount;
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++;
      if (call === 1) throw transactionError;
      return txDetails;
    });
    peachWallet.signAndBroadcastPSBT = jest
      .fn()
      .mockResolvedValue(txDetails.psbt);

    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });

    const { getByText, queryByText } = render(<GlobalPopup />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(
      txDetails.psbt,
    );
    expect(queryByText("confirm & send")).toBeFalsy();
  });

  it("should open amount too low popup", async () => {
    peachWallet.balance = 0;
    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current(initialProps);
    });
    const { getByText } = render(<GlobalPopup />);
    expect(getByText("amount too low")).toBeTruthy();
  });
  it("should open amount too low popup when funding multiple", async () => {
    peachWallet.balance = 0;
    const addresses = ["a", "b", "c"];
    const { result } = renderHook(useFundFromPeachWallet);

    await act(async () => {
      await result.current({ ...initialProps, addresses });
    });

    const { getByText } = render(<GlobalPopup />);
    expect(getByText("amount too low")).toBeTruthy();
  });
});
