import { fireEvent, render, waitFor } from "test-utils";
import {
  lightningInvoice,
  lightningInvoiceNoAmount,
  lnPayment,
  lnPaymentFailed,
  nodeInfo,
} from "../../../tests/unit/data/lightningNetworkData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { SendBitcoinLightning } from "./SendBitcoinLightning";

jest.mock("@breeztech/react-native-breez-sdk");
const sendPaymentMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .sendPayment.mockReturnValue({
    payment: lnPayment,
  });

jest.mock("@breeztech/react-native-breez-sdk");
const nodeInfoMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

jest.useFakeTimers();

describe("SendBitcoinLightning", () => {
  const { toJSON } = render(<SendBitcoinLightning />);
  const base = toJSON();

  afterEach(() => {
    queryClient.clear();
  });
  it("should render correctly", () => {
    expect(base).toMatchSnapshot();
  });

  it("should allow entering invoice", () => {
    const { getByAccessibilityHint } = render(<SendBitcoinLightning />);
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoice);
    expect($invoice.props.value).toBe("lnbc1234 ... 4tl577");
  });
  it("should invalid invoice error for invalid invoices", () => {
    const { getByAccessibilityHint, getByText } = render(
      <SendBitcoinLightning />,
    );
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, "invalid");
    expect(getByText("form.lightningInvoice.error")).toBeDefined();
  });
  it("should display amount input when invoice is set", () => {
    const { getByAccessibilityHint } = render(<SendBitcoinLightning />);
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoice);
    const $amount = getByAccessibilityHint("amount");
    expect($amount).toBeDefined();
    expect($amount.props.value).toBe("12345");
  });
  it("should display amount and edit it  when invoice with no amount is set", () => {
    const amount = "20000";
    const { getByAccessibilityHint } = render(<SendBitcoinLightning />);
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoiceNoAmount);
    const $amount = getByAccessibilityHint("amount");
    expect($amount).toBeDefined();
    fireEvent.changeText($amount, amount);
    expect($amount.props.value).toBe(amount);
  });
  it("should disable button when no invoice is set", () => {
    const { getByRole } = render(<SendBitcoinLightning />);
    const $payButton = getByRole("button");
    expect($payButton.props.accessibilityState.disabled).toBeTruthy();
  });
  it("should disable button not enough balance", () => {
    nodeInfoMock.mockResolvedValueOnce({
      ...nodeInfo,
      channelsBalanceMsat: 1000,
    });
    const { getByRole, getByAccessibilityHint } = render(
      <SendBitcoinLightning />,
    );
    const $payButton = getByRole("button");
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoice);
    expect($payButton.props.accessibilityState.disabled).toBeTruthy();
  });

  it("should disable button when invoice amount is just 0", () => {
    const { getByRole, getByAccessibilityHint } = render(
      <SendBitcoinLightning />,
    );
    const $payButton = getByRole("button");
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoiceNoAmount);
    expect($payButton.props.accessibilityState.disabled).toBeTruthy();
  });
  it("should disable button when user has enough balance", async () => {
    const { getByRole, getByAccessibilityHint } = render(
      <SendBitcoinLightning />,
    );
    const $payButton = getByRole("button");
    const $invoice = getByAccessibilityHint("lightning invoice");
    fireEvent.changeText($invoice, lightningInvoice);
    await waitFor(() =>
      expect($payButton.props.accessibilityState.disabled).toBeFalsy(),
    );
  });
  it("should pay invoice successfully", async () => {
    const { getByRole, getByAccessibilityHint } = render(
      <SendBitcoinLightning />,
    );
    const $invoice = getByAccessibilityHint("lightning invoice");
    const $payButton = getByRole("button");
    fireEvent.changeText($invoice, lightningInvoice);
    await waitFor(() =>
      expect($payButton.props.accessibilityState.disabled).toBeFalsy(),
    );
    fireEvent.press(getByRole("button"));
    const { getByText } = render(<GlobalPopup />);
    await waitFor(() => expect(getByText("invoice paid")).toBeDefined());
  });
  it("should display payment failure", async () => {
    sendPaymentMock.mockResolvedValueOnce({
      payment: lnPaymentFailed,
    });
    const { getByRole, getByAccessibilityHint } = render(
      <SendBitcoinLightning />,
    );
    const $invoice = getByAccessibilityHint("lightning invoice");
    const $payButton = getByRole("button");
    fireEvent.changeText($invoice, lightningInvoice);
    await waitFor(() =>
      expect($payButton.props.accessibilityState.disabled).toBeFalsy(),
    );
    fireEvent.press(getByRole("button"));
    const { getByText } = render(<GlobalPopup />);
    await waitFor(() => expect(getByText("failed to pay")).toBeDefined());
    expect(getByText("missing route")).toBeDefined();
  });
});
