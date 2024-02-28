import { fireEvent, render, waitFor } from "test-utils";
import { estimatedFees } from "../../../../tests/unit/data/bitcoinNetworkData";
import { transactionError } from "../../../../tests/unit/data/errors";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { WithdrawalConfirmationPopup } from "./WithdrawalConfirmationPopup";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

const amount = sellOffer.amount;
const address =
  "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh";
const feeRate = estimatedFees.halfHourFee;
const transaction = getTransactionDetails(amount, feeRate);
const transactionWithChange = getTransactionDetails(amount, feeRate);
const changeAmount = 5000;
transactionWithChange.txDetails.sent = sellOffer.amount + changeAmount;

const props = {
  address,
  amount,
  feeRate,
  psbt: transaction.psbt,
};
jest.mock("../../../utils/wallet/bitcoin/transaction/buildTransaction");
jest
  .requireMock("../../../utils/wallet/bitcoin/transaction/buildTransaction")
  .buildTransaction.mockReturnValue(transaction);
jest.useFakeTimers();

describe("useOpenWithdrawalConfirmationPopup", () => {
  beforeEach(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });

  it("should broadcast transaction, reset state and navigate to wallet on confirm", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.buildFinishedTransaction = jest
      .fn()
      .mockResolvedValue(transaction);
    peachWallet.signAndBroadcastPSBT = jest
      .fn()
      .mockResolvedValue(transaction.psbt);
    const fee = await transaction.psbt.feeRate();

    const { getByText } = render(
      <WithdrawalConfirmationPopup {...props} fee={fee} />,
    );
    fireEvent.press(getByText("confirm & send"));

    await waitFor(() => {
      if (!peachWallet) throw new Error("PeachWallet not set");
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(
        transaction.psbt,
      );
      expect(useWalletState.getState().selectedUTXOIds).toEqual([]);
      expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
        screen: "wallet",
      });
    });
  });
  it("should handle broadcast errors", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.buildFinishedTransaction = jest
      .fn()
      .mockResolvedValue(transaction);
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError;
    });
    const fee = await transaction.psbt.feeRate();

    const { getByText } = render(
      <WithdrawalConfirmationPopup {...props} fee={fee} />,
    );

    fireEvent.press(getByText("confirm & send"));

    await waitFor(() => {
      expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
        "78999997952",
        "1089000",
      ]);
    });
  });
});
