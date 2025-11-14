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

type TestViews = {
  testView: undefined;
  testViewPeachWallet: undefined;
  testViewPNs: undefined;
};

type HomeTabParamList = {
  home: undefined;
  wallet: undefined;
  yourTrades: { tab?: TradeTab };
  settings: undefined;
};

type Home = {
  homeScreen: {
    screen: keyof HomeTabParamList;
    params?: HomeTabParamList[keyof HomeTabParamList];
  };
};

type BuyFlow = {
  buyOfferPreferences: undefined;
  explore: { offerId: string };
  editBuyPreferences: { offerId: string };
  matchDetails: { offerId: string; matchId: string };
};

type SellFlow = {
  sellOfferPreferences: undefined;
  fundEscrow: {
    offerId: string;
  };
  wrongFundingAmount: {
    offerId: string;
  };
  search: { offerId: string };
  editPremium: { offerId: string; preferedDisplayCurrency?: Currency };
  editPremiumOfBuyOffer: {
    offerId: string;
    preferedDisplayCurrency?: Currency;
  };
};

type ContractFlow = {
  contract: {
    contractId: Contract["id"];
  };
  contractChat: {
    contractId: Contract["id"];
  };
  disputeReasonSelector: {
    contractId: Contract["id"];
  };
  disputeForm: {
    contractId: Contract["id"];
    reason: DisputeReason;
  };
};

// peach 069 flows START
type ExpressBuyFlow = {
  expressBuyBrowseSellOffers: undefined;
  expressBuyTradeRequest: { offerId: string };
};

type ExpressSellFlow = {
  expressSellBrowseBuyOffers: undefined;
  expressSellTradeRequest: { offerId: string };
};

type ExpressBuySellFlowChat = {
  tradeRequestChat: {
    offerId: string;
    requestingUserId: string;
    offerType: "buy" | "sell";
  };
};

type BuyOfferOwnerFlow = {
  createBuyOffer: undefined;
  browseTradeRequestsToMyBuyOffer: { offerId: string };
};

type SellOfferOwnerFlow = {
  browseTradeRequestsToMySellOffer: { offerId: string };
};

// peach 069 flows END

type RootStackParamList = Onboarding &
  Home &
  BuyFlow &
  SellFlow &
  ContractFlow & {
    nodeSetup: undefined;
    pinCodeSetup: undefined;
    changePin: undefined;
    deletePin: undefined;
    createPin: undefined;
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
          contractId: Contract["id"];
        }
      | { offerId: string };
    signMessage:
      | { address: string; addressLabel: string }
      | { contractId: Contract["id"]; address: string; addressLabel: string }
      | { offerId: string; address: string; addressLabel: string };
  } & TestViews &
  ExpressBuyFlow &
  ExpressSellFlow &
  BuyOfferOwnerFlow &
  SellOfferOwnerFlow &
  ExpressBuySellFlowChat;
