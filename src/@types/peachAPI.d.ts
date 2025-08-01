type WSCallback = (message?: Message) => Promise<void> | void;
type PeachWS = {
  ws?: WebSocket;
  authenticated: boolean;
  connected: boolean;
  queue: (() => boolean)[];
  listeners: {
    message: WSCallback[];
    close: WSCallback[];
  };
  on: (listener: "message" | "close", callback: WSCallback) => void;
  off: (listener: "message" | "close", callback: WSCallback) => void;
  send: (data: string) => boolean;
  close: WebSocket["close"];
};

type APIError = {
  error: string;
  details?: unknown;
};

type FeeRate = "fastestFee" | "halfHourFee" | "hourFee" | "economyFee" | number;

type PGPPublicKeyProofPair = {
  publicKey: string;
  proof: string;
};
type User = {
  banned: boolean;
  bonusPoints: number;
  creationDate: Date;
  disabled: boolean;
  disputes: { opened: number; won: number; lost: number; resolved: number };
  fcmToken?: string;
  feeRate: FeeRate;
  freeTrades?: number;
  historyRating: number;
  id: string;
  isBatchingEnabled: boolean;
  kyc: boolean;
  lastModified: Date;
  linkedIds: string[];
  maxFreeTrades?: number;
  medals: Medal[];
  peachRating: number;

  /** @deprecated as of 0.4.2, use `pgpPublicKeys` */
  pgpPublicKey: string;

  /** @deprecated as of 0.4.2, use `pgpPublicKeys` */
  pgpPublicKeyProof: string;

  pgpPublicKeys: PGPPublicKeyProofPair[];

  rating: number;
  ratingCount: number;
  recentRating: number;
  referralCode?: string;
  referredTradingAmount: number;
  openedTrades: number;
  canceledTrades: number;
  trades: number;
  uniqueId: string;
  usedReferralCode?: string;
  userRating: number;
};

type PublicUser = Omit<
  User,
  | "disabled"
  | "banned"
  | "linkedIds"
  | "lastModified"
  | "kyc"
  | "uniqueId"
  | "referredTradingAmount"
  | "bonusPoints"
  | "feeRate"
  | "freeTrades"
  | "maxFreeTrades"
  | "isBatchingEnabled"
>;

type TradingLimit = {
  daily: number;
  dailyAmount: number;
  yearly: number;
  yearlyAmount: number;
  monthlyAnonymous: number;
  monthlyAnonymousAmount: number;
};

type TradingPair = "BTCEUR" | "BTCCHF" | "BTCGBP";

type Currency =
  | "AED"
  | "ARS"
  | "AUD"
  | "BGN"
  | "BOB"
  | "BRL"
  | "BRL"
  | "BTC"
  | "CAD"
  | "CDF"
  | "CHF"
  | "CLP"
  | "CNY"
  | "COP"
  | "CRC"
  | "CUP"
  | "CZK"
  | "DKK"
  | "DOP"
  | "EGP"
  | "EUR"
  | "GBP"
  | "GHS"
  | "GTQ"
  | "HNL"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "ISK"
  | "JPY"
  | "KES"
  | "KZT"
  | "MAD"
  | "MXN"
  | "MYR"
  | "NGN"
  | "NOK"
  | "NZD"
  | "PAB"
  | "PEN"
  | "PHP"
  | "PKR"
  | "PLN"
  | "PYG"
  | "RON"
  | "RSD"
  | "SAR"
  | "SAT"
  | "SEK"
  | "SGD"
  | "TRY"
  | "TZS"
  | "UAH"
  | "USD"
  | "USD"
  | "USDT"
  | "UYU"
  | "VEF"
  | "VES"
  | "VND"
  | "XOF"
  | "ZAR";

type Pricebook = {
  [key in Currency]?: number;
};
type PaymentMethodCountry =
  | "BG"
  | "CZ"
  | "DK"
  | "HU"
  | "NO"
  | "PL"
  | "RO"
  | "TR"
  | "NG"
  | "DE"
  | "CH"
  | "ISK"
  | "SE"
  | "IT"
  | "ES"
  | "FR"
  | "NL"
  | "UK"
  | "BE"
  | "PT"
  | "GR"
  | "UK"
  | "GB"
  | "CY"
  | "SI"
  | "LV"
  | "US"
  | "FI";

type Country =
  | "DE"
  | "FR"
  | "IT"
  | "ES"
  | "NL"
  | "UK"
  | "SE"
  | "FI"
  | "BE"
  | "LV";
type MeetupEvent = {
  id: string;
  currencies: Currency[];
  country: Country;
  city: string;
  shortName: string;
  longName: string;
  url?: string;
  address?: string;
  frequency?: string;
  logo?: string;
  featured: boolean;
};
type CountryEventsMap = Record<Country, MeetupEvent[]>;

type FundingStatus = {
  status: "NULL" | "MEMPOOL" | "FUNDED" | "WRONG_FUNDING_AMOUNT" | "CANCELED";
  confirmations?: number;
  txIds: string[];
  vouts: number[];
  amounts: number[];
  expiry: number;
};

type GetStatusResponse = {
  error: null;
  status: "online";
  serverTime: number;
};

type MeansOfPayment = Partial<Record<Currency, PaymentMethod[]>>;

type TradeStatus =
  | "confirmCancelation"
  | "confirmPaymentRequired"
  | "dispute"
  | "escrowWaitingForConfirmation"
  | "fundEscrow"
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

type OfferPaymentData = Partial<
  Record<
    PaymentMethod,
    {
      hashes: string[];
      hash?: string;
      country?: PaymentMethodCountry;
      encrypted?: string;
      signature?: string;
    }
  >
>;

type FundingError = "" | "NOT_FOUND" | "UNAUTHORIZED";
type FundingStatusResponse = {
  offerId: string;
  escrow: string;
  funding: FundingStatus;
  error?: FundingError;
  returnAddress: string;
  userConfirmationRequired: boolean;
};

type MatchUnavailableReasons = {
  exceedsLimit: (keyof TradingLimit)[];
};

type Match = {
  user: PublicUser;
  offerId: string;
  amount: number;
  escrow?: string;
  prices: Pricebook;
  matchedPrice: number | null;
  premium: number;
  meansOfPayment: MeansOfPayment;
  paymentData?: OfferPaymentData;
  selectedCurrency?: Currency;
  selectedPaymentMethod?: PaymentMethod;
  symmetricKeyEncrypted: string;
  symmetricKeySignature: string;
  matched: boolean;
  unavailable: MatchUnavailableReasons;
  instantTrade: boolean;
};

type MatchResponse =
  | {
      success: true;
      contractId: string;
      refundTx: string;
    }
  | {
      matchedPrice: number;
    };

type GenerateBlockResponse = {
  txId: string;
};

type FeeRecommendation = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

type NotificationType =
  | "user.badge.unlocked" // PN-U01
  | "offer.escrowFunded" // PN-S03
  | "offer.notFunded" // PN-S02
  | "offer.fundingAmountDifferent" // PN-S07
  | "offer.wrongFundingAmount" // PN-S08
  | "offer.sellOfferExpired" // PN-S06
  | "offer.matchBuyer" // PN-B02
  | "offer.matchSeller" // PN-S09
  | "offer.outsideRange" // PN-S10
  | "contract.contractCreated" // PN-B03
  | "contract.buyer.paymentReminderSixHours" // PN-B04
  | "contract.buyer.paymentReminderOneHour" // PN-B05
  | "contract.buyer.paymentTimerHasRunOut" // PN-B12
  | "contract.buyer.paymentTimerSellerCanceled" // PN-B06
  | "contract.buyer.paymentTimerExtended" // PN-B07
  | "contract.seller.paymentTimerHasRunOut" // PN-S12
  | "contract.seller.canceledAfterEscrowExpiry" // PN-S14
  | "contract.paymentMade" // PN-S11
  | "contract.tradeCompleted" // PN-B09
  | "contract.chat" // PN-A03
  | "contract.buyer.disputeRaised" // PN-D01
  | "contract.seller.disputeRaised" // PN-D01
  | "contract.disputeResolved" // PN-D04
  | "contract.buyer.disputeWon" // PN-D02
  | "contract.buyer.disputeLost" // PN-D03
  | "contract.seller.disputeWon" // PN-D02
  | "contract.seller.disputeLost" // PN-D03
  | "contract.canceled" // PN-S13
  | "contract.cancelationRequest" // PN-B08
  | "contract.cancelationRequestAccepted" // PN-S15
  | "contract.cancelationRequestRejected" // PN-S16
  | "offer.buyOfferExpired"; // PN-B14

type PNData = {
  type?: NotificationType;
  badges?: string;
  offerId?: string;
  contractId?: string;
  isChat?: string;
};

type PNNotification = {
  titleLocArgs?: string[];
  bodyLocArgs?: string[];
};

type BuySorter = "highestAmount" | "lowestPremium" | "bestReputation";
type SellSorter = "highestPrice" | "bestReputation";

type Sorter = BuySorter | SellSorter;
