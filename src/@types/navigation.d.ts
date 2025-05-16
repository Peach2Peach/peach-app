type Onboarding = {
  welcome: undefined;
  userExistsForDevice: { referralCode?: string };
  accountCreated: undefined;
  createAccountError: { err: string; referralCode?: string };
  userSource: undefined;
  userBitcoinLevel: undefined;
  restoreBackup: { tab: "fileBackup" | "seedPhrase" } | undefined;
  restoreReputation: {
    referralCode?: string;
  };
};

type HomeTabParamList = {
  home: undefined;
  wallet: undefined;
  yourTrades: {
    tab?: "yourTrades.buy" | "yourTrades.sell" | "yourTrades.history";
  };
  settings: undefined;
};

type Home = {
  homeScreen: {
    screen: keyof HomeTabParamList;
    params?: HomeTabParamList[keyof HomeTabParamList];
  };
};

type BuyFlow = {
  buy: undefined;
  sellOfferDetails: { offerId: string; requestingOfferId?: string };
  buyOfferPreferences: undefined;
  editExpressBuyOfferFilters: undefined;
  explore: { offerId: string };
  editBuyPreferences: { offerId: string };
  matchDetails: { offerId: string; matchId: string };
  tradeRequestForBuyOffer: {
    userId: string;
    offerId: string;
    amount: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
    fiatPrice: number;
    symmetricKeyEncrypted: string;
    requestingOfferId: string | undefined;
  };
};

type SellFlow = {
  sellOfferPreferences: undefined;
  editExpressSellOfferFilters: undefined;
  buyOfferDetails: {
    offerId: string;
    amount: number;
    premium: number;
    requestingOfferId?: string;
  };
  fundEscrow: {
    offerId: string;
  };
  wrongFundingAmount: {
    offerId: string;
  };
  search: { offerId: string };
  editPremium: { offerId: string };
  tradeRequestForSellOffer: {
    userId: string;
    offerId: string;
    amount: number;
    currency: Currency;
    paymentMethod: PaymentMethod;
    fiatPrice: number;
    symmetricKeyEncrypted: string;
    isMatch?: boolean;
    matchingOfferId?: string;
    requestingOfferId: string | undefined;
  };
};

type ContractFlow = {
  contract: {
    contractId: string;
  };
  contractChat: {
    contractId: string;
  };
  disputeReasonSelector: {
    contractId: string;
  };
  disputeForm: {
    contractId: string;
    reason: DisputeReason;
  };
};

type RootStackParamList = Onboarding &
  Home &
  BuyFlow &
  SellFlow &
  ContractFlow & {
    nodeSetup: undefined;
    sendBitcoin: undefined;
    receiveBitcoin: undefined;
    addressChecker: undefined;
    coinSelection: undefined;
    transactionHistory: undefined;
    exportTransactionHistory: undefined;
    transactionDetails: {
      txId: string;
    };
    bumpNetworkFees: {
      txId: string;
    };
    selectCurrency: {
      origin: keyof RootStackParamList;
    };
    selectPaymentMethod: {
      selectedCurrency: Currency;
      origin: keyof RootStackParamList;
    };
    selectCountry: {
      selectedCurrency: Currency;
      origin: keyof RootStackParamList;
    };
    paymentMethodForm: {
      paymentData: Partial<PaymentData> & {
        type: PaymentMethod;
        currencies: Currency[];
      };
      origin: keyof RootStackParamList;
    };
    exportTradeHistory: undefined;
    offer: {
      offerId: string;
    };
    settings: undefined;
    contact: undefined;
    report: {
      reason: ContactReason;
      topic?: string;
      message?: string;
    };
    language: undefined;
    currency: undefined;
    publicProfile: {
      userId: string;
    };
    referrals: undefined;
    backups: undefined;
    seedWords: undefined;
    refundAddress: undefined;
    payoutAddress: undefined;
    paymentMethods: undefined;
    meetupScreen: {
      eventId: string;
      deletable?: boolean;
      origin: keyof RootStackParamList;
    };
    deleteAccount: undefined;
    peachFees: undefined;
    networkFees: undefined;
    aboutPeach: undefined;
    bitcoinProducts: undefined;
    socials: undefined;
    myProfile: undefined;
    transactionBatching: undefined;

    patchPayoutAddress:
      | {
          contractId: string;
        }
      | { offerId: string };
    signMessage:
      | { address: string; addressLabel: string }
      | { contractId: string; address: string; addressLabel: string }
      | { offerId: string; address: string; addressLabel: string };
  };
