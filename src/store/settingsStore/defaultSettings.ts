import { BLOCKEXPLORER } from "@env";
import { APPVERSION } from "../../constants";

export const defaultSettings: Settings = {
  appVersion: APPVERSION,

  enableAnalytics: false,
  analyticsPopupSeen: undefined,

  lastFileBackupDate: undefined,
  lastSeedBackupDate: undefined,
  showBackupReminder: false,
  shouldShowBackupOverlay: true,

  country: undefined,
  locale: undefined,
  displayCurrency: "EUR",

  nodeURL: BLOCKEXPLORER,

  fundFrom: "bitcoin",
  refundAddress: undefined,
  refundAddressLabel: undefined,
  refundToPeachWallet: true,
  payoutAddress: undefined,
  payoutAddressLabel: undefined,
  payoutAddressSignature: undefined,
  payoutToPeachWallet: true,
  derivationPath: undefined,

  fcmToken: undefined,
  isLoggedIn: false,
};
