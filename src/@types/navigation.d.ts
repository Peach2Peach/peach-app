type Onboarding = {
  welcome:
    | {
        referralCode?: string
      }
    | undefined
  newUser: {
    referralCode?: string
  }
  userSource: undefined
  restoreBackup: { tab: 'fileBackup' | 'seedPhrase' } | undefined
  restoreReputation: {
    referralCode?: string
  }
}

type TestViews = {
  testView: undefined
  testViewPeachWallet: undefined
  testViewPNs: undefined
}

type HomeTabParamList = {
  home: undefined
  wallet: undefined
  yourTrades: { tab?: TradeTab }
  settings: undefined
}

type Home = {
  homeScreen: { screen: keyof HomeTabParamList; params?: HomeTabParamList[keyof HomeTabParamList] }
}

type BuyFlow = {
  buyOfferPreferences: undefined
  explore: { offerId: string }
  editBuyPreferences: { offerId: string }
  matchDetails: { offerId: string; matchId: string }
}

type SellFlow = {
  sellOfferPreferences: undefined
  fundEscrow: {
    offerId: string
  }
  wrongFundingAmount: {
    offerId: string
  }
  search: { offerId: string }
  editPremium: { offerId: string }
}

type ContractFlow = {
  contract: {
    contractId: Contract['id']
  }
  contractChat: {
    contractId: Contract['id']
  }
  paymentMade: {
    contractId: Contract['id']
  }
  disputeReasonSelector: {
    contractId: Contract['id']
  }
  disputeForm: {
    contractId: Contract['id']
    reason: DisputeReason
  }
  tradeComplete: {
    contractId: Contract['id']
  }
  patchPayoutAddress: {
    contractId: Contract['id']
  }
  signMessage: {
    contractId: Contract['id']
  }
}

type RootStackParamList = Onboarding &
  Home &
  BuyFlow &
  SellFlow &
  ContractFlow & {
    newBadge: {
      badges: string
    }
    nodeSetup: undefined
    sendBitcoin: undefined
    receiveBitcoin: undefined
    addressChecker: undefined
    coinSelection: undefined
    transactionHistory: undefined
    exportTransactionHistory: undefined
    transactionDetails: {
      txId: string
    }
    bumpNetworkFees: {
      txId: string
    }
    selectCurrency: {
      origin: keyof RootStackParamList
    }
    selectPaymentMethod: {
      selectedCurrency: Currency
      origin: keyof RootStackParamList
    }
    selectCountry: {
      selectedCurrency: Currency
      origin: keyof RootStackParamList
    }
    paymentMethodForm: {
      paymentData: Partial<PaymentData> & {
        type: PaymentMethod
        currencies: Currency[]
      }
      origin: keyof RootStackParamList
    }
    offerPublished: {
      offerId: string
      shouldGoBack?: boolean
    }
    exportTradeHistory: undefined
    offer: {
      offerId: string
    }
    settings: undefined
    contact: undefined
    report: {
      reason: ContactReason
      topic?: string
      message?: string
      shareDeviceID?: boolean
    }
    language: undefined
    currency: undefined
    publicProfile: {
      userId: string
    }
    referrals: undefined
    backupTime: {
      nextScreen?: keyof RootStackParamList
      [key: string]: unknown
    }
    backups: undefined
    backupCreated: undefined
    seedWords: undefined
    payoutAddress: { type: 'refund' } | undefined
    paymentMethods: undefined
    meetupScreen: {
      eventId: string
      deletable?: boolean
      origin: keyof RootStackParamList
    }
    deleteAccount: undefined
    peachFees: undefined
    networkFees: undefined
    aboutPeach: undefined
    bitcoinProducts: undefined
    socials: undefined
    myProfile: undefined
    transactionBatching: undefined
    groupHugAnnouncement: {
      offerId: string
    }
  } & TestViews
