import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { createRandomWallet, createWalletFromSeedPhrase, getMainAddress, getNetwork } from '../wallet'

export const createAccount = async (seedPhrase?: string): Promise<Account> => {
  info('Create account')
  const { wallet, mnemonic } = seedPhrase
    ? createWalletFromSeedPhrase(seedPhrase, getNetwork())
    : await createRandomWallet(getNetwork())
  const firstAddress = getMainAddress(wallet)
  const recipient = await OpenPGP.generate({})

  const newAccount = {
    ...defaultAccount,
    publicKey: firstAddress.publicKey.toString('hex'),
    privKey: (wallet.privateKey as Buffer).toString('hex'),
    mnemonic,
    pgp: {
      privateKey: recipient.privateKey,
      publicKey: recipient.publicKey,
    },
  }
  return newAccount
}
