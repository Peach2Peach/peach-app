import { account1 } from "../../tests/unit/data/accountData";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { defaultAccount, setAccount } from "../utils/account/account";
import { updateUser } from "../utils/peachAPI/updateUser";
import { userUpdate } from "./userUpdate";

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(),
  }),
}));

jest.mock("../utils/peachAPI/updateUser", () => ({
  updateUser: jest.fn().mockResolvedValue([{ success: true }, null]),
}));
describe("userUpdate", () => {
  const fcmToken = "fcmToken";
  const referralCode = "referralCode";
  afterEach(() => {
    setAccount(defaultAccount);
  });

  it("does not send updates to server if there is no data to send", async () => {
    await userUpdate();
    expect(updateUser).not.toHaveBeenCalled();
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
    await userUpdate(referralCode);
    expect(getTokenMock).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith({
      referralCode,
      fcmToken: newToken,
    });
  });
});
