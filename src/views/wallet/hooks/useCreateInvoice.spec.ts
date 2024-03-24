import { receivePayment } from "@breeztech/react-native-breez-sdk";
import { renderHook, waitFor } from "test-utils";
import { lightningInvoice } from "../../../../tests/unit/data/lightningNetworkData";
import { useCreateInvoice } from "./useCreateInvoice";

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .receivePayment.mockReturnValue({
    lnInvoice: {
      bolt11: lightningInvoice,
    },
  });
describe("useCreateInvoice", () => {
  it("should create an invoice for given amount and description", async () => {
    const { result } = renderHook(useCreateInvoice, {
      initialProps: {
        amountMsat: 1000,
        description: "description",
      },
    });

    await result.current.createInvoice();
    await waitFor(() => {
      expect(receivePayment).toHaveBeenCalledWith({
        amountMsat: 1000,
        description: "description",
      });
    });
  });
});
