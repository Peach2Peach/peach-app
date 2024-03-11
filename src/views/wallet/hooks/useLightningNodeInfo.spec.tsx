import { renderHook, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { useLightningNodeInfo } from "./useLightningNodeInfo";

jest.mock("@breeztech/react-native-breez-sdk");

const nodeInfo = {
  channelsBalanceMsat: 0,
  onchainBalanceMsat: 0,
};
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

describe("useLightningNodeInfo", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("should return default values", () => {
    const { result } = renderHook(useLightningNodeInfo);

    expect(result.current.data).toEqual(undefined);
  });
  it("should return nodeinfo once known", async () => {
    const { result } = renderHook(useLightningNodeInfo);

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data).toEqual(nodeInfo);
  });
});
