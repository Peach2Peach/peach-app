/* eslint-disable no-magic-numbers */
import { fireEvent, render, waitFor } from "test-utils";
import { nodeInfo } from "../../../tests/unit/data/lightningNetworkData";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { LiquidWallet } from "./LiquidWallet";

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

jest.mock("../../hooks/query/useMarketPrices", () => ({
  useMarketPrices: () => ({
    data: { EUR: 20000, CHF: 20000 },
  }),
}));
jest.useFakeTimers();

describe("LiquidWallet", () => {
  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly", async () => {
    const { toJSON } = render(<LiquidWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly while loading", () => {
    const { toJSON } = render(<LiquidWallet />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("should navigate to send screen when send button is pressed", async () => {
    const { getByText } = render(<LiquidWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    fireEvent.press(getByText("send"));

    expect(navigateMock).toHaveBeenCalledWith("sendBitcoinLiquid");
  });
});
