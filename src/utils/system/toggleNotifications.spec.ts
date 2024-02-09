import { isIOS } from "./isIOS";
import { toggleNotifications } from "./toggleNotifications";
import { toggleNotificationsAndroid } from "./toggleNotificationsAndroid";
import { toggleNotificationsIOS } from "./toggleNotificationsIOS";

jest.mock("./toggleNotificationsAndroid");
jest.mock("./toggleNotificationsIOS");
jest.mock("./isIOS");

describe("toggleNotifications", () => {
  it("calls toggleNotificationsIOS if isIOS returns true", () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(true);
    toggleNotifications();
    expect(toggleNotificationsIOS).toHaveBeenCalled();
    expect(toggleNotificationsAndroid).not.toHaveBeenCalled();
  });

  it("calls toggleNotificationsAndroid if isIOS returns false", () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(false);
    toggleNotifications();
    expect(toggleNotificationsAndroid).toHaveBeenCalled();
    expect(toggleNotificationsIOS).not.toHaveBeenCalled();
  });
});
