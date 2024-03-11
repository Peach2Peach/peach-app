import { renderHook, waitFor } from "test-utils";
import { lnPayment } from "../../../../tests/unit/data/lightningNetworkData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useLightningPayments } from "./useLightningPayments";

jest.mock("@breeztech/react-native-breez-sdk");

const payments = [lnPayment];
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .listPayments.mockResolvedValue(payments);

describe("useLightningPayments", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("should return default values", () => {
    const { result } = renderHook(useLightningPayments);

    expect(result.current.data).toEqual([]);
  });
  it("should return payments once known", async () => {
    const { result } = renderHook(useLightningPayments);

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());
    expect(result.current.data).toEqual(payments);
  });
});
