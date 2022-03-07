import { NETWORK } from '@env'
import * as bitcoin from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import { PsbtInput } from 'bip174/src/lib/interfaces'
import { getRandom } from './cryptoUtils'
const varuint = require('varuint-bitcoin')

export let wallet: bitcoin.bip32.BIP32Interface

const network = NETWORK === 'testnet'
  ? bitcoin.networks.testnet
  : NETWORK === 'regtest'
    ? bitcoin.networks.regtest
    : bitcoin.networks.bitcoin

/**
 * @description Method to get current bitcoin network
 * @returns current bitcoin network
 */
export const getNetwork = () => network

/**
 * @description Method to randomly create a new wallet or from seed phrase
 * @param mnemonic bitcoin seed phrase
 * @returns bip32 HD wallet
*/
export const createWallet = async (mnemonic? :string): Promise<PeachWallet> => {
  mnemonic = mnemonic || bip39.entropyToMnemonic(await getRandom(16))
  const seed = bip39.mnemonicToSeedSync(mnemonic)

  return {
    wallet: bitcoin.bip32.fromSeed(
      seed,
      network
    ),
    mnemonic
  }
}

export const getWallet = () => wallet
export const setWallet = (wllt: bitcoin.bip32.BIP32Interface) => wallet = wllt

/**
 * @description Method to get the first address of account
 * @param wllt the HD wllt
 * @returns main address
 */
export const getMainAddress = (wllt: bitcoin.bip32.BIP32Interface) =>
  wllt.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/0'`)

/**
 * @description Method to get the private key for the peach escrow
 * @param offerId offer id
 * @returns public key for escrow address
 */
export const getEscrowWallet = (offerId: string) =>
  wallet.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/${offerId}'`)


/**
 * @description Method to get the public key for the peach escrow
 * @param offerId offer id
 * @returns public key for escrow address
 */
export const getPublicKeyForEscrow = (offerId: string) =>
  wallet.derivePath(`m/48'/${NETWORK === 'bitcoin' ? '0' : '1'}'/0'/${offerId}'`).publicKey.toString('hex')


/**
 * @description Method to convert witness stack to script witness
 * @param witness witness stack
 * @returns script witness
 */
const witnessStackToScriptWitness = (witness: Buffer[]): Buffer => {
  let buffer = Buffer.allocUnsafe(0)

  const writeSlice = (slice: Buffer): void => {
    buffer = Buffer.concat([buffer, Buffer.from(slice)])
  }

  const writeVarInt = (i: number): void => {
    const currentLen = buffer.length
    const varintLen = varuint.encodingLength(i)

    buffer = Buffer.concat([buffer, Buffer.allocUnsafe(varintLen)])
    varuint.encode(i, buffer, currentLen)
  }

  const writeVarSlice = (slice: Buffer): void => {
    writeVarInt(slice.length)
    writeSlice(slice)
  }

  const writeVector = (vector: Buffer[]): void => {
    writeVarInt(vector.length)
    vector.forEach(writeVarSlice)
  }

  writeVector(witness)

  return buffer
}

/**
 * @description Method to to finalize scripts for Peach escrow PSBT
 * @param inputIndex index of input to finalize
 * @param input the input itself
 * @param script the script of given input
 * @returns final script
 */
export const getFinalScript = (inputIndex: number, input: PsbtInput, script: Buffer): {
  finalScriptSig: Buffer | undefined
  finalScriptWitness: Buffer | undefined
} => {
  const decompiled = bitcoin.script.decompile(script)
  const meaningFulSignatures = input.partialSig?.every(sig =>
    script.toString('hex').indexOf(sig.pubkey.toString('hex')) !== -1
  )
  if (!decompiled) {
    throw new Error(`Can not finalize input #${inputIndex}`)
  }
  if (!meaningFulSignatures) {
    throw new Error(`Can not finalize input #${inputIndex}. Signatures do not correspond to public keys`)
  }

  const payment = bitcoin.payments.p2wsh({
    network,
    redeem: {
      network,
      output: script,
      input: input.partialSig!.length === 2
        ? bitcoin.script.compile([
          input.partialSig![0].signature,
          input.partialSig![1].signature,
          bitcoin.opcodes.OP_FALSE
        ])
        : bitcoin.script.compile([
          input.partialSig![0].signature,
          bitcoin.opcodes.OP_TRUE,
        ])
    }
  })

  return {
    finalScriptSig: undefined,
    finalScriptWitness: payment.witness && payment.witness.length > 0
      ? witnessStackToScriptWitness(payment.witness)
      : undefined
  }
}