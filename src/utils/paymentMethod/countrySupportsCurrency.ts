const map: Record<Currency, PaymentMethodCountry[]> = {
  EUR: ["DE", "FR", "IT", "ES", "NL"],
  CHF: ["CH"],
  GBP: ["GB", "UK"],
  SEK: ["SE"],
  USD: ["US"],
  DKK: [],
  BGN: [],
  CZK: [],
  HUF: [],
  PLN: [],
  RON: [],
  ISK: [],
  NOK: [],
  USDT: [],
  SAT: [],
  TRY: [],
  ARS: [],
  COP: [],
  PEN: [],
  MXN: [],
  CLP: [],
  XOF: [],
  NGN: [],
  CDF: [],
  CRC: [],
  BRL: [],
  BTC: [],
  GTQ: [],
  ZAR: [],
  KES: [],
  GHS: [],
};

export const countrySupportsCurrency =
  (currency: Currency) => (country: PaymentMethodCountry) =>
    map[currency].includes(country);
