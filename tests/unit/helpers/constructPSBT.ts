import { BIP32Interface } from 'bip32'
import { Psbt, payments } from 'bitcoinjs-lib'
import { getNetwork } from '../../../src/utils/wallet'
import { getScript } from './getScript'
import { sha256 } from 'bitcoinjs-lib/src/crypto'

export const constructPSBT = (wallet: BIP32Interface) => {
  const network = getNetwork()
  const p2wsh = payments.p2wsh({
    network,
    redeem: {
      output: getScript(wallet.publicKey),
      network,
    },
  })
  const psbt = new Psbt({ network })
  psbt.addInput({
    hash: 'd8a31704d33febfc8a4271c3f9d65b5d7679c5cab19f25058f2d7d2bc6e7b86c',
    index: 0,
    witnessScript: p2wsh.redeem!.output!,
    witnessUtxo: {
      script: Buffer.from('0020' + sha256(p2wsh.redeem!.output!).toString('hex'), 'hex'),
      value: 10000000,
    },
  })
  psbt.addOutput({
    address: 'bcrt1q348u075ehsuk0rz9lat22zrhlpgspj4twmt3m3pf0e5jjdm98u4qpet6g7',
    value: 10000000 - 300,
  })
  return psbt
}
