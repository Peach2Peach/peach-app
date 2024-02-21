import { View } from "react-native";
import { act, fireEvent, render } from "test-utils";
import { transactionError } from "../../../../tests/unit/data/errors";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { ConfirmTransactionPopup } from "./ConfirmTransactionPopup";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

describe("ConfirmTransactionPopup", () => {
  const onSuccess = jest.fn();
  const amount = 100000;
  const feeRate = 10;
  const props = {
    title: "title",
    content: <View />,
    psbt: getTransactionDetails(amount, feeRate, "txid").psbt,
    onSuccess,
  };
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  it("should render correctly", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(props.psbt);
    const { getByText } = render(<ConfirmTransactionPopup {...props} />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(props.psbt);
    expect(onSuccess).toHaveBeenCalled();
  });
  it("should handle broadcast errors", async () => {
    if (!peachWallet) throw new Error("PeachWallet not set");
    peachWallet.balance = amount;
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError;
    });
    const { getByText } = render(<ConfirmTransactionPopup {...props} />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(mockShowErrorBanner).toHaveBeenCalledWith("INSUFFICIENT_FUNDS", [
      "78999997952",
      "1089000",
    ]);
  });
});
