import { BitcoinEvent } from "../../../peach-api/src/@types/events";

export const btcPrague: BitcoinEvent = {
  id: "cz.prague.btc-prague",
  featured: true,
  currencies: ["EUR"],
  country: "CZ",
  city: "Prague",
  shortName: "BTC Prague",
  longName: "BTC Prague",
  url: "https://btcprague.com/",
  frequency: "June 19-21, 2025",
  logo: "/v1/events/logo/btc-prague.svg",
};

export const belgianBTCEmbassy: BitcoinEvent = {
  id: "be.antwerp.belgian-btc-embassy",
  featured: false,
  currencies: ["EUR"],
  country: "BE",
  city: "Antwerp",
  shortName: "Belgian BTC Embassy",
  longName: "Belgian Bitcoin Embassy",
  url: "https://www.meetup.com/belgian-bitcoin-embassy-meetup/events/",
  address: "Sint-Aldegondiskaai\n44, 2000 Antwerpen",
  frequency: "The 21st of each month",
  logo: "/v1/events/logo/bbe.png",
};

export const decouvreBTC: BitcoinEvent = {
  id: "fr.lyon.decouvre-btc-lyon",
  featured: false,
  currencies: ["EUR"],
  country: "FR",
  city: "Lyon",
  shortName: "Découvre BTC Lyon",
  longName: "Découvre Bitcoin Lyon",
  url: "https://t.me/bitcoinlyon",
  logo: "/v1/events/logo/lyon.png",
};

export const breizhBitcoin: BitcoinEvent = {
  id: "fr.rennes.breizh-bitcoin",
  featured: false,
  currencies: ["EUR"],
  country: "FR",
  city: "Rennes",
  shortName: "Breizh Bitcoin",
  longName: "Breizh Bitcoin",
  url: "https://twitter.com/BreizhBitcoin",
  frequency: "1st tuesday of the month",
  logo: "/v1/events/logo/breizh.png",
};
