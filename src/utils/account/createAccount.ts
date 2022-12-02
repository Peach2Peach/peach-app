import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { setSessionItem } from '../session'
import { createRandomWallet, getMainAddress, getNetwork } from '../wallet'

/**
 * @description Method to create a new or existing account
 * @returns promise resolving to encrypted account
 */
export const createAccount = async (password: string): Promise<boolean> => {
  info('Create account')
  const { wallet, mnemonic } = await createRandomWallet(getNetwork())
  const firstAddress = getMainAddress(wallet)
  const recipient = await OpenPGP.generate({})

  await setSessionItem('password', password)
  await setAccount(
    {
      ...defaultAccount,
      publicKey: firstAddress.publicKey.toString('hex'),
      privKey: (wallet.privateKey as Buffer).toString('hex'),
      mnemonic,
      pgp: {
        privateKey: recipient.privateKey,
        publicKey: recipient.publicKey,
      },
    },
    true,
  )

  return true
}
