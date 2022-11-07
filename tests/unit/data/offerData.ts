/* eslint-disable max-len */
/* eslint-disable max-lines */
// TODO add KYC offer types
// TODO add matches offer types
// TODO add offline offers

export const buyOffer: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '37',
  online: true,
  type: 'bid',
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  kyc: false,
  amount: 250000,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}

export const sellOffer: SellOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  id: '38',
  online: true,
  type: 'ask',
  meansOfPayment: {
    EUR: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  funding: {
    status: 'NULL',
    txIds: [],
    vouts: [],
    amounts: [],
    expiry: 537,
  },
  kyc: false,
  amount: 250000,
  premium: 1.5,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  refunded: false,
  released: false,
}
export const buyOfferUnpublished: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  type: 'bid',
  online: false,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['sepa'],
  },
  paymentData: {
    sepa: {
      hash: 'TODO add payment hash',
    },
  },
  originalPaymentData: [],
  kyc: false,
  amount: 250000,
  matches: [],
  matched: [],
  seenMatches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
}
