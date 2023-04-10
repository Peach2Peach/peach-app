import { settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { createRandomWallet, createWalletFromSeedPhrase, getMainAddress, getNetwork, setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'

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

export const getAccount = () => account

/**
 * @description Method to set account for app session
 */
export const setAccount = async (acc: Account, overwrite?: boolean) => {
  account = overwrite
    ? acc
    : {
      ...defaultAccount,
      ...acc,
      tradingLimit: defaultAccount.tradingLimit,
    }

  setLocaleQuiet(settingsStore.getState().locale || 'en')

  if (account.mnemonic) {
    const { wallet } = account.mnemonic
      ? createWalletFromSeedPhrase(account.mnemonic, getNetwork())
      : await createRandomWallet(getNetwork())
    setWallet(wallet)
    const firstAddress = getMainAddress(wallet)
    setPeachAccount(firstAddress)

    const peachWallet = new PeachWallet({ wallet })
    peachWallet.loadWallet(account.mnemonic)
    setPeachWallet(peachWallet)
  }
}
