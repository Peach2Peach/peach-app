import { View } from "react-native";
import { act, fireEvent, render } from "test-utils";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { setPeachWallet } from "../../../utils/wallet/setWallet";
import { ConfirmTransactionPopup } from "./ConfirmTransactionPopup";

const mockShowErrorBanner = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

describe("ConfirmTransactionPopup", () => {
  const onConfirm = jest.fn();
  const onSuccess = jest.fn();
  const props = {
    title: "title",
    content: <View />,
    onConfirm,
    onSuccess,
  };
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
  });
  it("should render correctly", async () => {
    const { getByText } = render(<ConfirmTransactionPopup {...props} />);
    await act(async () => {
      await fireEvent.press(getByText("confirm & send"));
    });

    expect(onConfirm).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
