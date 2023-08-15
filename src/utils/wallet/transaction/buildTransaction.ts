import { TxBuilder } from 'bdk-rn'
import { getScriptPubKeyFromAddress } from './getScriptPubKeyFromAddress'

export const buildTransaction = async (address?: string, amount?: number, feeRate?: number) => {
  const txBuilder = await new TxBuilder().create()

  if (feeRate) await txBuilder.feeRate(feeRate)
  await txBuilder.enableRbf()

  if (address && amount) await txBuilder.addRecipient(await getScriptPubKeyFromAddress(address), amount)

  return txBuilder
}
