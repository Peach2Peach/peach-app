import { fireEvent, render, waitFor } from "test-utils";
import { transactionError } from "../../../../tests/unit/data/errors";
import {
  bitcoinJSTransactionWithRBF1,
  bitcoinTransaction,
} from "../../../../tests/unit/data/transactionDetailData";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import i18n from "../../../utils/i18n";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { ConfirmRbfPopup } from "./ConfirmRbfPopup";

const showErrorBannerMock = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner");
jest
  .requireMock("../../../hooks/useShowErrorBanner")
  .useShowErrorBanner.mockReturnValue(showErrorBannerMock);
jest.useFakeTimers();

describe("ConfirmRbfPopup", () => {
  const currentFeeRate = 9;
  const newFeeRate = 10;
  const onSuccess = jest.fn();
  const txDetails = getTransactionDetails(
    bitcoinTransaction.value,
    newFeeRate,
    bitcoinTransaction.txid,
  );
  const props = {
    currentFeeRate,
    newFeeRate,
    transaction: bitcoinJSTransactionWithRBF1,
    sendingAmount: 80000,
    finishedTransaction: txDetails.psbt,
    onSuccess,
  };
  beforeEach(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });

  it("should broadcast bump fee transaction", async () => {
    peachWallet.signAndBroadcastPSBT = jest
      .fn()
      .mockResolvedValue(txDetails.psbt);

    const { getByText } = render(<ConfirmRbfPopup {...props} />);

    fireEvent.press(
      getByText(i18n("fundFromPeachWallet.confirm.confirmAndSend")),
    );

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(
        txDetails.psbt,
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });
  it("should handle broadcast errors", async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError;
    });

    const { getByText } = render(<ConfirmRbfPopup {...props} />);

    fireEvent.press(
      getByText(i18n("fundFromPeachWallet.confirm.confirmAndSend")),
    );

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
        "78999997952",
        "1089000",
      ]);
    });
  });
});
