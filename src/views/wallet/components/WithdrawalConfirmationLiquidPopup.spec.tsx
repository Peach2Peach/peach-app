import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { fireEvent, render, waitFor } from "test-utils";
import { estimatedFees } from "../../../../tests/unit/data/bitcoinNetworkData";
import {
  liquidAddresses,
  liquidTransactionHex,
} from "../../../../tests/unit/data/liquidNetworkData";
import { sellOffer } from "../../../../tests/unit/data/offerData";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import { peachAPI } from "../../../utils/peachAPI";
import { PeachLiquidJSWallet } from "../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../utils/wallet/setWallet";
import { WithdrawalConfirmationLiquidPopup } from "./WithdrawalConfirmationLiquidPopup";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

const amount = sellOffer.amount;
const address = liquidAddresses.regtest[0];
const feeRate = estimatedFees.halfHourFee;
const transaction = getTransactionDetails(amount, feeRate);
const transactionWithChange = getTransactionDetails(amount, feeRate);
const changeAmount = 5000;
transactionWithChange.txDetails.sent = sellOffer.amount + changeAmount;

const props = {
  address,
  amount,
  feeRate,
  transaction: LiquidTransaction.fromHex(liquidTransactionHex),
};
jest.mock("../../../utils/wallet/liquid/buildTransaction");
jest
  .requireMock("../../../utils/wallet/liquid/buildTransaction")
  .buildTransaction.mockReturnValue(transaction);
jest.useFakeTimers();

describe("WithdrawalConfirmationLiquidPopup", () => {
  const peachLiquidWallet = new PeachLiquidJSWallet({
    wallet: createTestWallet(),
  });
  beforeEach(() => {
    setLiquidWallet(peachLiquidWallet);
  });

  it("should broadcast transaction, reset state and navigate to wallet on confirm", async () => {
    const postTxSpy = jest.spyOn(peachAPI.public.liquid, "postTx");
    const fee = await transaction.psbt.feeRate();

    const { getByText } = render(
      <WithdrawalConfirmationLiquidPopup {...props} fee={fee} />,
    );
    fireEvent.press(getByText("confirm & send"));

    expect(postTxSpy).toHaveBeenCalledWith({ tx: liquidTransactionHex });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("liquidWallet");
    });
  });
});
