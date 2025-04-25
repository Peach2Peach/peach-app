import { Linking } from "react-native";
import { linkToAppStoreIOS } from "./linkToAppStoreIOS";

describe("linkToAppStoreIOS", () => {
  it('opens the correct URL when "itms-beta://" can be opened', async () => {
    jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    jest.spyOn(Linking, "canOpenURL").mockResolvedValueOnce(true);
    await linkToAppStoreIOS();
    expect(Linking.openURL).toHaveBeenCalledWith(
      "https://beta.itunes.apple.com/v1/app/1619331312",
    );
  });

  it('does not open a URL when "itms-beta://" cannot be opened', async () => {
    jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    jest.spyOn(Linking, "canOpenURL").mockResolvedValueOnce(false);
    await linkToAppStoreIOS();
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
