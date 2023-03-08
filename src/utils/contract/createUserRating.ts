import { crypto } from 'bitcoinjs-lib'
import { account } from '../account'
import { getPeachAccount } from '../peachAPI/peachAccount'
import { getMainAddress, getWallet } from '../wallet'

export const createUserRating = (userId: User['id'], rating: Rating['rating']): Rating => {
  const keyPair = getPeachAccount() || getMainAddress(getWallet())
  const signature = keyPair.sign(crypto.sha256(Buffer.from(userId))).toString('hex')

  return {
    creationDate: new Date(),
    rating,
    ratedBy: account.publicKey,
    signature,
  }
}
