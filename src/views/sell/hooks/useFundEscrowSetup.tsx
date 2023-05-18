import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCancelOffer, useHeaderSetup, useRoute } from '../../../hooks'
import { useFundingStatus } from '../../../hooks/query/useFundingStatus'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { isSellOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { shouldGetFundingStatus } from '../helpers/shouldGetFundingStatus'
import { useCreateEscrow } from './useCreateEscrow'
import { useHandleFundingStatus } from './useHandleFundingStatus'

const minLoadingTime = 1000
export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const { offerId } = route.params

  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const showErrorBanner = useShowErrorBanner()

  const { offer } = useOfferDetails(route.params.offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
  const [showLoading, setShowLoading] = useState(!sellOffer?.escrow ? Date.now() : 0)
  const canFetchFundingStatus = !sellOffer || shouldGetFundingStatus(sellOffer)
  const {
    fundingStatus,
    userConfirmationRequired,
    error: fundingStatusError,
  } = useFundingStatus(offerId, canFetchFundingStatus)
  const fundingAmount = sellOffer ? sellOffer.amount : 0
  const cancelOffer = useCancelOffer(sellOffer)

  useHeaderSetup(
    useMemo(
      () =>
        fundingStatus.status === 'MEMPOOL'
          ? {
            title: i18n('sell.funding.mempool.title'),
            hideGoBackButton: true,
            icons: [{ ...headerIcons.help, onPress: showMempoolHelp }],
          }
          : {
            title: i18n('sell.escrow.title'),
            hideGoBackButton: true,
            icons: [
              { ...headerIcons.cancel, onPress: cancelOffer },
              { ...headerIcons.help, onPress: showHelp },
            ],
          },
      [fundingStatus, cancelOffer, showHelp, showMempoolHelp],
    ),
  )

  useHandleFundingStatus({
    offerId,
    sellOffer,
    fundingStatus,
    userConfirmationRequired,
  })

  const onSuccess = useCallback(() => {
    const timeout = Math.max(0, minLoadingTime - (Date.now() - showLoading))
    setTimeout(() => setShowLoading(0), timeout)
  }, [showLoading])

  const { mutate: createEscrow, error: createEscrowError } = useCreateEscrow({
    offerId,
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

  return {
    offerId,
    isLoading: showLoading > 0,
    escrow: sellOffer?.escrow,
    createEscrowError,
    fundingStatus,
    fundingAmount,
    cancelOffer,
  }
}
