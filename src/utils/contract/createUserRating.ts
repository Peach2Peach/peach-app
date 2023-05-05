import { NETWORK } from '@env'
import { crypto } from 'bitcoinjs-lib'
import { account, getMainAccount } from '../account'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getWallet } from '../wallet'

export const createUserRating = (userId: User['id'], rating: Rating['rating']): Rating => {
  const keyPair = getPeachAccount() || getMainAccount(getWallet(), NETWORK)

  const signature = keyPair.sign(crypto.sha256(Buffer.from(userId))).toString('hex')

  return {
    creationDate: new Date(),
    rating,
    ratedBy: account.publicKey,
    signature,
  }
}
