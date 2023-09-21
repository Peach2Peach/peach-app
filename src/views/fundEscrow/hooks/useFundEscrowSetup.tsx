import { useCallback, useEffect, useState } from 'react'
import { MSINAMINUTE } from '../../../constants'
import { useCancelOffer, useInterval, useRoute } from '../../../hooks'
import { useFundingStatus } from '../../../hooks/query/useFundingStatus'
import { useMultipleOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { isSellOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { isDefined } from '../../../utils/validation'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { shouldGetFundingStatus } from '../../sell/helpers/shouldGetFundingStatus'
import { useSyncWallet } from '../../wallet/hooks/useSyncWallet'
import { getFundingAmount } from '../helpers/getFundingAmount'
import { useCreateEscrow } from './useCreateEscrow'
import { useFundEscrowHeader } from './useFundEscrowHeader'
import { useHandleFundingStatus } from './useHandleFundingStatus'

const MIN_LOADING_TIME = 1000

export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const { offerId } = route.params

  const showErrorBanner = useShowErrorBanner()
  const { refresh } = useSyncWallet()

  const fundMultiple = useWalletState((state) => state.getFundMultipleByOfferId(offerId))
  const { offers } = useMultipleOfferDetails(fundMultiple?.offerIds || [route.params.offerId])
  const offer = offers[0]
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const [showLoading, setShowLoading] = useState(!sellOffer?.escrow ? Date.now() : 0)
  const canFetchFundingStatus = !sellOffer || shouldGetFundingStatus(sellOffer)
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
  } = useFundingStatus(offerId, canFetchFundingStatus)
  const escrows = offers
    .filter(isDefined)
    .filter(isSellOffer)
    .map((offr) => offr.escrow)
    .filter(isDefined)
  const fundingAmount = getFundingAmount(sellOffer, fundMultiple)
  const cancelOffer = useCancelOffer(sellOffer)

  useFundEscrowHeader({ fundingStatus, sellOffer, fundMultiple })

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  })

  const onSuccess = useCallback(() => {
    const timeout = Math.max(0, MIN_LOADING_TIME - (Date.now() - showLoading))
    setTimeout(() => setShowLoading(0), timeout)
  }, [showLoading])

  const { mutate: createEscrow, error: createEscrowError } = useCreateEscrow({
    offerIds: fundMultiple?.offerIds || [offerId],
  })

  useEffect(() => {
    if (!sellOffer || sellOffer.escrow) return
    createEscrow(undefined, {
      onSuccess,
    })
  }, [sellOffer, createEscrow, onSuccess])

  useEffect(() => {
    if (!fundingStatusError) return
    showErrorBanner(parseError(fundingStatusError))
  }, [fundingStatusError, showErrorBanner])

  const syncPeachWallet = useCallback(() => {
    if (fundMultiple) refresh()
  }, [fundMultiple, refresh])

  useInterval({ callback: syncPeachWallet, interval: MSINAMINUTE * 2 })

  return {
    offerId,
    isLoading: showLoading > 0,
    fundingAddress: fundMultiple?.address || sellOffer?.escrow,
    fundingAddresses: escrows,
    createEscrowError,
    fundingStatus,
    fundingAmount,
    cancelOffer,
  }
}
