import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { createWalletFromSeedPhrase, getNetwork, setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'
import { createPeachAccount } from './createPeachAccount'

export const defaultLimits = {
  daily: 1000,
  dailyAmount: 0,
  monthlyAnonymous: 1000,
  monthlyAnonymousAmount: 0,
  yearly: 100000,
  yearlyAmount: 0,
}

export const defaultAccount: Account = {
  publicKey: '',
  paymentData: [],
  legacyPaymentData: [],
  tradingLimit: defaultLimits,
  offers: [],
  contracts: [],
  chats: {},
  pgp: {
    privateKey: '',
    publicKey: '',
  },
}

export let account = defaultAccount
export const setAccount = (acc: Account) => (account = acc)
export const getAccount = () => account
