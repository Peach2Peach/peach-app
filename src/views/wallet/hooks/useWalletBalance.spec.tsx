import { render, renderHook } from "test-utils";
import { navigateMock } from "../../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { Overlay } from "../../../Overlay";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useWalletBalance } from "./useWalletBalance";

const balance = 21000000;
describe("useWalletBalance", () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    if (!peachWallet) throw new Error("PeachWallet not set");
    useWalletState.setState({ balance });
    peachWallet.initialized = true;
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("should return correct default values", () => {
    const { result } = renderHook(useWalletBalance);

    expect(result.current.balance).toEqual(balance);
  });
  it("should navigate to backupTime if balance is bigger than 0 & showBackupReminder is false", () => {
    useWalletState.getState().setBalance(1);
    useSettingsStore.setState({
      showBackupReminder: false,
      shouldShowBackupOverlay: true,
    });
    renderHook(useWalletBalance);

    const { getByText } = render(<Overlay />);
    expect(getByText("backup time!")).toBeTruthy();
  });
  it("should not navigate to backupTime if balance is bigger than 0 & showBackupReminder is already true", () => {
    useWalletState.getState().setBalance(1);
    useSettingsStore.setState({
      showBackupReminder: true,
      shouldShowBackupOverlay: true,
    });
    renderHook(useWalletBalance);

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
