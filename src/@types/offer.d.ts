type InstantTradeCriteria = {
  minReputation: number;
  badges: Medal[];
  minTrades: number;
};

type OfferDraft = {
  type: "bid" | "ask";
  meansOfPayment: MeansOfPayment;
  paymentData: OfferPaymentData;
  originalPaymentData: PaymentData[];
  instantTradeCriteria?: InstantTradeCriteria;
};

type TradeStatus =
  | "confirmCancelation"
  | "confirmPaymentRequired"
  | "dispute"
  | "escrowWaitingForConfirmation"
  | "createEscrow"
  | "fundEscrow"
  | "waitingForFunding"
  | "fundingExpired"
  | "fundingAmountDifferent"
  | "hasMatchesAvailable"
  | "offerCanceled"
  | "offerHidden"
  | "offerHiddenWithMatchesAvailable"
  | "paymentRequired"
  | "paymentTooLate"
  | "payoutPending"
  | "rateUser"
  | "refundAddressRequired"
  | "refundOrReviveRequired"
  | "refundTxSignatureRequired"
  | "releaseEscrow"
  | "searchingForPeer"
  | "tradeCanceled"
  | "tradeCompleted";
type Offer = Omit<OfferDraft, "originalPaymentData"> & {
  id: string;
  creationDate: Date;
  lastModified: Date;
  publishingDate?: Date;
  online: boolean;

  user: PublicUser;
  matches: string[];
  doubleMatched: boolean;
  contractId?: string;
  escrowFee: number;
  freeTrade: boolean;

  tradeStatus: TradeStatus;
};

type SellOfferDraft = OfferDraft & {
  type: "ask";
  amount: number;
  premium: number;
  returnAddress: string;
  funding: FundingStatus;
  multi?: number;
};
type SellOffer = Omit<SellOfferDraft & Offer, "originalPaymentData"> & {
  escrow?: string;
  escrowNotifiedUser?: boolean;
  tx?: string;
  refundTx?: string; // base 64 encoded psbt
  releaseTx?: string;
  txId?: string;
  refunded: boolean;
  released: boolean;
  fundingAmountDifferent: boolean;
  publicKey: string;

  oldOfferId?: string;
  newOfferId?: string;
  prices?: Pricebook;
};

type BuyOfferDraft = OfferDraft & {
  type: "bid";
  releaseAddress: string;
  amount: [number, number];
  messageSignature?: string;
  maxPremium: number | null;
  minReputation: number | null;
  multi?: number;
};

type BuyOffer = Omit<BuyOfferDraft & Offer, "originalPaymentData"> & {
  message: string;
};
