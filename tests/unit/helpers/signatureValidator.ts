import { ECPairFactory } from 'ecpair'
import { getNetwork } from '../../../src/utils/wallet/getNetwork'
const ecc = require('tiny-secp256k1')
const ECPair = ECPairFactory(ecc)

export const signatureValidator = (publicKey: Buffer, msgHash: Buffer, signature: Buffer) => {
  if (!signature) return false

  const network = getNetwork()
  const keyPair = ECPair.fromPublicKey(publicKey, { network })
  return keyPair.verify(msgHash, signature)
}
