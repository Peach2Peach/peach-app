import analytics from "@react-native-firebase/analytics";
import { act, renderHook } from "test-utils";
import { recoveredAccount } from "../../../tests/unit/data/accountData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useRecoverAccount } from "./useRecoverAccount";

const mockUserUpdate = jest.fn();

jest.mock("../../init/useUserUpdate", () => ({
  useUserUpdate: () => mockUserUpdate,
}));
jest.mock("../lightning/initLightningWallet");

jest.useFakeTimers();

describe("useRecoverAccount", () => {
  it("resets fcm token", async () => {
    useSettingsStore.getState().setFCMToken("existingFCMToken");
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(useSettingsStore.getState().fcmToken).toBe("");
  });

  it("calls user update", async () => {
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(mockUserUpdate).toHaveBeenCalled();
  });
  it("logs event account_restored", async () => {
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(analytics().logEvent).toHaveBeenCalledWith("account_restored");
  });
});
