import { Linking } from "react-native";
import { info } from "../log/info";

export const openURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url).catch((err) => info("Error opening URL: ", err));
  }

  return undefined;
};
