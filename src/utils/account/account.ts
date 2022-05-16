import { setPeachAccount } from '../peachAPI'
import { createWallet, getMainAddress, setWallet, wallet } from '../wallet'

export const defaultAccount: Account = {
  publicKey: '',
  settings: {},
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
  }
}

export let account = defaultAccount

export const getAccount = () => account


/**
 * @description Method to set account for app session
 * @param acc account
 */
export const setAccount = async (acc: Account, overwrite?: boolean) => {
  account = overwrite ? acc : {
    ...defaultAccount,
    ...acc,
    tradingLimit: defaultAccount.tradingLimit,
  }

  setWallet((await createWallet(account.mnemonic)).wallet)

  const firstAddress = getMainAddress(wallet)
  setPeachAccount(firstAddress)
}
