import analytics from '@react-native-firebase/analytics'

import { setAccount, defaultAccount } from '.'
import { deleteFile, exists } from '../file'
import { info } from '../log'
import { deleteAccessToken, deletePeachAccount, logoutUser } from '../peachAPI'
import { setSession } from '../session'

interface DeleteAccountProps {
  onSuccess: Function
}

const accountFiles = [
  '/peach-account-identity.json',
  '/peach-account-settings.json',
  '/peach-account-tradingLimit.json',
  '/peach-account-paymentData.json',
  '/peach-account-offers.json',
  '/peach-account-contracts.json',
  '/peach-account-chats.json',
  '/peach-account.json',
]

/**
 * @description Method to delete account
 * @param props.onSuccess callback on success
 * @param props.onError callback on error
 */
export const deleteAccount = async ({ onSuccess }: DeleteAccountProps) => {
  info('Deleting account')

  setAccount(defaultAccount, true)

  accountFiles.forEach(async file => {
    if (await exists(file)) await deleteFile(file)
  })

  logoutUser()
  await setSession({ password: null })
  deleteAccessToken()
  deletePeachAccount()
  onSuccess()
  analytics().logEvent('account_deleted')
}
