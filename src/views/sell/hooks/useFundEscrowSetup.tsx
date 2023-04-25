import { useEffect, useMemo } from 'react'
import { CancelIcon, HelpIcon } from '../../../components/icons'
import { useCancelOffer, useHeaderSetup, useRoute } from '../../../hooks'
import { useFundingStatus } from '../../../hooks/query/useFundingStatus'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { isSellOffer } from '../../../utils/offer'
import { parseError } from '../../../utils/result'
import { shouldGetFundingStatus } from '../helpers/shouldGetFundingStatus'
import { useCreateEscrow } from './useCreateEscrow'
import { useHandleFundingStatus } from './useHandleFundingStatus'

export const useFundEscrowSetup = () => {
  const route = useRoute<'fundEscrow'>()
  const { offerId } = route.params

  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const showErrorBanner = useShowErrorBanner()

  const { offer } = useOfferDetails(route.params.offerId)
  const sellOffer = offer && isSellOffer(offer) ? offer : undefined
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
            icons: [{ iconComponent: <HelpIcon />, onPress: showMempoolHelp }],
          }
          : {
            title: i18n('sell.escrow.title'),
            hideGoBackButton: true,
            icons: [
              { iconComponent: <CancelIcon />, onPress: cancelOffer },
              { iconComponent: <HelpIcon />, onPress: showHelp },
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

  const { mutate: createEscrow, error: createEscrowError } = useCreateEscrow({
    offerId,
  })

  useEffect(() => {
    if (!sellOffer || sellOffer.escrow) return
    createEscrow()
  }, [sellOffer, createEscrow])

  useEffect(() => {
    if (!fundingStatusError) return
    showErrorBanner(parseError(fundingStatusError))
  }, [fundingStatusError, showErrorBanner])

  return {
    offerId,
    escrow: sellOffer?.escrow,
    createEscrowError,
    fundingStatus,
    fundingAmount,
    cancelOffer,
  }
}
