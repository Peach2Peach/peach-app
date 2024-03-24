import { sendPayment } from "@breeztech/react-native-breez-sdk";
import bolt11 from "bolt11";
import { renderHook, waitFor } from "test-utils";
import {
  lightningInvoice,
  lightningInvoiceNoAmount,
  lnPayment,
} from "../../../../tests/unit/data/lightningNetworkData";
import { getError } from "../../../../tests/unit/helpers/getError";
import { usePayInvoice } from "./usePayInvoice";

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .sendPayment.mockReturnValue({
    payment: lnPayment,
  });
describe("usePayInvoice", () => {
  const initialProps = {
    paymentRequest: bolt11.decode(lightningInvoice),
  };
  it("should return error if no payment request is set", async () => {
    const { result } = renderHook(usePayInvoice, { initialProps: {} });

    const error = await getError<Error>(() => result.current.payInvoice());
    expect(error.message).toBe("INVOICE_MISSING");
  });
  it("should return error if no amount is set for invoice without amount", async () => {
    const { result } = renderHook(usePayInvoice, {
      initialProps: {
        paymentRequest: bolt11.decode(lightningInvoiceNoAmount),
      },
    });

    const error = await getError<Error>(() => result.current.payInvoice());
    expect(error.message).toBe("AMOUNT_MISSING");
  });
  it("should pay invoice that has amount", async () => {
    const { result } = renderHook(usePayInvoice, { initialProps });
    await result.current.payInvoice();
    await waitFor(() => {
      expect(sendPayment).toHaveBeenCalledWith({
        amountMsat: undefined,
        bolt11: lightningInvoice,
      });
    });
  });
  it("should pay invoice that has not amount", async () => {
    const { result } = renderHook(usePayInvoice, {
      initialProps: {
        paymentRequest: bolt11.decode(lightningInvoiceNoAmount),
        amount: 1000,
      },
    });
    await result.current.payInvoice();
    await waitFor(() => {
      expect(sendPayment).toHaveBeenCalledWith({
        amountMsat: 1000,
        bolt11: lightningInvoiceNoAmount,
      });
    });
  });
});
