import OpenPGP from 'react-native-fast-openpgp'
import { defaultAccount, setAccount } from '.'
import { info } from '../log'
import { setSession } from '../session'
import { createWallet, getMainAddress } from '../wallet'

interface CreateAccountProps {
  password: string,
  onSuccess: Function,
  onError: Function
}

/**
 * @description Method to create a new or existing account
 * @param [password] secret
 * @param onSuccess callback on success
 * @param onError callback on error
 * @returns promise resolving to encrypted account
 */
export const createAccount = async ({
  password = '',
  onSuccess,
  onError
}: CreateAccountProps): Promise<void> => {
  info('Create account')
  const { wallet, mnemonic } = await createWallet()
  const firstAddress = getMainAddress(wallet)
  const recipient = await OpenPGP.generate({})

  await setSession({ password })
  await setAccount({
    ...defaultAccount,
    publicKey: firstAddress.publicKey.toString('hex'),
    privKey: (wallet.privateKey as Buffer).toString('hex'),
    mnemonic,
    pgp: {
      privateKey: recipient.privateKey,
      publicKey: recipient.publicKey
    }
  })

  onSuccess()
}