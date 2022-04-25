import { setAccount } from '.'
import { decrypt } from '../crypto'
import { error, info } from '../log'
import { saveOffer } from '../offer'
import { getOffers } from '../peachAPI'
import { setSession } from '../session'
import { account } from './account'

interface RecoverAccountProps {
  encryptedAccount: string,
  password: string,
}

/**
 * @description Method to recover account
 * @param props.encryptedAccount the account but password encrypted
 * @param [props.password] secret
 */
export const recoverAccount = async ({
  encryptedAccount,
  password = ''
}: RecoverAccountProps): Promise<[Account|null, Error|null]> => {
  info('Recovering account')

  try {
    await setAccount(JSON.parse(decrypt(encryptedAccount, password)))
    await setSession({ password })
    // console.log('XOXOXO', result)

    info('Get offers')
    const [result, err] = await getOffers()
    if (result?.length) {
      info(`Got ${result.length} offers`)
      result.map(offer => saveOffer(offer, true))
    } else if (err) {
      error('Error', err)
    }
    return [account, null]
  } catch (e) {
    return [null, e as Error]
  }
}