import { renderHook } from "test-utils";
import { account1 } from "../../tests/unit/data/accountData";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { defaultAccount, setAccount } from "../utils/account/account";
import { useUserUpdate } from "./useUserUpdate";

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(),
  }),
}));

const mockUpdateUser = jest.fn();
jest.mock("../utils/peachAPI/useUpdateUser", () => ({
  useUpdateUser: () => ({ mutate: mockUpdateUser }),
}));
jest.useFakeTimers();

describe("useUserUpdate", () => {
  const fcmToken = "fcmToken";
  const referralCode = "referralCode";
  afterEach(() => {
    setAccount(defaultAccount);
  });

  it("does not send updates to server if there is no data to send", async () => {
    const { result } = renderHook(useUserUpdate);
    await result.current();
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
  it("does send updates to server if there is data to send", async () => {
    const newToken = "otherToken";
    setAccount(account1);
    const getTokenMock = jest.fn().mockResolvedValue(newToken);
    jest
      .spyOn(jest.requireMock("@react-native-firebase/messaging"), "default")
      .mockReturnValue({
        getToken: getTokenMock,
      });
    useSettingsStore.setState({ fcmToken });
    const { result } = renderHook(useUserUpdate);
    await result.current(referralCode);
    expect(getTokenMock).toHaveBeenCalled();
    expect(mockUpdateUser).toHaveBeenCalledWith(
      {
        referralCode,
        fcmToken: newToken,
      },
      {
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      },
    );
  });
});
