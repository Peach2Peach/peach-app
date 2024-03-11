import { act, render, renderHook, waitFor } from "test-utils";
import { nodeInfo } from "../../../../tests/unit/data/lightningNetworkData";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { Overlay } from "../../../Overlay";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useWalletState } from "../../../utils/wallet/walletStore";
import {
  emptyLightningBalance,
  useLightningWalletBalance,
} from "./useLightningWalletBalance";

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .nodeInfo.mockResolvedValue(nodeInfo);

jest.useFakeTimers();

describe("useLightningWalletBalance", () => {
  afterEach(() => {
    queryClient.clear();
    act(() => jest.runAllTimers());
  });
  it("should return default values", () => {
    const { result } = renderHook(useLightningWalletBalance);

    expect(result.current.balance).toEqual(emptyLightningBalance);
  });
  it("should return balance once known", async () => {
    const { result } = renderHook(useLightningWalletBalance);

    await waitFor(() =>
      expect(result.current.balance.total).toBeGreaterThan(0),
    );
    expect(result.current.balance).toEqual({
      lightning: 200000,
      lightningMsats: 200000000,
      onchain: 21000,
      total: 221000,
    });
  });
  it("should navigate to backupTime if balance is bigger than 0 & showBackupReminder is false", async () => {
    useSettingsStore.setState({
      showBackupReminder: false,
      shouldShowBackupOverlay: true,
    });
    const { result } = renderHook(useLightningWalletBalance);

    await waitFor(() =>
      expect(result.current.balance.total).toBeGreaterThan(0),
    );
    const { getByText } = render(<Overlay />);
    expect(getByText("backup time!")).toBeTruthy();
  });
  it("should not navigate to backupTime if balance is bigger than 0 & showBackupReminder is already true", async () => {
    useWalletState.getState().setBalance(1);
    useSettingsStore.setState({
      showBackupReminder: true,
      shouldShowBackupOverlay: true,
    });

    const { result } = renderHook(useLightningWalletBalance);

    await waitFor(() =>
      expect(result.current.balance.total).toBeGreaterThan(0),
    );

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
