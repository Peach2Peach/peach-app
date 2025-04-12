import { Linking } from "react-native";
import * as reactNativeDeviceInfo from "react-native-device-info";
import { linkToAppStoreAndroid } from "./linkToAppStoreAndroid";

describe("linkToAppStoreAndroid", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  beforeEach(() => {
    openURLSpy.mockResolvedValue(undefined);
    jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
  });

  it("opens the correct URL when installed from Google Play", async () => {
    const getInstallerPackageNameSyncMock = jest.spyOn(
      reactNativeDeviceInfo,
      "getInstallerPackageNameSync",
    );
    getInstallerPackageNameSyncMock.mockReturnValueOnce("com.android.vending");
    await linkToAppStoreAndroid();
    expect(openURLSpy).toHaveBeenCalledWith(
      `https://play.google.com/store/apps/details?id=com.example.bundleId`,
    );
  });

  it("opens the correct URL when not installed via APK", async () => {
    await linkToAppStoreAndroid();
    expect(openURLSpy).toHaveBeenCalledWith("https://peachbitcoin.com/apk");
  });
});
