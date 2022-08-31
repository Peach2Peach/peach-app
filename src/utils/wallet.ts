import { NETWORK } from '@env'
import { networks, payments, script, opcodes } from 'bitcoinjs-lib'
import BIP32Factory, { BIP32Interface } from 'bip32'
import * as ecc from 'tiny-secp256k1'
import * as bip39 from 'bip39'
import { PsbtInput } from 'bip174/src/lib/interfaces'
import { getRandom } from './crypto'
const varuint = require('varuint-bitcoin')

const bip32 = BIP32Factory(ecc)

export let wallet: BIP32Interface

export const network = NETWORK === 'testnet'
  ? networks.testnet
  : NETWORK === 'regtest'
    ? networks.regtest
    : networks.bitcoin

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
    wallet: bip32.fromSeed(
      seed,
      network
    ),
    mnemonic
  }
}

export const getWallet = () => wallet
export const setWallet = (wllt: BIP32Interface) => wallet = wllt

/**
 * @description Method to get the first address of account
 * @param wllt the HD wllt
 * @returns main address
 */
export const getMainAddress = (wllt: BIP32Interface) =>
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
 * @param bitcoinScript the script of given input
 * @returns final script
 */
export const getFinalScript = (inputIndex: number, input: PsbtInput, bitcoinScript: Buffer): {
  finalScriptSig: Buffer | undefined
  finalScriptWitness: Buffer | undefined
} => {
  const decompiled = script.decompile(bitcoinScript)
  const meaningFulSignatures = input.partialSig?.every(sig =>
    bitcoinScript.toString('hex').indexOf(sig.pubkey.toString('hex')) !== -1
  )
  if (!decompiled) {
    throw new Error(`Can not finalize input #${inputIndex}`)
  }
  if (!meaningFulSignatures) {
    throw new Error(`Can not finalize input #${inputIndex}. Signatures do not correspond to public keys`)
  }

  const payment = payments.p2wsh({
    network,
    redeem: {
      network,
      output: bitcoinScript,
      input: input.partialSig!.length === 2
        ? script.compile([
          input.partialSig![0].signature,
          input.partialSig![1].signature,
          opcodes.OP_FALSE
        ])
        : script.compile([
          input.partialSig![0].signature,
          opcodes.OP_TRUE,
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