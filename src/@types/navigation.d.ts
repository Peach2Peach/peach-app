type Onboarding = {
  welcome: undefined;
  newUser: {
    referralCode?: string;
  };
  userSource: undefined;
  restoreBackup: { tab: "fileBackup" | "seedPhrase" } | undefined;
  restoreReputation: {
    referralCode?: string;
  };
};

type TestViews = {
  testView: undefined;
  testViewPeachWallet: undefined;
  testViewLiquidWallet: undefined;
  testViewPNs: undefined;
};

type HomeTabParamList = {
  home: undefined;
  wallet: undefined;
  liquidWallet: undefined;
  lightningWallet: undefined;
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
  editPremium: { offerId: string };
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
    exportTransactionHistory: {
      chain: Chain;
    };
    transactionDetails: {
      txId: string;
    };
    transactionDetailsLiquid: {
      txId: string;
    };
    bumpNetworkFees: {
      txId: string;
    };
    transactionHistoryLiquid: undefined;
    sendBitcoinLiquid: undefined;
    receiveBitcoinLiquid: undefined;
    sendBitcoinLightning: undefined;
    receiveBitcoinLightning: undefined;
    lightningInvoice: {
      invoice: string;
    };
    transactionHistoryLightning: undefined;
    transactionDetailsLightning: {
      invoice: string;
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
      shareDeviceID?: boolean;
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
  } & TestViews;
