import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { defaultUser } from "../../../peach-api/src/testData/userData";
import { getDefaultFundingStatus } from "../../../src/utils/offer/constants";
import { liquidAddresses } from "./liquidNetworkData";
import {
  twintDataHashes,
  validSEPAData,
  validSEPADataHashes,
} from "./paymentData";

const BITCOIN_BLOCKS_IN_4_DAYS = 576;
const LIQUID_BLOCKS_IN_4_DAYS = 5760;

const fundingStatusHelper = (
  fundingStatus: Omit<FundingStatus, "expiry">,
): Pick<SellOffer, "funding" | "fundingLiquid"> => ({
  funding: { ...fundingStatus, expiry: BITCOIN_BLOCKS_IN_4_DAYS },
  fundingLiquid: { ...fundingStatus, expiry: LIQUID_BLOCKS_IN_4_DAYS },
});

export const buyOffer: BuyOffer = {
  creationDate: new Date("2022-03-08T11:41:07.245Z"),
  publishingDate: new Date("2022-03-08T11:41:07.245Z"),
  lastModified: new Date("2022-03-08T11:41:07.245Z"),
  id: "37",
  online: true,
  type: "bid",
  escrowType: "bitcoin",
  meansOfPayment: {
    EUR: ["sepa"],
    CHF: ["twint"],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  amount: [50000, 250000],
  matches: [],
  doubleMatched: false,
  releaseAddress:
    "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  tradeStatus: "searchingForPeer",
  maxPremium: null,
  minReputation: null,
  user: defaultUser,
  escrowFee: 0.0001,
  freeTrade: false,
  message: "",
};

export const sellOffer: SellOffer = {
  creationDate: new Date("2022-03-08T11:41:07.245Z"),
  publishingDate: new Date("2022-03-08T11:41:07.245Z"),
  lastModified: new Date("2022-03-08T11:41:07.245Z"),
  id: "38",
  online: true,
  type: "ask",
  meansOfPayment: {
    EUR: ["sepa"],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
  },
  ...fundingStatusHelper(getDefaultFundingStatus("38")),
  escrow: "bcrt1qd82dyvujm7527admrrwqhwhapyrg3l7px4vyz83adlgk3u8zlgasqf6g2a",
  escrows: {
    bitcoin: "bcrt1qd82dyvujm7527admrrwqhwhapyrg3l7px4vyz83adlgk3u8zlgasqf6g2a",
    liquid: "ert1qrxl2jwt08lnzxn77hrtdlhrqtr8q9vj2tucmxfw9tla59ws6jxwqw0qh3e",
  },
  escrowType: "bitcoin",
  amount: 250000,
  premium: 1.5,
  matches: [],
  doubleMatched: false,
  returnAddress:
    "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  refunded: false,
  released: false,
  tradeStatus: "searchingForPeer",
  escrowFee: 0.0001,
  freeTrade: false,
  user: defaultUser,
  fundingAmountDifferent: false,
  publicKey: "TODO add public key",
};

export const sellOfferLiquid: SellOffer = {
  ...sellOffer,
  id: "12345",
  escrowType: "liquid",
  escrow: "bcrt1qgkp0epg4a6zqngtp9jhwg77pg4798k6yg7vrrdl5zw67tq9kgklsxe6xjl",
  escrows: {
    bitcoin: "bcrt1qgkp0epg4a6zqngtp9jhwg77pg4798k6yg7vrrdl5zw67tq9kgklsxe6xjl",
    liquid: "ert1qcmwv3ce7jya3x6zqqt4xlrqpqy7huef8j9ap4cxft2dqy9y59cvs2j87pl",
  },
  ...fundingStatusHelper(getDefaultFundingStatus("12345")),
  returnAddress: liquidAddresses.regtest[0],
};

export const wronglyFundedSellOffer: SellOffer = {
  ...sellOffer,
  id: "39",
  amount: 42069,
  ...fundingStatusHelper({
    ...getDefaultFundingStatus("39"),
    amounts: [69420],
  }),
};
export const buyOfferUnpublished: BuyOfferDraft = {
  type: "bid",
  escrowType: "bitcoin",
  meansOfPayment: {
    EUR: ["sepa"],
    CHF: ["twint"],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  originalPaymentData: [validSEPAData],
  amount: [250000, 500000],
  tradeStatus: "offerHidden",
  releaseAddress:
    "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  maxPremium: null,
  minReputation: null,
};

export const matchOffer: Match = {
  user: defaultUser,
  offerId: "37",
  prices: {
    EUR: 1,
    CHF: 1.1,
  },
  matchedPrice: 1,
  premium: 1.5,
  meansOfPayment: {
    EUR: ["sepa"],
    CHF: ["twint"],
  },
  paymentData: {
    sepa: { hashes: validSEPADataHashes },
    twint: { hashes: twintDataHashes },
  },
  selectedCurrency: "EUR",
  selectedPaymentMethod: "sepa",
  symmetricKeyEncrypted: "TODO add symmetric key encrypted",
  symmetricKeySignature: "TODO add symmetric key signature",
  matched: true,
  amount: 250000,
  unavailable: {
    exceedsLimit: [],
  },
  instantTrade: false,
};
