export const buyOffer: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '37',
  type: 'bid',
  published: false,
  currencies: ['EUR', 'CHF'],
  paymentMethods: ['sepa'],
  kyc: false,
  amount: 250000,
  matches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const sellOffer: SellOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '38',
  type: 'ask',
  published: false,
  currencies: ['EUR'],
  paymentData: [
    {
      id: 'sepa',
      type: 'sepa',
      selected: true
    }
  ],
  hashedPaymentData: 'TODO',
  paymentMethods: ['sepa'],
  kyc: false,
  amount: 250000,
  premium: 1.5,
  matches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  refunded: false,
  released: false,
}
export const buyOfferUnpublished: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  type: 'bid',
  published: false,
  currencies: ['EUR', 'CHF'],
  paymentMethods: ['sepa'],
  kyc: false,
  amount: 250000,
  matches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const recoveredAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
  contracts: [],
  publicKey: '03d0377f7d412d4aa035447c0e1a1059a18897fdf2918bf33532a5ba21334ab7f7',
  privKey: '8fadd789d055f2d9ddb35f456cddbf959ddf029a88fd1ae05ec07b06a10542f9',
  mnemonic: 'next coach cabbage crucial garden jacket blast decline visual summer uniform pudding'
}

export const account1: Account = {
  settings: {
    skipTutorial: true,
    amount: 1000000,
    currencies: ['EUR', 'CHF'],
    paymentMethods: ['sepa'],
    kyc: false
  },
  paymentData: [],
  offers: [
    buyOffer,
    sellOffer,
    buyOfferUnpublished,
  ],
  contracts: [],
  publicKey: '03d0377f7d412d4aa035447c0e1a1059a18897fdf2918bf33532a5ba21334ab7f7',
  privKey: '8fadd789d055f2d9ddb35f456cddbf959ddf029a88fd1ae05ec07b06a10542f9',
  mnemonic: 'next coach cabbage crucial garden jacket blast decline visual summer uniform pudding'
}

export const paymentData: PaymentData[] = [
  {
    'beneficiary': 'Melocoton',
    'iban': 'IE29 AIBK 9311 5212 3456 78',
    'id': 'sepa-IE29AIBK93115212345678',
    'selected': true,
    'type': 'sepa'
  }, {
    'beneficiary': 'Test',
    'iban': 'EE38 2200 2210 2014 5685',
    'id': 'sepa-EE382200221020145685',
    'type': 'sepa'
  }
]

export const contract: Contract = {
  amount: 250000,
  buyerId: '02adcf3c857078dc3ca7064a49d20c6ae4978809057ffb75dc0750d8b5020aafe9',
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  currency: 'EUR',
  disputeActive: false,
  id: '14-15',
  kycRequired: false,
  paymentConfirmed: null,
  paymentMade: null,
  paymentMethod: 'sepa',
  price: 89.04,
  releaseAddress: 'bcrt1qxhkluxqp9u5f4a79vclgdah5vrzjzn2t8yn5rje3cnkvqk6u9fgqe5raag',
  sellerId: '024ffff13132b71b0`9efc4b2b84fa673eefeb3019664581f513f0d02903616800e'
}