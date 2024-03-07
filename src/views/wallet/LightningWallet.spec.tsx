/* eslint-disable no-magic-numbers */
import { fireEvent, render, waitFor } from "test-utils";
import {
  navigateMock,
  setRouteMock,
} from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { LightningWallet } from "./LightningWallet";

jest.mock("./hooks/useLightningWalletBalance");
const lightningWalletBalance = {
  balance: { lightning: 10, onchain: 11, total: 21 },
  refetch: jest.fn(),
  isRefetching: false,
  isLoading: false,
};
const useLightningWalletBalanceMock = jest
  .requireMock("./hooks/useLightningWalletBalance")
  .useLightningWalletBalance.mockReturnValue(lightningWalletBalance);

jest.useFakeTimers();

describe("LightningWallet", () => {
  beforeAll(() => {
    setRouteMock({
      name: "homeScreen",
      key: "homeScreen",
      params: { screen: "wallet" },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("should render correctly", async () => {
    const { toJSON } = render(<LightningWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly while loading", async () => {
    useLightningWalletBalanceMock.mockReturnValue({
      ...lightningWalletBalance,
      isLoading: true,
    });
    const { toJSON } = render(<LightningWallet />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("should render correctly when loading", () => {
    const { toJSON } = render(<LightningWallet />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should navigate to bitcoin wallet screen when link is pressed", async () => {
    const { getByText } = render(<LightningWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    fireEvent.press(getByText("on-chain"));

    expect(navigateMock).toHaveBeenCalledWith("homeScreen", {
      screen: "wallet",
    });
  });
  it("should navigate to send screen when send button is pressed", async () => {
    const { getByText } = render(<LightningWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });

    fireEvent.press(getByText("send"));

    expect(navigateMock).toHaveBeenCalledWith("sendBitcoinLightning");
  });
  it("should navigate to receive screen when receive button is pressed", async () => {
    const { getByText } = render(<LightningWallet />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    fireEvent.press(getByText("receive"));

    expect(navigateMock).toHaveBeenCalledWith("receiveBitcoinLightning");
  });
});
