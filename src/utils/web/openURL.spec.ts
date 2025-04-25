import { Linking } from "react-native";
import { openURL } from "./openURL";

describe("openURL", () => {
  const url = "https://peachbitcoin.com";
  it("should test if an URL can be opened", async () => {
    jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    await openURL(url);
    expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
  });
  it("opens URL if it can be opened", async () => {
    jest.spyOn(Linking, "canOpenURL").mockResolvedValueOnce(true);
    jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    await openURL(url);
    expect(Linking.openURL).toHaveBeenCalledWith(url);
  });
  it("does not open URL if it cannot be opened", async () => {
    jest.spyOn(Linking, "canOpenURL").mockResolvedValueOnce(false);
    jest.spyOn(Linking, "openURL").mockResolvedValueOnce(true);
    await openURL(url);
    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
