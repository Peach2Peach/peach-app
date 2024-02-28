type EscrowType = "bitcoin" | "liquid";

type OfferDraft = {
  type: "bid" | "ask";
  escrowType?: EscrowType;
  meansOfPayment: MeansOfPayment;
  paymentData: OfferPaymentData;
  originalPaymentData: PaymentData[];
  tradeStatus?: TradeStatus;
};

type Offer = Omit<OfferDraft, "originalPaymentData"> & {
  id: string;
  creationDate: Date;
  lastModified: Date;
  publishingDate?: Date;
  online: boolean;

  user: PublicUser;
  matches: Offer["id"][];
  doubleMatched: boolean;
  contractId?: string;
  escrowFee: number;
  freeTrade: boolean;

  tradeStatus: TradeStatus;
};

type InstantTradeCriteria = {
  minReputation: number;
  badges: Medal[];
  minTrades: number;
};

type SellOfferDraft = OfferDraft & {
  type: "ask";
  amount: number;
  premium: number;
  returnAddress: string;
  returnAddressLiquid?: string;
  multi?: number;
  instantTradeCriteria?: InstantTradeCriteria;
};
type SellOffer = Omit<SellOfferDraft & Offer, "originalPaymentData"> & {
  /** @deprecated */
  escrow?: string;

  escrowType: EscrowType;
  escrows: {
    bitcoin?: string;
    liquid?: string;
    lightning?: string;
  };
  funding: FundingStatus;
  fundingLiquid: FundingStatus;
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
};

type BuyOffer = Omit<BuyOfferDraft & Offer, "originalPaymentData"> & {
  message: string;
};
