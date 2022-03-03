export const recoveredAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
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
    {
      type: 'bid',
      published: true,
      currencies: ['EUR', 'CHF'],
      paymentData: [
        {
          id: 'sepa',
          type: 'sepa',
          selected: true
        }
      ],
      kyc: false,
      amount: 250000,
      matches: [],
      doubleMatched: false,
      releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
      id: '21'
    }, {
      type: 'bid',
      published: true,
      currencies: ['EUR', 'CHF'],
      paymentData: [
        {
          id: 'sepa',
          type: 'sepa',
          selected: true
        }
      ],
      kyc: false,
      amount: 250000,
      matches: [],
      doubleMatched: false,
      releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
      id: '22'
    }, {
      type: 'bid',
      published: true,
      currencies: ['EUR', 'CHF'],
      paymentData: [
        {
          id: 'sepa',
          type: 'sepa',
          selected: true
        }
      ],
      kyc: false,
      amount: 500000,
      matches: [],
      doubleMatched: false,
      releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
      id: '23'
    }
  ],
  publicKey: '03d0377f7d412d4aa035447c0e1a1059a18897fdf2918bf33532a5ba21334ab7f7',
  privKey: '8fadd789d055f2d9ddb35f456cddbf959ddf029a88fd1ae05ec07b06a10542f9',
  mnemonic: 'next coach cabbage crucial garden jacket blast decline visual summer uniform pudding'
}

export const buyOfferUnpublished: BuyOffer = {
  type: 'bid',
  published: false,
  currencies: ['EUR', 'CHF'],
  paymentData: [
    {
      id: 'sepa',
      type: 'sepa',
      selected: true
    }
  ],
  kyc: false,
  amount: 250000,
  matches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const buyOffer: BuyOffer = {
  id: '37',
  type: 'bid',
  published: false,
  currencies: ['EUR', 'CHF'],
  paymentData: [
    {
      id: 'sepa',
      type: 'sepa',
      selected: true
    }
  ],
  kyc: false,
  amount: 250000,
  matches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const sellOffer: SellOffer = {
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
  kyc: false,
  amount: 250000,
  premium: 1.5,
  matches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
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