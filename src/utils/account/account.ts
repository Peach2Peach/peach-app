import { setPeachAccount } from '../peachAPI'
import { createWallet, getWallet, setWallet } from '../wallet'

export const defaultAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
  contracts: [],
}

export let account = defaultAccount

export const getAccount = () => account


/**
 * @description Method to set account for app session
 * @param acc account
 */
export const setAccount = async (acc: Account) => {
  account = {
    ...defaultAccount,
    ...acc
  }

  setWallet((await createWallet(account.mnemonic)).wallet) // TODO add error handling
  setPeachAccount(getWallet())
}
