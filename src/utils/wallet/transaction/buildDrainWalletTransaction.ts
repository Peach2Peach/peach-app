import { TxBuilder } from 'bdk-rn'
import { getScriptPubKeyFromAddress } from './getScriptPubKeyFromAddress'

export const buildDrainWalletTransaction = async (address: string, feeRate?: number) => {
  const txBuilder = await new TxBuilder().create()

  if (feeRate) await txBuilder.feeRate(feeRate)
  await txBuilder.enableRbf()

  await txBuilder.drainWallet()
  await txBuilder.drainTo(await getScriptPubKeyFromAddress(address))

  return txBuilder
}
