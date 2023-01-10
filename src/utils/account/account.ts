import { defaultSettings, settingsStore } from '../../store/settingsStore'
import { setLocaleQuiet } from '../i18n'
import { setPeachAccount } from '../peachAPI/peachAccount'
import { createRandomWallet, createWalletFromSeedPhrase, getMainAddress, getNetwork, setWallet } from '../wallet'
import { PeachWallet } from '../wallet/PeachWallet'
import { setPeachWallet } from '../wallet/setWallet'

export const defaultAccount: Account = {
  publicKey: '',
  settings: defaultSettings,
  paymentData: [],
  tradingLimit: {
    daily: 1000,
    dailyAmount: 0,
    yearly: 100000,
    yearlyAmount: 0,
  },
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
      settings: {
        ...defaultAccount.settings,
        ...acc.settings,
      },
      tradingLimit: defaultAccount.tradingLimit,
    }

  settingsStore.getState().updateSettings(account.settings)
  setLocaleQuiet(account.settings.locale || 'en')

  const peachWallet = new PeachWallet({})
  peachWallet.loadWallet(account.mnemonic)
  setPeachWallet(peachWallet)

  const { wallet } = account.mnemonic
    ? createWalletFromSeedPhrase(account.mnemonic, getNetwork())
    : await createRandomWallet(getNetwork())
  setWallet(wallet)
  const firstAddress = getMainAddress(wallet)
  setPeachAccount(firstAddress)
}
