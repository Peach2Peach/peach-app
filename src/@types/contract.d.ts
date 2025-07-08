type ContractAction = "none" | "sendPayment" | "confirmPayment";
type PaymentReminder = "sixHours" | "oneHour" | "final";

type TradeParticipant = "seller" | "buyer";

type BatchInfo = {
  participants: number;
  maxParticipants: number;
  timeRemaining: number;
  completed: boolean;
  txId?: string;
};

type EncryptionMethod = "aes256" | "asymmetric";

type Contract = {
  creationDate: Date;
  lastModified: Date;
  id: string;
  seller: PublicUser;
  buyer: PublicUser;

  symmetricKeyEncrypted: string;
  symmetricKeySignature: string;

  amount: number;
  currency: Currency;
  price: number;
  priceCHF: number;
  premium: number;
  paymentMethod: PaymentMethod;
  paymentDataEncrypted: string;
  paymentDataSignature: string;
  paymentData?: PaymentData;
  buyerPaymentDataEncrypted: string;
  buyerPaymentDataSignature: string;
  buyerPaymentData?: PaymentData;
  hashedPaymentData: string[];
  buyerHashedPaymentData: string[];
  country?: PaymentMethodCountry;

  paymentMade: Date | null;
  paymentConfirmed: Date | null;
  paymentExpectedBy: Date;
  lastReminderSent?: PaymentReminder;

  escrow: string;
  releaseAddress: string;
  releaseTransaction?: string;
  releaseTxId?: string;

  releasePsbt: string;
  batchId?: string;

  disputeActive: boolean;
  disputeDate: Date | null;
  disputeReason?: DisputeReason;
  disputeClaim?: string;
  disputeInitiator?: string;
  disputeAcknowledgedByCounterParty?: boolean;
  disputeOutcome?: DisputeOutcome;
  disputeOutcomeAcknowledgedBy: TradeParticipant[];
  disputeWinner?: DisputeWinner;
  disputeResolvedDate?: Date | null;

  disputeTicketId?: string;
  disputeTicketIdCounterParty?: string;

  cancelationRequested?: boolean;
  canceled: boolean;
  canceledBy?: "buyer" | "seller" | "mediator";

  ratingBuyer: 1 | 0 | -1;
  ratingSeller: 1 | 0 | -1;
  messages: number;

  buyerFee: number;
  sellerFee: number;

  tradeStatus: TradeStatus;
  batchReleasePsbt?: string;
  batchInfo?: BatchInfo;
  isEmailRequired: boolean;
  unreadMessages: number;
  isChatActive: boolean;
  paymentDataEncryptionMethod: EncryptionMethod;

  fundingExpectedBy?: number;
};

type LocalContract = {
  id: string;
  disputeResultAcknowledged?: boolean;
  cancelConfirmationPending?: boolean;
  cancelConfirmationDismissed?: boolean;
  error?: "DECRYPTION_ERROR";
  hasSeenDisputeEmailPopup?: boolean;
};

type ContractViewer = "buyer" | "seller";
