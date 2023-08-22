import { TxBuilder } from 'bdk-rn'
import { LocalUtxo } from 'bdk-rn/lib/classes/Bindings'
import { getScriptPubKeyFromAddress } from './getScriptPubKeyFromAddress'

export type BuildTxParams = {
  address?: string
  feeRate?: number
  utxos?: LocalUtxo[]
} & (
  | {
      amount: number
      shouldDrainWallet?: boolean
    }
  | {
      address?: string
      shouldDrainWallet: true
    }
  | {
      address?: undefined
    }
)
export const buildTransaction = async (args: BuildTxParams) => {
  const txBuilder = await buildTransactionBase(args.feeRate)
  if (!args.address) return txBuilder

  if (args?.utxos?.length) {
    txBuilder.addUtxos(args.utxos.map((utxo) => utxo.outpoint))
  }
  const recipient = await getScriptPubKeyFromAddress(args.address)
  if (args.shouldDrainWallet) {
    if (args?.utxos?.length) {
      await txBuilder.manuallySelectedOnly()
    } else {
      await txBuilder.drainWallet()
    }
    await txBuilder.drainTo(recipient)
  } else if (args.address) {
    await txBuilder.addRecipient(recipient, args.amount)
  }

  return txBuilder
}

async function buildTransactionBase (feeRate?: number) {
  const txBuilder = await new TxBuilder().create()

  if (feeRate) await txBuilder.feeRate(feeRate)
  await txBuilder.enableRbf()

  return txBuilder
}
