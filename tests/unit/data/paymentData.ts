import { PaymentDetailInfo } from "../../../src/store/usePaymentDataStore/types";

export const validSEPAData: PaymentData = {
  id: "sepa-1669721660451",
  label: "SEPA EUR",
  type: "sepa",
  beneficiary: "Hal Finney",
  iban: "IE29 AIBK 9311 5212 3456 78",
  bic: "AAAA BB CC 123",
  currencies: ["EUR"],
  hidden: false,
};

export const validSEPADataHashes = [
  "8b703de3cb4f30887310c0f6fcaa35d58be484207ebffec12be69ec9b1d0b5f3",
];

export const validSEPAData2: PaymentData = {
  id: "sepa-1669721660452",
  label: "SEPA 2",
  type: "sepa",
  beneficiary: "Kolge",
  iban: "IE29 AIBK 9311 5212 3456 78",
  bic: "AAAA BB CC 123",
  currencies: ["EUR"],
  hidden: false,
};

export const missingSEPAData: PaymentData = {
  id: "sepa-1669721660453",
  label: "SEPA EUR Missing Data",
  type: "sepa",
  currencies: ["EUR"],
  hidden: false,
};

export const invalidSEPADataCurrency: PaymentData = {
  ...validSEPAData,
  currencies: ["CHF"],
};

export const validCashData: PaymentData = {
  id: "cash-1669721660451",
  label: "Cash EUR",
  type: "cash.es.barcelonabitcoin",
  currencies: ["EUR"],
  country: "ES",
  hidden: false,
};

export const revolutData: PaymentData = {
  id: "revolut-123456789",
  label: "Revolut",
  type: "revolut",
  phone: "+412134245",
  currencies: ["EUR"],
  hidden: false,
};
export const revolutDataHashes = [
  "9e425d9336fff33cbececf474fad2360fbe674b442f1adf789bb8f96234dcc87",
];

export const paypalData: PaymentData = {
  id: "paypal-1095805944",
  phone: "+412134245",
  label: "Paypal",
  type: "paypal",
  currencies: ["EUR"],
  hidden: false,
};
export const paypalDataHashes = [
  "9e425d9336fff33cbececf474fad2360fbe674b442f1adf789bb8f96234dcc87",
];

export const twintData: PaymentData = {
  id: "twint-1669721660451",
  label: "Twint",
  type: "twint",
  phone: "+341234875987",
  currencies: ["CHF"],
  hidden: false,
};

export const twintDataHashes = [
  "c56ab971aeea3e5aa3d2e62e4ed7cb5488a63b0659e6db7b467e7f899cb7b418",
];

export const liquidData: PaymentData = {
  id: "liquid-1669721660451",
  label: "liquid",
  type: "liquid",
  receiveAddress:
    "bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh",
  currencies: ["USDT"],
  hidden: false,
};

export const paymentDetailInfo: PaymentDetailInfo = {
  iban: { [validSEPADataHashes[0]]: validSEPAData.iban! },
  phone: { [twintDataHashes[0]]: twintData.phone! },
};
export const paymentDetailInfoInverted: PaymentDetailInfo = {
  iban: { [validSEPAData.iban!]: validSEPADataHashes[0] },
  phone: { [twintData.phone!]: twintDataHashes[0] },
};
