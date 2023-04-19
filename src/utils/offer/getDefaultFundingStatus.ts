const defaultFundingStatus: FundingStatus = {
  status: 'NULL',
  txIds: [],
  vouts: [],
  amounts: [],
  expiry: 4320,
}
export const getDefaultFundingStatus = () => defaultFundingStatus
