import { Linking } from "react-native";

export const openInWallet = async (paymentRequest: string) => {
  try {
    await Linking.openURL(paymentRequest);
    return true;
  } catch (e) {
    return false;
  }
};
