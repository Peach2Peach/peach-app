import { Linking } from "react-native";
import { toggleNotificationsAndroid } from "./toggleNotificationsAndroid";

jest.mock("react-native", () => ({
  Linking: {
    openSettings: jest.fn(),
  },
}));

describe("toggleNotifications", () => {
  it("calls Linking.openSettings", async () => {
    await toggleNotificationsAndroid();
    expect(Linking.openSettings).toHaveBeenCalled();
  });
});
