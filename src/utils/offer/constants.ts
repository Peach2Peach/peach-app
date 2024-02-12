const defaultFundingStatus: Omit<FundingStatus, 'derivationPath'> = {
  status: "NULL",
  confirmations: 0,
  txIds: [],
  vouts: [],
  amounts: [],
  expiry: 4320,
};

export const getDefaultFundingStatus =(id: string): FundingStatus => ({
  ...defaultFundingStatus,
  derivationPath: `m/48'/0'/0'/0/${id}`
})