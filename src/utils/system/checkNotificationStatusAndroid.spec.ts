import * as reactNativePermissions from "react-native-permissions";
import { checkNotificationStatusAndroid } from "./checkNotificationStatusAndroid";

describe("checkNotificationStatusAndroid", () => {
  const checkNotifications = jest.spyOn(
    reactNativePermissions,
    "checkNotifications",
  );
  it("returns true if notifications are enabled", async () => {
    checkNotifications.mockResolvedValueOnce({
      status: "granted",
      settings: { alert: true },
    });

    const result = await checkNotificationStatusAndroid();
    expect(result).toBe(true);

    expect(checkNotifications).toHaveBeenCalled();
  });

  it("returns false if notifications are unavailable", async () => {
    checkNotifications.mockResolvedValueOnce({
      status: "unavailable",
      settings: { alert: true },
    });

    const result = await checkNotificationStatusAndroid();
    expect(result).toBe(false);

    expect(checkNotifications).toHaveBeenCalled();
  });
  it("returns false if notifications are denied", async () => {
    checkNotifications.mockResolvedValueOnce({
      status: "denied",
      settings: { alert: true },
    });

    const result = await checkNotificationStatusAndroid();
    expect(result).toBe(false);

    expect(checkNotifications).toHaveBeenCalled();
  });
  it("returns false if notifications are blocked", async () => {
    checkNotifications.mockResolvedValueOnce({
      status: "blocked",
      settings: { alert: true },
    });

    const result = await checkNotificationStatusAndroid();
    expect(result).toBe(false);

    expect(checkNotifications).toHaveBeenCalled();
  });
  it("returns false if notifications are limited", async () => {
    checkNotifications.mockResolvedValueOnce({
      status: "limited",
      settings: { alert: true },
    });

    const result = await checkNotificationStatusAndroid();
    expect(result).toBe(false);

    expect(checkNotifications).toHaveBeenCalled();
  });
});
