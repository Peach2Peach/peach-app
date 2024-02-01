import { Linking } from "react-native";
import { linkToAppStoreAndroid } from "./linkToAppStoreAndroid";

const bundleId = "com.example.bundleId";
const getInstallerPackageNameSyncMock = jest.fn();
jest.mock("react-native-device-info", () => ({
  getBundleId: () => bundleId,
  getInstallerPackageNameSync: (...args: unknown[]) =>
    getInstallerPackageNameSyncMock(...args),
}));

describe("linkToAppStoreAndroid", () => {
  const openURLSpy = jest.spyOn(Linking, "openURL");

  beforeEach(() => {
    openURLSpy.mockResolvedValue(undefined);
    jest.spyOn(Linking, "canOpenURL").mockResolvedValue(true);
  });

  it("opens the correct URL when installed from Google Play", async () => {
    getInstallerPackageNameSyncMock.mockReturnValueOnce("com.android.vending");
    await linkToAppStoreAndroid();
    expect(openURLSpy).toHaveBeenCalledWith(
      `https://play.google.com/store/apps/details?id=${bundleId}`,
    );
  });

  it("opens the correct URL when not installed via APK", async () => {
    getInstallerPackageNameSyncMock.mockReturnValueOnce(
      "com.example.installer",
    );
    await linkToAppStoreAndroid();
    expect(openURLSpy).toHaveBeenCalledWith("https://peachbitcoin.com/apk");
  });
});
