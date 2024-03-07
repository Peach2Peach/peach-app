/* eslint-disable no-magic-numbers */
import { fireEvent, render, waitFor } from "test-utils";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { ReceiveBitcoinLightning } from "./ReceiveBitcoinLightning";
import { MSAT_PER_SAT } from "./hooks/useLightningWalletBalance";

const invoice = "ln1pinvoice...";
jest.mock("@breeztech/react-native-breez-sdk");
const receivePaymentMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .receivePayment.mockReturnValue({
    lnInvoice: {
      bolt11: invoice,
    },
  });
jest.mock("./hooks/useLightningNodeInfo");
const nodeInfo = {
  maxReceivableMsat: 1000000000,
};
const useLightningNodeInfoMock = jest
  .requireMock("./hooks/useLightningNodeInfo")
  .useLightningNodeInfo.mockReturnValue({ data: nodeInfo });

describe("ReceiveBitcoinLightning", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<ReceiveBitcoinLightning />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly while loading", () => {
    useLightningNodeInfoMock.mockReturnValueOnce({
      data: undefined,
    });
    const { toJSON } = render(<ReceiveBitcoinLightning />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should allow entering amount + description and create an invoice", async () => {
    const amount = 123456;
    const description = "description";
    const { getByAccessibilityHint, getByText } = render(
      <ReceiveBitcoinLightning />,
    );
    fireEvent.changeText(
      getByAccessibilityHint("form.lightningInvoice.amount.label"),
      amount,
    );
    fireEvent.changeText(
      getByAccessibilityHint("from.description.label"),
      description,
    );
    fireEvent.press(getByText("wallet.receiveBitcoin.createInvoice"));

    await waitFor(() =>
      expect(receivePaymentMock).toHaveBeenCalledWith({
        amountMsat: amount * MSAT_PER_SAT,
        description,
      }),
    );
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith("lightningInvoice", {
        invoice,
      }),
    );
  });
});
