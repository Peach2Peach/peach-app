interface Global {
  WebSocket: unknown;
  ErrorUtils: {
    setGlobalHandler: unknown;
    reportFatalError: unknown;
    getGlobalHandler: unknown;
  };
}

type BitcoinNetwork = "bitcoin" | "testnet" | "regtest";

type PaymentCategory =
  | "bankTransfer"
  | "onlineWallet"
  | "giftCard"
  | "nationalOption"
  | "cash"
  | "other";
type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[];
};

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

type ContactReason =
  | "bug"
  | "accountLost"
  | "userProblem"
  | "question"
  | "sellMore"
  | "other";
