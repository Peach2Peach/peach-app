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
          "lnbc1111110n1pjlgud2dq823jhxaqpp57hnjqhs6jpv29u3srhraasy9x0ys3vuqdc50jmry570aamk3gt3sxqrrsssp5rdy55q69x996yf0xnl0spwrryx088l728ucyzmzuqfqtvtpqzqls9qrsgqcqzysrzjqtypret4hcklglvtfrdt85l3exc0dctdp4qttmtcy5es3lpt6uts6qqqqyqqqqqqqqqqqqlgqqqqqzsqygst0znnqrrg3salscrfu4wm999re0esg9cmtg68flynx7k2a3zaw5dsarjus8eutsm3xm4yvtn2fyxt4z0zfydm5uajkemkkh4tj5cvgqsw5vjr",
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
