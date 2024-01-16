/* eslint-disable max-len */
/* eslint-disable max-lines */

import { BuyOffer, SellOffer } from '../../../peach-api/src/@types/offer'
import { defaultUser } from '../../../peach-api/src/testData/user'
import { twintDataHashes, validSEPAData, validSEPADataHashes } from './paymentData'

export const buyOffer: BuyOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  lastModified: new Date('2022-03-08T11:41:07.245Z'),
  id: '37',
  online: true,
  type: 'bid',
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['twint'],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  amount: [50000, 250000],
  matches: [],
  doubleMatched: false,
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  tradeStatus: 'searchingForPeer',
  maxPremium: null,
  minReputation: null,
  user: defaultUser,
  escrowFee: 0.0001,
  freeTrade: false,
  message: '',
}

export const sellOffer: SellOffer = {
  creationDate: new Date('2022-03-08T11:41:07.245Z'),
  publishingDate: new Date('2022-03-08T11:41:07.245Z'),
  lastModified: new Date('2022-03-08T11:41:07.245Z'),
  id: '38',
  online: true,
  type: 'ask',
  meansOfPayment: {
    EUR: ['sepa'],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
  },
  funding: {
    status: 'NULL',
    txIds: [],
    vouts: [],
    amounts: [],
    expiry: 537,
  },
  amount: 250000,
  premium: 1.5,
  matches: [],
  doubleMatched: false,
  returnAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  refunded: false,
  released: false,
  tradeStatus: 'searchingForPeer',
  escrowFee: 0.0001,
  freeTrade: false,
  user: defaultUser,
  fundingAmountDifferent: false,
  publicKey: 'TODO add public key',
}

export const wronglyFundedSellOffer: SellOffer = {
  ...sellOffer,
  amount: 42069,
  funding: { ...sellOffer.funding, amounts: [69420] },
}
export const buyOfferUnpublished: BuyOfferDraft = {
  type: 'bid',
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['twint'],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  originalPaymentData: [validSEPAData],
  amount: [250000, 500000],
  tradeStatus: 'offerHidden',
  releaseAddress: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
  maxPremium: null,
  minReputation: null,
}

export const matchOffer: Match = {
  user: defaultUser,
  offerId: '37',
  prices: {
    EUR: 1,
    CHF: 1.1,
  },
  matchedPrice: 1,
  premium: 1.5,
  meansOfPayment: {
    EUR: ['sepa'],
    CHF: ['twint'],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  selectedCurrency: 'EUR',
  selectedPaymentMethod: 'sepa',
  symmetricKeyEncrypted: 'TODO add symmetric key encrypted',
  symmetricKeySignature: 'TODO add symmetric key signature',
  matched: true,
  amount: 250000,
  unavailable: {
    exceedsLimit: [],
  },
  instantTrade: false,
}
