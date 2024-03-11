/* eslint-disable no-magic-numbers */
import { PaymentStatus } from "@breeztech/react-native-breez-sdk";
import { render } from "test-utils";
import { lnPayment } from "../../../tests/unit/data/lightningNetworkData";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { LightningInvoiceScreen } from "./LightningInvoiceScreen";

jest.mock("./hooks/useLightningPayment");
const useLightningPaymentMock = jest
  .requireMock("./hooks/useLightningPayment")
  .useLightningPayment.mockReturnValue({ data: undefined });
describe("LightningInvoiceScreen", () => {
  beforeEach(() => {
    setRouteMock<"lightningInvoice">({
      name: "lightningInvoice",
      key: "lightningInvoice",
      params: {
        invoice:
          "lnbc2342340n1pj7nshtdqqpp5zyldedlak8wpxaswd6kxpzxym86ptqul094262gdkdv7ppwqgsmsxqrrsssp583u3ue6vylycclcrj3q5944kj6cygay8p45xxsaza4l0lhhs2r2s9qrsgqcqzysrzjqtypre",
      },
    });
  });
  it("should render correctly", () => {
    const { toJSON } = render(<LightningInvoiceScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should show success status once invoice has been paid", () => {
    useLightningPaymentMock.mockReturnValue({
      data: { ...lnPayment, status: PaymentStatus.COMPLETE },
    });
    const { toJSON } = render(<LightningInvoiceScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should show success status once invoice has failed", () => {
    useLightningPaymentMock.mockReturnValue({
      data: { ...lnPayment, status: PaymentStatus.FAILED },
    });
    const { toJSON } = render(<LightningInvoiceScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
});
