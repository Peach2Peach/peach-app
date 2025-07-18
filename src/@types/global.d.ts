interface Global {
  WebSocket: unknown;
  ErrorUtils: {
    setGlobalHandler: unknown;
    reportFatalError: unknown;
    getGlobalHandler: unknown;
  };
}

declare const global: Global;

type ComponentProps = {
  testID?: string;
  forwardRef?: RefObject<unknown>;
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  onLayout?: (event: LayoutChangeEvent) => void;
};

type TradeTab = "yourTrades.buy" | "yourTrades.sell" | "yourTrades.history";

type BitcoinNetwork = "bitcoin" | "testnet" | "regtest";

type PaymentCategory =
  | "bankTransfer"
  | "onlineWallet"
  | "giftCard"
  | "nationalOption"
  | "cash"
  | "global";
type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[];
};

type HashedPaymentData = string;

type Message = {
  roomId: string;
  from: User["id"];
  date: Date;
  message: string;
  decrypted?: boolean;
  readBy: string[];
  signature: string;
  failedToSend?: boolean;
};

type Chat = {
  id: string;
  lastSeen: Date;
  messages: Message[];
  draftMessage: string;
};

type AppState = {
  notifications: number;
};

type Action = {
  onPress: () => void;
  label: string;
  iconId: IconType;
};

type Level = "APP" | "ERROR" | "WARN" | "INFO" | "DEFAULT" | "SUCCESS";
type SummaryItemLevel = Level | "WAITING";

type ToastState = {
  color: "red" | "white" | "yellow";
  msgKey: string;
  bodyArgs?: string[];
  action?: Action;
  keepAlive?: boolean;
};

type DrawerOptionType = {
  title: string;
  subtext?: string;
  iconRightID?: IconType;
  onPress: () => void;
} & (
  | {
      logoID: PaymentLogoType;
      flagID?: never;
      highlighted?: never;
      subtext?: never;
    }
  | {
      flagID: FlagType;
      logoID?: never;
      highlighted?: never;
    }
  | {
      flagID?: never;
      logoID?: never;
      highlighted: boolean;
      subtext: string;
      iconRightID?: never;
    }
  | {
      flagID?: never;
      logoID?: never;
      highlighted?: never;
    }
);

type DrawerState = {
  title: string;
  content?: ReactNode | null;
  options: DrawerOptionType[];
  show: boolean;
  previousDrawer?: DrawerState | undefined;
  onClose?: () => void;
};
type BitcoinState = {
  currency: Currency;
  price: number;
  satsPerUnit: number;
  prices: Pricebook;
};

type PeachWallet = {
  wallet: bip32.BIP32Interface;
  mnemonic: string;
};

type ContactReason =
  | "bug"
  | "accountLost"
  | "userProblem"
  | "question"
  | "sellMore"
  | "other";
