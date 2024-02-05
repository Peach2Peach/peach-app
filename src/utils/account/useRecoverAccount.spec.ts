import analytics from "@react-native-firebase/analytics";
import { act, renderHook, responseUtils } from "test-utils";
import { recoveredAccount } from "../../../tests/unit/data/accountData";
import { buyOffer, sellOffer } from "../../../tests/unit/data/offerData";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { error } from "../log/error";
import { peachAPI } from "../peachAPI";
import { useRecoverAccount } from "./useRecoverAccount";

const mockUserUpdate = jest.fn();

jest.mock("../../init/useUserUpdate", () => ({
  useUserUpdate: () => mockUserUpdate,
}));
const getOffersMock = jest.spyOn(peachAPI.private.offer, "getOffers");

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
  it("gets offers and stores them", async () => {
    const offers = [{ ...buyOffer, message: "" }, sellOffer];
    getOffersMock.mockResolvedValueOnce({ result: offers, ...responseUtils });
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      const recovered = await result.current(recoveredAccount);
      expect(recovered?.offers).toEqual(offers);
    });
  });
  it("logs event account_restored", async () => {
    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(analytics().logEvent).toHaveBeenCalledWith("account_restored");
  });
  it("handles api errors for offers", async () => {
    getOffersMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });

    const { result } = renderHook(useRecoverAccount);
    await act(async () => {
      await result.current(recoveredAccount);
    });
    expect(error).toHaveBeenCalledWith("Error", { error: "UNAUTHORIZED" });
  });
});
