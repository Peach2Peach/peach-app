import { NativeModules, Platform } from "react-native";

const LINKING_ERROR =
  `The package 'rn-notification-badge' doesn't seem to be linked. Make sure: \n\n${Platform.select(
    { ios: "- You have run 'pod install'\n", default: "" },
  )}- You rebuilt the app after installing the package\n` +
  `- You are not using Expo Go\n`;

const RnNotificationBadge = NativeModules.RnNotificationBadge
  ? NativeModules.RnNotificationBadge
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );
export default RnNotificationBadge;
export function setNumber(number: number): void {
  return RnNotificationBadge.setNumber(number);
}
export function getNumber(): Promise<number> {
  return RnNotificationBadge.getNumber();
}
export function increment(): void {
  return RnNotificationBadge.increment();
}
