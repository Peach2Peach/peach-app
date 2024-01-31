import { checkNotificationStatus } from "./checkNotificationStatus";
import { checkNotificationStatusAndroid } from "./checkNotificationStatusAndroid";
import { checkNotificationStatusIOS } from "./checkNotificationStatusIOS";
import { isIOS } from "./isIOS";

jest.mock("./checkNotificationStatusAndroid");
jest.mock("./checkNotificationStatusIOS");
jest.mock("./isIOS");

describe("checkNotificationStatus", () => {
  it("calls checkNotificationStatusIOS if isIOS returns true", async () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(true);
    await checkNotificationStatus();
    expect(checkNotificationStatusIOS).toHaveBeenCalled();
    expect(checkNotificationStatusAndroid).not.toHaveBeenCalled();
  });

  it("calls checkNotificationStatusAndroid if isIOS returns false", async () => {
    (<jest.Mock>isIOS).mockReturnValueOnce(false);
    await checkNotificationStatus();
    expect(checkNotificationStatusAndroid).toHaveBeenCalled();
    expect(checkNotificationStatusIOS).not.toHaveBeenCalled();
  });
});
