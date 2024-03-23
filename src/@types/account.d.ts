type Settings = {
  appVersion: string;
  analyticsPopupSeen?: boolean;
  enableAnalytics?: boolean;
  locale?: string;
  fundFrom: Chain;
  refundAddress?: string;
  refundAddressLabel?: string;
  refundToPeachWallet: boolean;
  payoutAddress?: string;
  payoutAddressLabel?: string;
  payoutAddressSignature?: string;
  payoutToPeachWallet: boolean;
  derivationPath?: string;
  displayCurrency: Currency;
  country?: string;
  fcmToken?: string;
  lastFileBackupDate?: number;
  lastSeedBackupDate?: number;
  showBackupReminder: boolean;
  shouldShowBackupOverlay: boolean;
  nodeURL: string;
  cloudflareChallenge?: {
    cfClearance: string;
    userAgent: string;
  };
  isLoggedIn: boolean;
};

type PGPKeychain = {
  privateKey: string;
  publicKey: string;
};

type Identity = {
  publicKey: string;
  mnemonic?: string;
  base58?: string;
  pgp: PGPKeychain;
};

type Account = Identity & {
  tradingLimit: TradingLimit;
  chats: {
    [key: string]: Chat;
  };
};

type AccountBackup = Account & {
  paymentData: PaymentData[];
  settings: Settings;
};
