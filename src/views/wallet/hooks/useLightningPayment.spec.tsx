import { renderHook, waitFor } from "test-utils";
import {
  lightningInvoice,
  lnPayment,
} from "../../../../tests/unit/data/lightningNetworkData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useLightningPayment } from "./useLightningPayment";

jest.mock("@breeztech/react-native-breez-sdk");

jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .paymentByHash.mockResolvedValue(lnPayment);

describe("useLightningPayment", () => {
  const initialProps = { invoice: lightningInvoice };
  afterEach(() => {
    queryClient.clear();
  });
  it("should return default values", () => {
    const { result } = renderHook(useLightningPayment, { initialProps });

    expect(result.current.data).toEqual(undefined);
  });
  it("should return payments once known", async () => {
    const { result } = renderHook(useLightningPayment, { initialProps });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());
    expect(result.current.data).toEqual(lnPayment);
  });
});
