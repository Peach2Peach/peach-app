import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount } from '.'
import { info } from '../log'
import { createRandomWallet, createWalletFromSeedPhrase, getNetwork } from '../wallet'
import { getMainAccount } from './getMainAccount'
import { NETWORK } from '@env'

export const createAccount = async (seedPhrase?: string): Promise<Account> => {
  info('Create account')
  const { wallet, mnemonic } = seedPhrase
    ? createWalletFromSeedPhrase(seedPhrase, getNetwork())
    : await createRandomWallet(getNetwork())
  const mainAccount = getMainAccount(wallet, NETWORK)
  const recipient = await OpenPGP.generate({})

  const newAccount = {
    ...defaultAccount,
    publicKey: mainAccount.publicKey.toString('hex'),
    privKey: (wallet.privateKey as Buffer).toString('hex'),
    mnemonic,
    pgp: {
      privateKey: recipient.privateKey,
      publicKey: recipient.publicKey,
    },
  }

  return newAccount
}
