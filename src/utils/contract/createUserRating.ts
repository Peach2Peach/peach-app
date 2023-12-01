import { NETWORK } from '@env'
import { crypto } from 'bitcoinjs-lib'
import { getMainAccount } from '../account'
import { useAccountStore } from '../account/account'
import { peachAPI } from '../peachAPI'
import { getWallet } from '../wallet'

export const createUserRating = (userId: User['id'], rating: Rating['rating']): Rating => {
  const keyPair = peachAPI.options.peachAccount || getMainAccount(getWallet(), NETWORK)

  const signature = keyPair.sign(crypto.sha256(Buffer.from(userId))).toString('hex')

  const ratedBy = useAccountStore.getState().account.publicKey

  return {
    creationDate: new Date(),
    rating,
    ratedBy,
    signature,
  }
}
