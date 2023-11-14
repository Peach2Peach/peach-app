import { APPVERSION } from '../../constants'

export const defaultConfig: Config = {
  paymentMethods: [],
  peachPGPPublicKey: '',
  peachFee: 0.02,
  minAppVersion: APPVERSION,
  latestAppVersion: APPVERSION,
  minTradingAmount: 0,
  maxTradingAmount: Infinity,
  maxSellTradingAmount: Infinity,
  seenDisputeDisclaimer: false,
  hasSeenGroupHugAnnouncement: false,
}
