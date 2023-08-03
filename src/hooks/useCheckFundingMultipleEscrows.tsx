import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { MSINAMINUTE } from '../constants'
import { sum } from '../utils/math'
import { keys } from '../utils/object'
import { getOffer, isSellOffer } from '../utils/offer'
import { isDefined } from '../utils/validation'
import { peachWallet } from '../utils/wallet/setWallet'
import { buildTransaction, setMultipleRecipients } from '../utils/wallet/transaction'
import { useWalletState } from '../utils/wallet/walletStore'
import { useFeeRate } from './useFeeRate'
import { useInterval } from './useInterval'

const estimateTransactionSize = (inputs: number, outputs: number) => {
  const overhead = 10.5
  const inputSize = 68 * inputs
  const outputSize = 43 * outputs
  return overhead + inputSize + outputSize
}

const getEscrowAddresses = (fundMultipleMap: Record<string, string[]>, address: string) => {
  const offers = fundMultipleMap[address].map(getOffer)
  const escrows = offers
    .filter(isDefined)
    .filter(isSellOffer)
    .map((offr) => offr.escrow)
    .filter(isDefined)
  return escrows
}

export const useCheckFundingMultipleEscrows = () => {
  const [fundMultipleMap, unregisterFundMultiple] = useWalletState(
    (state) => [state.fundMultipleMap, state.unregisterFundMultiple],
    shallow,
  )
  const feeRate = useFeeRate()
  const addresses = keys(fundMultipleMap)

  const checkAddress = useCallback(
    async (address: string) => {
      const escrows = getEscrowAddresses(fundMultipleMap, address)
      if (escrows.length === 0) return

      const localUtxo = await peachWallet.getAddressUTXO(address)
      if (localUtxo.length === 0) return

      const availableAmount = localUtxo.map((utx) => utx.txout.value).reduce(sum, 0)
      const estimatedTxSize = estimateTransactionSize(localUtxo.length, escrows.length)
      const amountAfterFees = availableAmount - estimatedTxSize * feeRate

      const transaction = await buildTransaction(undefined, undefined, feeRate)
      await transaction.addUtxos(localUtxo.map((utx) => utx.outpoint))
      await setMultipleRecipients(transaction, amountAfterFees, escrows)

      const finishedTransaction = await peachWallet.finishTransaction(transaction)
      try {
        await peachWallet.signAndBroadcastPSBT(finishedTransaction.psbt)
        unregisterFundMultiple(address)
      } catch (e) {}
    },
    [feeRate, fundMultipleMap, unregisterFundMultiple],
  )

  const callback = useCallback(async () => {
    await Promise.all(addresses.map(checkAddress))
  }, [addresses, checkAddress])

  useInterval({
    callback,
    interval: addresses.length > 0 ? MSINAMINUTE : null,
  })
}
