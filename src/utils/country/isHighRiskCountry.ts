import { Country, countryMap } from "./countryMap";

export const isHighRiskCountry = (country?: Country) =>
  !country || !countryMap[country] || countryMap[country].highRisk;
