type OfferDraft = {
  type: "bid" | "ask";
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

type ExperienceLevel = "newUsersOnly" | "experiencedUsersOnly";

type SellOfferDraft = OfferDraft & {
  type: "ask";
  amount: number;
  premium: number;
  fixedPrice?: number;
  /** currency code; string (not Currency) so peach-api offers stay assignable
   * despite the diverging Currency unions */
  fixedPriceCurrency?: string;
  returnAddress: string;
  funding: FundingStatus;
  multi?: number;
  instantTradeCriteria?: InstantTradeCriteria;
  experienceLevelCriteria?: ExperienceLevel;
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
  /** 2 = single-sig taproot escrow owned by the seller alone.
   * 0/1/undefined = legacy 2-of-2 P2WSH escrow shared with Peach. */
  escrowVersion?: number;

  oldOfferId?: string;
  newOfferId?: string;
  prices?: Pricebook;
  derivationPathVersion?: number;
};

type BuyOfferDraft = OfferDraft & {
  type: "bid";
  releaseAddress: string;
  amount: [number, number];
  messageSignature?: string;
  maxPremium: number | null;
  minReputation: number | null;
};

type BuyOffer69Draft = OfferDraft & {
  releaseAddress: string;
  amount: number;
  messageSignature?: string;
  premium: number;
  minReputation: number | null;
  instantTradeCriteria?: InstantTradeCriteria;
  experienceLevelCriteria?: ExperienceLevel;
};

type BuyOffer = Omit<BuyOfferDraft & Offer, "originalPaymentData"> & {
  message: string;
};

type BuyOffer69 = Omit<BuyOffer69Draft & Offer, "originalPaymentData"> & {
  message: string;
};
