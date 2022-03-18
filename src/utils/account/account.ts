import { setPeachAccount } from '../peachAPI'
import { createWallet, getMainAddress, setWallet, wallet } from '../wallet'

export const defaultAccount: Account = {
  settings: {},
  paymentData: [],
  offers: [],
  contracts: [],
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
export const setAccount = async (acc: Account) => {
  account = {
    ...defaultAccount,
    ...acc
  }

  setWallet((await createWallet(account.mnemonic)).wallet)

  const firstAddress = getMainAddress(wallet)
  setPeachAccount(firstAddress)
}
