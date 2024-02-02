import { act } from "react-test-renderer";
import { renderHook, waitFor } from "test-utils";
import { account1 } from "../../../../tests/unit/data/accountData";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { peachAPI } from "../../../utils/peachAPI";
import { useRestoreFromFileSetup } from "./useRestoreFromFileSetup";

jest.useFakeTimers();

jest.mock("../../../utils/account/decryptAccount");
const decryptAccountMock = jest
  .requireMock("../../../utils/account/decryptAccount")
  .decryptAccount.mockReturnValue([account1]);
jest.mock("../../../utils/account/recoverAccount");
const recoverAccountMock = jest
  .requireMock("../../../utils/account/recoverAccount")
  .recoverAccount.mockResolvedValue(account1);

jest.mock("../../../utils/account/storeAccount");
const storeAccountMock = jest.requireMock(
  "../../../utils/account/storeAccount",
).storeAccount;

describe("useRestoreFromFileSetup", () => {
  const encryptedAccount = "encryptedAccount";
  const password = "password";
  it("restores account from file", async () => {
    const { result } = renderHook(useRestoreFromFileSetup);
    act(() => {
      result.current.setFile({
        name: "",
        content: encryptedAccount,
      });
      result.current.setPassword(password);
    });
    act(() => {
      result.current.submit();
    });
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy();
    });
    expect(decryptAccountMock).toHaveBeenCalledWith({
      encryptedAccount,
      password,
    });
    expect(recoverAccountMock).toHaveBeenCalledWith(account1);
    expect(storeAccountMock).toHaveBeenCalledWith(account1);
    expect(peachAPI.apiOptions.peachAccount?.privateKey?.toString("hex")).toBe(
      "62233e988e4ca00c3b346b4753c7dc316f6ce39280410072ddab298f36a7fe64",
    );
  });
  it("updates the last file backup date after restoring", async () => {
    const MOCK_DATE = 123456789;
    jest.spyOn(Date, "now").mockReturnValue(MOCK_DATE);
    const { result } = renderHook(useRestoreFromFileSetup);
    act(() => {
      result.current.setFile({
        name: "",
        content: encryptedAccount,
      });
      result.current.setPassword(password);
    });
    act(() => {
      result.current.submit();
    });
    await waitFor(() => {
      expect(result.current.restored).toBeTruthy();
    });
    expect(useSettingsStore.getState()).toEqual(
      expect.objectContaining({
        lastFileBackupDate: Date.now(),
        shouldShowBackupOverlay: false,
        showBackupReminder: false,
      }),
    );
  });
});
