import { LocalUtxo } from 'bdk-rn/lib/classes/Bindings'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { MSINAMINUTE } from '../constants'
import { useTradeSummaryStore } from '../store/tradeSummaryStore'
import { estimateTransactionSize } from '../utils/bitcoin'
import { sum } from '../utils/math'
import { keys } from '../utils/object'
import { getOffer, isSellOffer } from '../utils/offer'
import { isDefined } from '../utils/validation'
import { peachWallet } from '../utils/wallet/setWallet'
import { buildTransaction, setMultipleRecipients } from '../utils/wallet/transaction'
import { useWalletState } from '../utils/wallet/walletStore'
import { useHandleTransactionError } from './error/useHandleTransactionError'
import { useFeeRate } from './useFeeRate'
import { useInterval } from './useInterval'

const getAmountAfterFees = (localUtxo: LocalUtxo[], escrows: string[], feeRate: number) => {
  const availableAmount = localUtxo.map((utx) => utx.txout.value).reduce(sum, 0)
  const estimatedTxSize = estimateTransactionSize(localUtxo.length, escrows.length)
  const amountAfterFees = availableAmount - estimatedTxSize * feeRate
  return amountAfterFees
}

const getSellOffersByAddress = (fundMultipleMap: Record<string, string[]>, address: string) => {
  const offers = fundMultipleMap[address].map(getOffer)
  const sellOffers = offers.filter(isDefined).filter(isSellOffer)

  return sellOffers
}
const canFundSellOffers = (sellOffers: SellOffer[], offers: OfferSummary[]) => {
  const sellOfferIds = sellOffers.map((offer) => offer.id)
  if (sellOfferIds.length === 0) return false

  return offers.filter((offer) => sellOfferIds.includes(offer.id)).every((offer) => offer.fundingTxId)
}

const getEscrowAddresses = (sellOffers: SellOffer[]) => sellOffers.map((offr) => offr.escrow).filter(isDefined)

export const useCheckFundingMultipleEscrows = () => {
  const [fundMultipleMap, unregisterFundMultiple] = useWalletState(
    (state) => [state.fundMultipleMap, state.unregisterFundMultiple],
    shallow,
  )
  const handleTransactionError = useHandleTransactionError()
  const offerSummaries = useTradeSummaryStore((state) => state.offers)
  const feeRate = useFeeRate()
  const addresses = keys(fundMultipleMap)

  const checkAddress = useCallback(
    async (address: string) => {
      const sellOffers = getSellOffersByAddress(fundMultipleMap, address)

      if (!canFundSellOffers(sellOffers, offerSummaries)) {
        unregisterFundMultiple(address)
        return
      }

      const escrows = getEscrowAddresses(sellOffers)
      if (escrows.length === 0) return

      const localUtxo = await peachWallet.getAddressUTXO(address)
      if (localUtxo.length === 0) return

      const amountAfterFees = getAmountAfterFees(localUtxo, escrows, feeRate)
      const transaction = await buildTransaction({ feeRate, utxos: localUtxo })
      await setMultipleRecipients(transaction, amountAfterFees, escrows)

      try {
        const finishedTransaction = await peachWallet.finishTransaction(transaction)
        await peachWallet.signAndBroadcastPSBT(finishedTransaction.psbt)
      } catch (e) {
        handleTransactionError(e)
      }
    },
    [feeRate, fundMultipleMap, handleTransactionError, offerSummaries, unregisterFundMultiple],
  )

  const callback = useCallback(async () => {
    await Promise.all(addresses.map(checkAddress))
  }, [addresses, checkAddress])

  useInterval({
    callback,
    interval: addresses.length > 0 ? MSINAMINUTE : null,
  })
}
