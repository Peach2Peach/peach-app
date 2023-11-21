import { NETWORK } from '@env'
import OpenPGP from 'react-native-fast-openpgp'
import { info } from '../log'
import { createRandomWallet, createWalletFromSeedPhrase, getNetwork } from '../wallet'
import { defaultAccount } from './account'
import { getMainAccount } from './getMainAccount'

export const createAccount = async (seedPhrase?: string) => {
  info('Create account')
  const { wallet, mnemonic } = seedPhrase
    ? createWalletFromSeedPhrase(seedPhrase, getNetwork())
    : await createRandomWallet(getNetwork())
  const mainAccount = getMainAccount(wallet, NETWORK)
  const recipient = await OpenPGP.generate({})
  const publicKey = mainAccount.publicKey.toString('hex')

  const newAccount = {
    ...defaultAccount,
    publicKey,
    privKey: (wallet.privateKey as Buffer).toString('hex'),
    mnemonic,
    base58: wallet.toBase58(),
    pgp: {
      privateKey: recipient.privateKey,
      publicKey: recipient.publicKey,
    },
  }

  return newAccount
}
