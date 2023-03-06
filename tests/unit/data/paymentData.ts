export const validSEPAData: PaymentData = {
  id: 'sepa-1669721660451',
  label: 'SEPA EUR',
  type: 'sepa',
  beneficiary: 'Hal Finney',
  iban: 'IE29 AIBK 9311 5212 3456 78',
  bic: 'AAAA BB CC 123',
  currencies: ['EUR'],
}

export const missingSEPAData: PaymentData = {
  id: 'sepa-1669721660451',
  label: 'SEPA EUR Missing Data',
  type: 'sepa',
  currencies: ['EUR'],
}

export const invalidSEPADataCurrency: PaymentData = {
  ...validSEPAData,
  currencies: ['CHF'],
}

export const validCashData: PaymentData = {
  id: 'cash-1669721660451',
  label: 'Cash EUR',
  type: 'cash.es.barcelonabitcoin',
  currencies: ['EUR'],
  country: 'ES',
}
