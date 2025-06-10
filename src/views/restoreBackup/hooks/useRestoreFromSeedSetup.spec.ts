import { act, renderHook, waitFor } from "test-utils";
import { account1 } from "../../../../tests/unit/data/accountData";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { createWalletFromSeedPhrase } from "../../../utils/wallet/createWalletFromSeedPhrase";
import { getNetwork } from "../../../utils/wallet/getNetwork";
import { useRestoreFromSeedSetup } from "./useRestoreFromSeedSetup";

jest.useFakeTimers();

jest.mock("../../../utils/account/createAccount");
const createAccountMock = jest
  .requireMock("../../../utils/account/createAccount")
  .createAccount.mockResolvedValue(account1);

const mockRecoverAccount = jest.fn().mockResolvedValue(account1);
jest.mock("../../../utils/account/useRecoverAccount", () => ({
  useRecoverAccount: () => mockRecoverAccount,
}));

jest.mock("../../../utils/account/storeAccount");
const storeAccountMock = jest.requireMock(
  "../../../utils/account/storeAccount",
).storeAccount;

describe("useRestoreFromSeedSetup", () => {
  it("restores account from seed", async () => {
    const { result } = renderHook(useRestoreFromSeedSetup);
    await act(() => {
      result.current.setWords(account1.mnemonic.split(" "));
    });
    await act(() => {
      result.current.submit();
    });
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy();
    });
    const { wallet, mnemonic } = createWalletFromSeedPhrase(
      account1.mnemonic,
      getNetwork(),
    );
    expect(createAccountMock).toHaveBeenCalledWith({ wallet, mnemonic });
    expect(mockRecoverAccount).toHaveBeenCalledWith(account1);
    expect(storeAccountMock).toHaveBeenCalledWith(account1);
  });
  it("updates the last seed backup date", async () => {
    const MOCK_DATE = 123456789;
    jest.spyOn(Date, "now").mockReturnValue(MOCK_DATE);
    const { result } = renderHook(useRestoreFromSeedSetup);
    await act(() => {
      result.current.setWords(account1.mnemonic.split(" "));
    });
    await act(() => {
      result.current.submit();
    });
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy();
    });
    expect(useSettingsStore.getState()).toEqual(
      expect.objectContaining({
        lastSeedBackupDate: Date.now(),
        shouldShowBackupOverlay: false,
        showBackupReminder: false,
      }),
    );
  });
});
