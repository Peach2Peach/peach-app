
import * as bitcoin from 'bitcoinjs-lib'
import { account } from '../account'
import { getPeachAccount } from '../peachAPI'
import { getMainAddress, wallet } from '../wallet'

/**
 * @description Method to create rating object for given user
 * @param userId id of user to rate
 * @param rating the rating
 * @returns User Rating
 */
export const createUserRating = (userId: User['id'], rating: Rating['rating']): Rating => {
  const keyPair = getPeachAccount() || getMainAddress(wallet)
  const signature = keyPair.sign(bitcoin.crypto.sha256(Buffer.from(userId))).toString('hex')

  return {
    creationDate: new Date(),
    rating,
    ratedBy: account.publicKey,
    signature,
  }
}
