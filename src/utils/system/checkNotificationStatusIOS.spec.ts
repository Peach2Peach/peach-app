import messaging from "@react-native-firebase/messaging";
import { checkNotificationStatusIOS } from "./checkNotificationStatusIOS";

describe("checkNotificationStatusIOS", () => {
  const hasPermissionMock = jest.spyOn(messaging(), "hasPermission");
  it("returns true if notifications are enabled", async () => {
    hasPermissionMock.mockResolvedValue(
      messaging.AuthorizationStatus.AUTHORIZED,
    );

    const result = await checkNotificationStatusIOS();
    expect(hasPermissionMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("returns true if notifications permission status is provisional", async () => {
    hasPermissionMock.mockResolvedValue(
      messaging.AuthorizationStatus.PROVISIONAL,
    );

    const result = await checkNotificationStatusIOS();
    expect(hasPermissionMock).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("returns false if notifications permission status is not determined", async () => {
    hasPermissionMock.mockResolvedValue(
      messaging.AuthorizationStatus.NOT_DETERMINED,
    );

    const result = await checkNotificationStatusIOS();
    expect(hasPermissionMock).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("returns false if notifications permission status is denied", async () => {
    hasPermissionMock.mockResolvedValue(messaging.AuthorizationStatus.DENIED);

    const result = await checkNotificationStatusIOS();
    expect(hasPermissionMock).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("returns false if notifications are disabled", async () => {
    hasPermissionMock.mockRejectedValue(new Error());

    const result = await checkNotificationStatusIOS();
    expect(hasPermissionMock).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
